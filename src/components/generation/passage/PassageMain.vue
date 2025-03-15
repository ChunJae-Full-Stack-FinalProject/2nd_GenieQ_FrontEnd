<template>
    <div class="app-container">
        <p id="main-title">지문 생성</p>
        <div class="main-content">
            <CreatePassageMain ref="createPassageMainRef" @input-change="updateInputText" @category-change="updateCategory" @title-change="updateTitle"/>
            <PaymentUsage ref="paymentUsageRef" @credit-update="onCreditUpdate"/>
            <BaseButton id="reset_button" text="초기화" type="type2" width="248px" height="54px" :disabled="!hasContent" @click="resetText"/>
            <BaseButton 
                id="create_button" 
                text="지문 생성하기" 
                type="type2" 
                width="248px" 
                height="54px"
                :disabled="!isButtonEnabled"
                @click="handleCreatePassage"
            />
            
            <!-- 확인 모달 추가 -->
            <WarningModalComponent
                :isOpen="isConfirmModalOpen"
                title="지문을 생성하시겠습니까?"
                message="생성 시 이용권이 차감되며, 오타가 있을 경우 AI가 잘못된 지문을 생성할 수 있습니다."
                cancelText="취소하기"
                confirmText="생성하기"
                @close="closeConfirmModal"
                @confirm="confirmCreatePassage"
            />
            
            <!-- 경고 모달 추가 -->
            <WarningModalComponent
                :isOpen="isWarningModalOpen"
                title="작업 내역 초과"
                message="최근 작업 내역이 가득 찼습니다. 이전 작업을 삭제하고 진행하시겠습니까?"
                cancelText="취소하기"
                confirmText="삭제 후 진행하기"
                @close="closeWarningModal"
                @confirm="confirmAfterWarning"
            />

            <!-- 로딩 표시 추가 -->
            <div v-if="isLoading" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>{{ loadingMessage }}</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import CreatePassageMain from '@/components/generation/passage/PassageMain/CreatePassageMain.vue';
import PaymentUsage from '@/components/generation/PaymentUsage.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import ConfirmModalComponent from '@/components/common/modal/type/ConfirmModalComponent.vue';
import WarningModalComponent from '@/components/common/modal/type/WarningModalComponent.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// 라우터 및 인증 스토어
const router = useRouter();
const authStore = useAuthStore();

// 사용자 입력 관련 상태
const titleText = ref('');
const inputText = ref('');
const selectedCategory = ref('human');
const passageTitle = ref('');
const createPassageMainRef = ref(null);
const paymentUsageRef = ref(null);

// UI 상태 관리
const isConfirmModalOpen = ref(false);
const isWarningModalOpen = ref(false);
const isLoading = ref(false);
const loadingMessage = ref('지문을 생성 중입니다...');

// 중복 요청 방지를 위한 처리 상태 플래그 추가
const isProcessing = ref(false);

// 더미 데이터 정의 - API 실패 시 사용
const dummyPassageData = {
    generated_passage: `인공지능과 기계학습은 현대 기술의 핵심 요소로 자리 잡고 있습니다. 이러한 기술은 데이터 처리와 분석을 통해 지속적으로 성능을 개선하며, 이는 의료, 금융, 제조업 등 다양한 분야에 걸쳐 응용되고 있습니다.

    연구 커뮤니티는 이러한 모델의 규모를 확장하면 성능이 향상된다고 인정합니다. 대규모 언어 모델(LLMs)은 인공지능이 인간 언어를 이해하고 생성하는 방식을 변화시키고 있습니다.

    ChatGPT와 같은 혁신은 LLMs가 독특한 문제 해결 능력을 보여주기 시작했음을 나타냅니다. 이러한 발전은 다양한 분야에서 새로운 응용 프로그램을 만들어내고 있습니다.
    ChatGPT와 같은 혁신은 LLMs가 독특한 문제 해결 능력을 보여주기 시작했음을 나타냅니다. 이러한 발전은 다양한 분야에서 새로운 응용 프로그램을 만들어내고 있습니다.
    ChatGPT와 같은 혁신은 LLMs가 독특한 문제 해결 능력을 보여주기 시작했음을 나타냅니다. 이러한 발전은 다양한 분야에서 새로운 응용 프로그램을 만들어내고 있습니다.

    연구자들은 LLMs의 잠재력을 확대하기 위해 새로운 아키텍처와 훈련 전략을 탐구하고 있습니다. 인공지능의 발전은 효율적인 데이터 이용을 통해 새로운 가능성을 제공하고 있지만, 동시에 윤리적 문제도 동반할 수 있습니다. 따라서 기술의 공정성과 투명성을 확보하기 위한 관리가 필요합니다.`,
    
    generated_core_point: [
        '인공지능과 기계학습의 원리는 데이터 처리와 분석을 통해 성능을 개선하는 것이다.',
        '기계학습의 응용은 의료, 금융, 제조업 등 다양한 분야에 걸쳐 있으며, 데이터의 효율적 이용을 통해 새로운 가능성을 제공한다.',
        '인공지능과 기계학습의 활용은 윤리적 문제를 동반할 수 있으며, 기술의 공정성과 투명성을 확보하기 위한 관리가 필요하다.'
    ]
};

