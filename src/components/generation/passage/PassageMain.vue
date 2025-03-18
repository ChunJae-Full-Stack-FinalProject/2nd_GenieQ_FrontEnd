<template>
    <div class="app-container">
        <p id="main-title">지문 생성</p>
        <div class="main-content">
            <CreatePassageMain ref="createPassageMainRef" @input-change="updateInputText" @category-change="updateCategory" @title-change="updateTitle"/>
            <PaymentUsage ref="paymentUsageRef" @credit-update="onCreditUpdate"/>
            <BaseButton id="reset_button" text="초기화" type="type2" width="248px" height="54px" :disabled="!hasContent" @click="resetButton"/>
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
            <LoadingModal :isOpen="isLoading" :message="loadingMessage" />
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
import LoadingModal from '@/components/common/modal/LoadingModal.vue';

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
const loadingMessage = ref('지문을 생성 중입니다.\n생성까지 최대 3분이 소요될 수 있습니다.');

// 중복 요청 방지를 위한 처리 상태 플래그 추가
const isProcessing = ref(false);

// 버튼 활성화 상태 계산 - authStore.userTicketCount getter 사용
const isButtonEnabled = computed(() => {
    const ticketCount = authStore.userTicketCount;
    // 입력 텍스트가 있고 보유 이용권이 0보다 큰 경우 활성화
    const isEnabled = inputText.value.length >= 1 && titleText.value.length >= 1 && ticketCount > 0; 
    return isEnabled;
});

// 내용 존재 여부 계산
const hasContent = computed(() => {
    return inputText.value && inputText.value.trim().length > 0;
});

// PaymentUsage 컴포넌트 - 이용권 업데이트 이벤트
const onCreditUpdate = (count) => {
    authStore.updateTicketCount().then(newCount => {
    });
};

// 제목, 제재, 분야 업데이트
const updateTitle = (text) => {titleText.value = text;};
const updateInputText = (text) => {inputText.value = text;};
const updateCategory = (category) => {selectedCategory.value = category;};

// 초기화 함수
const resetButton = () => {
    inputText.value = '';
    if (createPassageMainRef.value) {createPassageMainRef.value.resetForm();}
};

// 지문 생성하기 버튼 클릭 핸들러
const handleCreatePassage = () => {
    try {
        const titleElement = document.querySelector('#passage-title');
        passageTitle.value = titleElement ? titleElement.value : '지문 작업';
        // console.log('작업 이름:', passageTitle.value);
    } catch (error) {
        // console.error('작업 이름 가져오기 실패:', error);
        passageTitle.value = '지문 작업';
    }
    
    // 작업 내역 개수 확인 (150 개 이상인 경우 경고)
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
        if (count >= 150) {
            isListLimitModalOpen.value = true;
        } else {
            isConfirmModalOpen.value = true;
        }
    })
    .catch(error => {
        // console.error('작업 내역 확인 중 오류 발생:', error);
    });
};
// 현재 "최근 작업 내역"의 개수 // 작업 내역 150개 이상인 경우, 띄울 모달창 정보
const recentListCount = ref(0);
const isListLimitModalOpen = ref(false);

// 확인,경고 모달 관련 핸들러
const closeConfirmModal = () => { isConfirmModalOpen.value = false; };
const closeWarningModal = () => { isWarningModalOpen.value = false; };

// 지문 생성 확인 모달에서 생성하기 버튼 클릭
const confirmCreatePassage = () => {
    // 중복 요청 방지, 처리 중 플래그, 모달 닫고 로딩 시작
    if (isProcessing.value) { return; }
    isProcessing.value = true;
    isConfirmModalOpen.value = false;
    isLoading.value = true;
    loadingMessage.value = '지문을 생성 중입니다.\n생성까지 최대 3분이 소요될 수 있습니다.';


    try {
        if (authStore.userTicketCount <= 0) { throw new Error('이용권이 부족합니다. 이용권을 구매해주세요.'); }
        const requestData = {
            type_passage: selectedCategory.value,
            keyword: [inputText.value]
        };
        // console.log('[1-2] 지문 생성 API 요청 데이터:', requestData);

        const apiUrl = import.meta.env.VITE_API_URL;
        //fetch(`${apiUrl}/api/test/generate-passage`, {
        fetch('http://10.41.1.56:7777/generate-passage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) { throw new Error(`API 호출 실패: ${response.status}`); }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('pathFromGenerate', 'true');
            savePassageToBackend(data);
        })
        .catch(error => {
            // console.log("test 서버로 요청을 대신합니다.");
            alert('http://10.41.1.56:7777/generate-passage 서버로의 요청에 실패했습니다.\nhttp://43.202.6.90:9090/test/generate-passage 로 요청을 대신합니다.');
            
            fetch(`${apiUrl}/api/test/generate-passage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData)
                })
                .then(response => {
                    if (!response.ok) { throw new Error(`API 호출 실패: ${response.status}`); }
                    return response.json();
                })
                .then(data => {
                    localStorage.setItem('pathFromGenerate', 'true');
                    savePassageToBackend(data);
                })
                .catch(error => {
                });
            isLoading.value = false;
            isProcessing.value = false;
        });
    } catch (error) {
        alert('지문 생성 중 오류가 발생했습니다: ' + error.message);
        isLoading.value = false;
        isProcessing.value = false;
    }
};

// 백엔드 API에 지문 저장 함수 (confirmCreatePassage 함수에서 호출)
const savePassageToBackend = (data) => {
    loadingMessage.value = '생성된 지문을 저장 중입니다...';

    const saveData = {
        type: data.type_passage || selectedCategory.value,
        keyword: data.keyword || inputText.value,
        title: passageTitle.value || '지문 작업',
        content: data.generated_passage,
        gist: data.generated_core_point,
        isGenerated: 1
    };
    console.log("saveDate",saveData);

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
      authStore.updateTicketCount(); // 차감된 이용권으로 update
      const passageData = {
        pasCode: responseData.pasCode, // pasCodㄷ
        title: saveData.title,
        type: saveData.type,
        keyword: saveData.keyword,
        content: saveData.content,
        gist: saveData.gist
      };

      localStorage.setItem('genieq-passage-data', JSON.stringify(passageData)); // 로컬 스토리지에 저장
      // console.log('[2-3] 로컬 스토리지에 저장된 데이터:', passageData);

      router.push('/passage/create');

      // 상태 초기화
      isLoading.value = false;
      isProcessing.value = false;
    })
    .catch(error => {
      alert('저장 중 오류가 발생했습니다: ' + error.message);
      isLoading.value = false;
      isProcessing.value = false;
    });
};

onMounted(() => {
    localStorage.removeItem('genieq-passage-data');
    authStore.updateTicketCount(); // 이용권 update
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