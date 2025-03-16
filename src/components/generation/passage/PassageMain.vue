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
            
            <!-- 작업 공간 부족 모달 추가 -->
            <ConfirmModalComponent
                :isOpen="isListLimitModalOpen"
                title="최근 작업 내역이 꽉 찼습니다."
                message="생성할 문항을 저장할 공간이 부족합니다. 최근 작업 내역에서 공간을 확보하고 다시 시도하세요."
                @close="isListLimitModalOpen = false"
                @confirm="isListLimitModalOpen = false"
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
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// 라우터 및 인증 스토어
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 사용자 입력 관련 상태
const titleText = ref('');
const inputText = ref('');
const selectedCategory = ref('인문');
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

// 버튼 활성화 상태 계산 - authStore.userTicketCount 사용
const isButtonEnabled = computed(() => {
    // authStore의 userTicketCount getter 사용
    const ticketCount = authStore.userTicketCount;

    // 입력 텍스트가 있고 보유 이용권이 0보다 큰 경우 활성화
    const isEnabled = inputText.value.length >= 1 && titleText.value.length >= 1 && ticketCount > 0;


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
};

// 지문 제재 업데이트 함수
const updateInputText = (text) => {
    inputText.value = text;
};

// 지문 분야 업데이트 함수
const updateCategory = (category) => {
    selectedCategory.value = category;
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
    // console.log('지문 생성하기 버튼 클릭됨');

    // 작업 이름 가져오기
    try {
        const titleElement = document.querySelector('#passage-title');
        passageTitle.value = titleElement ? titleElement.value : '지문 작업';
        console.log('작업 이름:', passageTitle.value);
    } catch (error) {
        console.error('작업 이름 가져오기 실패:', error);
        passageTitle.value = '지문 작업';
    }
    
    // 작업 내역 개수 확인
    const apiUrl = import.meta.env.VITE_API_URL;
    
    fetch(`${apiUrl}/pass/select/count/recent`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                // 인증 오류 처리
                authStore.user = null;
                authStore.isAuthenticated = false;
                localStorage.removeItem('authUser');
                router.push({ 
                    path: '/login', 
                    query: { redirect: route.fullPath }
                });
                throw new Error('인증이 필요합니다');
            }
            throw new Error('API 호출 실패: ' + response.status);
        }
        return response.json();
    })
    .then(count => {
        recentListCount.value = count;
        
        // 작업 내역이 150개 이상인 경우 경고 모달 표시
        if (count >= 150) {
            isListLimitModalOpen.value = true;
        } else {
            // 일반적인 경우 확인 모달 표시
            isConfirmModalOpen.value = true;
        }
    })
    .catch(error => {
        console.error('작업 내역 확인 중 오류 발생:', error);
    });
};

// 현재 "최근 작업 내역"의 개수
const recentListCount = ref(0);

// 작업 내역 150개 이상인 경우, 띄울 모달창 정보
const isListLimitModalOpen = ref(false);

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
const confirmCreatePassage = () => {
    console.log('[1] 지문 생성 확인 모달에서 생성하기 버튼 클릭됨');
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
        console.log('[1-2] 지문 생성 API 요청 데이터:', requestData);

        // (수정) TestMemberController API 호출
        const apiUrl = import.meta.env.VITE_API_URL;

        fetch(`${apiUrl}/api/test/generate-passage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API 호출 실패: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('[1-3] 생성된 지문 데이터:', {
                content: data.generated_passage.substring(0, 50) + '...',
                corePoints: data.generated_core_point
            });

            // 백엔드 API에 저장 요청
            savePassageToBackend(data);
        })
        .catch(error => {
            console.error('[1-4] 지문 생성 중 오류 발생:', error);
            alert('지문 생성 중 오류가 발생했습니다: ' + error.message);
            isLoading.value = false;
            isProcessing.value = false;
        });
    } catch (error) {
        console.error('[1-5] 지문 생성 중 오류 발생:', error);
        alert('지문 생성 중 오류가 발생했습니다: ' + error.message);
        isLoading.value = false;
        isProcessing.value = false;
    }
};

// 백엔드 API에 지문 저장 함수
const savePassageToBackend = (data) => {
    console.log('[2] 백엔드 API 저장 요청 시작');
    loadingMessage.value = '생성된 지문을 저장 중입니다...';
    // 저장할 데이터 준비 - 명확하고 일관된 형식으로 변수명 통일
    const saveData = {
        type: data.type_passage || selectedCategory.value,
        keyword: data.keyword || inputText.value,
        title: passageTitle.value || '지문 작업',
        content: data.generated_passage,
        gist: data.generated_core_point,
        isGenerated: 1
    };
    console.log('[2-1] 백엔드 저장 요청 데이터:', saveData);

    // 백엔드 API 호출
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/pass/insert/each`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(saveData)
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          // 인증 오류 처리
          authStore.user = null;
          authStore.isAuthenticated = false;
          localStorage.removeItem('authUser');
          router.push({
            path: '/login',
            query: {redirect: router.currentRoute.value.fullPath}
          });
          throw new Error('인증이 필요합니다');
        }
        return response.text().then(text => {
          throw new Error('저장 API 호출 실패: ' + text);
        });
      }
      return response.json();
    })
    .then(responseData => {
      console.log('[2-2] 저장 응답 데이터:', responseData);
      // 이용권 정보 업데이트
      authStore.updateTicketCount();

      // (수정) 표준화된 형식으로 로컬 스토리지에 저장
      const passageData = {
        pasCode: responseData.pasCode,
        title: saveData.title,
        type: saveData.type,
        keyword: saveData.keyword,
        content: saveData.content,
        gist: saveData.gist
      };

      localStorage.setItem('genieq-passage-data', JSON.stringify(passageData));
      console.log('[2-3] 로컬 스토리지에 저장된 데이터:', passageData);

      // 페이지 이동
      router.push('/passage/create');

      // 상태 초기화
      isLoading.value = false;
      isProcessing.value = false;
    })
    .catch(error => {
      console.error('[2-4] 백엔드 저장 중 오류:', error);
      alert('저장 중 오류가 발생했습니다: ' + error.message);
      isLoading.value = false;
      isProcessing.value = false;
    });
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