// 버튼 활성화 상태 계산 - authStore.userTicketCount 사용
const isButtonEnabled = computed(() => {
    // authStore의 userTicketCount getter 사용
    const ticketCount = authStore.userTicketCount;
    
    // 입력 텍스트가 있고 보유 이용권이 0보다 큰 경우 활성화
    const isEnabled = inputText.value.length >= 1 && titleText.value.length >= 1 && ticketCount > 0;
    
    console.log('버튼 활성화 상태:', { 
        inputTextLength: inputText.value.length, 
        titleTextLength: titleText.value.length,
        ticketCount, 
        isEnabled 
    });
    
    return isEnabled;
});

// 내용 존재 여부 계산
const hasContent = computed(() => {
    return inputText.value && inputText.value.trim().length > 0;
});

// PaymentUsage 컴포넌트에서 이용권 업데이트 시 호출될 함수
const onCreditUpdate = (count) => {
    console.log('이용권 업데이트 이벤트:', count);
    // 이용권 정보 갱신 (선택적으로 사용 가능)
    authStore.updateTicketCount().then(newCount => {
        console.log('authStore 이용권 업데이트됨:', newCount);
    });
};

// 제목 업데이트 함수 추가
const updateTitle = (text) => {
  titleText.value = text;
  console.log('작업 이름 업데이트:', text);
};

// 지문 제재 업데이트 함수
const updateInputText = (text) => {
    inputText.value = text;
    console.log('입력 텍스트 업데이트:', text);
};

// 지문 분야 업데이트 함수
const updateCategory = (category) => {
    selectedCategory.value = category;
    console.log('선택된 카테고리 업데이트:', category);
};

// 초기화 함수
const resetText = () => {
    inputText.value = '';

    if (createPassageMainRef.value) {
        createPassageMainRef.value.resetForm();
    }
    console.log('입력 내용 초기화 완료');
};

// 지문 생성하기 버튼 클릭 핸들러
const handleCreatePassage = () => {
    console.log('지문 생성하기 버튼 클릭됨');
    
    // 작업 이름 가져오기
    try {
        const titleElement = document.querySelector('#passage-title');
        passageTitle.value = titleElement ? titleElement.value : '지문 작업';
        console.log('작업 이름:', passageTitle.value);
    } catch (error) {
        console.error('작업 이름 가져오기 실패:', error);
        passageTitle.value = '지문 작업';
    }
    
    // 작업 내역 확인
    const isWorkHistoryFull = checkWorkHistoryFull();
    
    if (isWorkHistoryFull) {
        // 작업 내역이 가득 찬 경우 경고 모달 표시
        isWarningModalOpen.value = true;
    } else {
        // 일반적인 경우 확인 모달 표시
        isConfirmModalOpen.value = true;
    }
};

// 최근 작업 내역이 가득 찼는지 확인하는 함수
const checkWorkHistoryFull = () => {
    // 여기에 작업 내역 확인 로직 구현
    // 예: 로컬 스토리지에서 작업 내역 개수 확인 등
    
    // 현재는 테스트를 위해 임의의 값 반환 (실제로는 적절한 로직으로 대체)
    // return Math.random() > 0.5; // 50% 확률로 가득 참/아님 반환
    return false; // 기본값은 가득 차지 않음
};

// 확인 모달 관련 핸들러
const closeConfirmModal = () => {
    isConfirmModalOpen.value = false;
};

const closeWarningModal = () => {
    isWarningModalOpen.value = false;
};

const confirmAfterWarning = () => {
    // 이전 작업 삭제 로직이 있다면 여기에 구현
    confirmCreatePassage();
};

// 지문 생성 확인 시 실행되는 함수
const confirmCreatePassage = async () => {
    console.log('지문 생성 확인 모달에서 생성하기 버튼 클릭됨');
    
    // 이미 처리 중이면 중복 실행 방지
    if (isProcessing.value) {
        console.log('이미 처리 중입니다. 중복 요청 방지');
        return;
    }
    
    // 처리 중 플래그 활성화
    isProcessing.value = true;
    
    // 모달 닫기 및 로딩 시작
    isConfirmModalOpen.value = false;
    isLoading.value = true;
    loadingMessage.value = '지문을 생성 중입니다...';
    
    try {
        // 이용권 체크 (확실하게 하기 위해 한번 더 확인)
        if (authStore.userTicketCount <= 0) {
            throw new Error('이용권이 부족합니다. 이용권을 구매해주세요.');
        }
        
        // 지문 생성 API 요청 데이터 준비
        const requestData = {
            type_passage: selectedCategory.value,
            keyword: inputText.value
        };
        
        console.log('지문 생성 API 요청 데이터:', requestData);
        
        // 실제 외부 API 호출 (현재는 주석 처리)
        /* 
        const response = await fetch("http://10.41.1.56:7777/generate-passage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });
        
        if (!response.ok) {
            throw new Error('API 호출 실패: ' + response.status);
        }
        
        const data = await response.json();
        */
        
        // 임시로 더미 데이터 사용 (API 시뮬레이션)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const data = {
            generated_passage: dummyPassageData.generated_passage,
            generated_core_point: dummyPassageData.generated_core_point
        };
        
        console.log('생성된 지문:', data.generated_passage.substring(0, 100) + '...');
        console.log('핵심 논점:', data.generated_core_point);
        
        // 백엔드 API에 저장 요청
        await savePassageToBackend(data);
        
    } catch (error) {
        console.error('지문 생성 중 오류 발생:', error);
        alert('지문 생성 중 오류가 발생했습니다: ' + error.message);
        
        // 에러가 '이용권 부족'이 아닌 경우에만 더미 데이터로 진행
        if (!error.message.includes('이용권이 부족')) {
            // 에러 발생 시에도 더미 데이터 준비
            const dummyData = {
                generated_passage: dummyPassageData.generated_passage,
                generated_core_point: dummyPassageData.generated_core_point
            };
            
            // 더미 데이터로 백엔드에 저장 요청 (중복 저장 발생 지점)
            try {
                await savePassageToBackend(dummyData);
            } catch (saveError) {
                console.error('더미 데이터 저장 중 오류:', saveError);
                alert('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        }
    } finally {
        // 로딩 및 처리 상태 종료
        isLoading.value = false;
        isProcessing.value = false;
    }
};

// 백엔드 API에 지문 저장 함수
const savePassageToBackend = async (data) => {
    console.log('백엔드 API 저장 요청 시작');
    loadingMessage.value = '생성된 지문을 저장 중입니다...';
    
    try {
        // 저장할 데이터 준비
        const saveData = {
            type: selectedCategory.value,
            keyword: inputText.value,
            title: passageTitle.value || '지문 작업',
            content: data.generated_passage,
            gist: Array.isArray(data.generated_core_point) 
                ? data.generated_core_point.join('\n') 
                : data.generated_core_point,
            isGenerated: 1
        };
        
        console.log('저장 요청 데이터:', saveData);
        
        const apiUrl = import.meta.env.VITE_API_URL;
        
        // 백엔드 API 호출
        const response = await fetch(`${apiUrl}/pass/insert/each`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(saveData)
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                // 인증 오류 처리
                authStore.user = null;
                authStore.isAuthenticated = false;
                localStorage.removeItem('authUser');
                router.push({ 
                    path: '/login', 
                    query: { redirect: router.currentRoute.value.fullPath }
                });
                throw new Error('인증이 필요합니다');
            }
            throw new Error('저장 API 호출 실패: ' + response.status);
        }
        
        const responseData = await response.json();
        console.log('저장 응답 데이터:', responseData);
        
        // 이용권 정보 업데이트
        authStore.updateTicketCount();
        
        // 저장 데이터를 전역 상태로 저장
        // 통일된 형식으로 저장: { type, keyword, title, content, gist, pasCode }
        const passageData = {
            type: selectedCategory.value,
            keyword: inputText.value,
            title: passageTitle.value || '지문 작업',
            content: data.generated_passage,
            gist: Array.isArray(data.generated_core_point) 
                ? data.generated_core_point
                : [data.generated_core_point],
            pasCode: responseData.pasCode
        };
        
        // 로컬 스토리지에 저장
        localStorage.setItem('genieq-passage-data', JSON.stringify(passageData));
        console.log('로컬 스토리지에 저장된 데이터:', passageData);
        
        // 페이지 이동
        router.push('/passage/create');
        
    } catch (error) {
        console.error('백엔드 저장 중 오류:', error);
        
        // 에러 발생 시 더미 데이터를 로컬 스토리지에 저장하고 페이지 이동
        const dummyResponseData = {
            pasCode: Math.floor(Math.random() * 1000) + 1,
            title: passageTitle.value || '지문 작업',
            type: selectedCategory.value,
            keyword: inputText.value,
            content: data.generated_passage,
            gist: Array.isArray(data.generated_core_point) 
                ? data.generated_core_point
                : [data.generated_core_point]
        };
        
        localStorage.setItem('genieq-passage-data', JSON.stringify(dummyResponseData));
        console.log('오류 발생으로 더미 데이터 저장:', dummyResponseData);
        
        // 페이지 이동
        router.push('/passage/create');
        
        // 오류를 상위로 전파하지 않고 여기서 처리 완료
    }
};

// 컴포넌트 마운트 시 실행
onMounted(() => {
    console.log('PassageMain 컴포넌트 마운트');
    
    // 이전 데이터 초기화
    localStorage.removeItem('genieq-passage-data');
    
    // 이용권 정보 업데이트
    authStore.updateTicketCount().then(ticketCount => {
        console.log('이용권 정보 업데이트 완료:', ticketCount);
    });
});
</script>
<style scoped>
.app-container {
    width: 100%;
    padding: 20px 30px 80px 20px;
}
#main-title {
    position: absolute;
    width: 87px;
    height: 36px;
    left: 292px;
    top: 70px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;
}
#reset_button {
    position: absolute;
    left: 1244px;
    top: 852px;
}
#create_button {
    position: absolute;
    left: 1516px;
    top: 852px;
}
</style>