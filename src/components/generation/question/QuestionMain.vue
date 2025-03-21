<template>
    <div class="app-container">
        <p id="main-head">문항 생성</p>
        <div class="main-content">
            <InsertPassage ref="insertPassageRef"/>
            <PaymentUsage ref="paymentUsageRef" @credit-update="onCreditUpdate"/>
            <BaseButton id="reset_button" text="초기화" type="type2" width="248px" height="54px" :disabled="!resetContent" @click="resetTitlePassage"/>
            <BaseButton 
                id="select-type" 
                text="문항 유형 선택하기" 
                type="type1" 
                width="248px" 
                height="54px" 
                :disabled="!hasContent || creditCountValue <= 0"
                @click="validateAndOpenModal"
            />
            <GenerateQuestionModal 
                :isOpen="showGenerateQuestionModal" 
                @close="showGenerateQuestionModal = false"
                :passageTitle="passageTitle" 
                :passageContent="currentPassage.PAS_CONTENT"
            />
            <LoadPassageModal :isOpen="showLoadPassageModal" @close="closeLoadPassageModal" @loadPassage="handleLoadPassage"/>
        </div>
    </div>
    <ConfirmModalComponent
      :isOpen="isConfirmModalOpen"
      PAS_TITLE="글자 수를 확인해 주세요."
      message="500자 이하의 지문으로 정상적인 문항을 생성하기 어렵습니다. 충분한 지문을 입력해 주세요."
      @close="isConfirmModalOpen = false"
      @confirm="isConfirmModalOpen = false"
    />

    <ConfirmModalComponent
        :isOpen="isListLimitModalOpen"
        :title="listLimitModalTitle"
        :message="listLimitModalMessage"
        @close="isListLimitModalOpen = false"
        @confirm="isListLimitModalOpen = false"
    />

    <GenerateQuestionModal 
      :isOpen="showGenerateQuestionModal" 
      @close="closeGenerateQuestionModal"
      @openPaymentModal="openPaymentModal"
    />
</template>
<script setup>
import { ref, provide, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth";
import PaymentUsage from '../PaymentUsage.vue';
import InsertPassage from './QuestionMain/InsertPassage.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import GenerateQuestionModal from '@/components/common/modal/type/generation/GenerateQuestionModal.vue';
import LoadPassageModal from "@/components/common/modal/type/generation/LoadPassageModal.vue";
import ConfirmModalComponent from '@/components/common/modal/type/ConfirmModalComponent.vue';

const showGenerateQuestionModal = ref(false);
const showLoadPassageModal = ref(false);
const isConfirmModalOpen = ref(false);
const paymentUsageRef = ref(null);
const creditCountValue = ref(0); // 별도의 ref로 이용권 상태 관리
const insertPassageRef = ref(null);
const passageTitle = ref('');
const openPaymentModal =ref('');

// 라우터와 스토어 초기화
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 현재 "최근 작업 내역"의 개수
const recentListCount = ref(0);

// "최근 작업 내역" 개수 가져오기
const fetchListCount = () => {
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
            // 인증 오류 처리 (401)
            if (response.status === 401) {
                console.error('인증 오류(401): 로그인이 필요합니다');

                // 인증 상태 초기화
                authStore.user = null;
                authStore.isAuthenticated = false;
                localStorage.removeItem('authUser');

                // 로그인 페이지로 리다이렉트
                router.push({ 
                    path: '/login', 
                    query: { redirect: route.fullPath }
                });

                throw new Error('인증이 필요합니다');
            }
            return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
    })
    .then(data => {
        // 현재 "최근 작업 내역" 의 개수
        recentListCount.value = data;
    })
    .catch(error => {
        console.error("최근 작업 내역 개수 조회 실패 : ", error);
    })
};

// 작업 내역 150개 이상인 경우, 띄울 모달창 정보
const isListLimitModalOpen = ref(false);
const listLimitModalTitle = ref("최근 작업 내역이 꽉 찼습니다.");
const listLimitModalMessage = ref("생성할 문항을 저장할 공간이 부족합니다. 최근 작업 내역에서 공간을 확보하고 다시 시도하세요.");

// PaymentUsage 컴포넌트에서 이용권 업데이트 시 호출될 함수
const onCreditUpdate = (count) => {
    creditCountValue.value = count;
};

// 지문 상태 및 메서드
const currentPassage = ref({
    PAS_TITLE: '',
    PAS_CONTENT: '',
    PAS_GIST: ''
});

const validateAndOpenModal = () => {
    // 이용권이 없는 경우 체크
    if (creditCountValue.value <= 0) {
        return;
    }

    // 최근 작업 내역 개수가 150개 이상인지 확인
    if (recentListCount.value >= 150) {
        // 최근 작업 내역 제한 모달 표시
        isListLimitModalOpen.value = true;
        return;
    }
    
    if (!validatePassageLength()) {
        showLengthWarning();
    } else {
        // 모달을 열기 전에 로컬 스토리지에 지문 데이터 저장
        localStorage.setItem('tempPassageData', JSON.stringify(currentPassage.value));
        showGenerateQuestionModal.value = true;
    }
};

// 지문 설정 함수
const setPassage = (passage) => {
    currentPassage.value.PAS_CONTENT = passage.PAS_CONTENT;
    currentPassage.value.PAS_GIST = passage.PAS_GIST;
};

// 지문 초기화 함수
const resetTitlePassage = () => {
    currentPassage.value = {
        PAS_TITLE: '',
        PAS_CONTENT: '',
        PAS_GIST:''
    };
};

const hasContent = computed(() => {
    return (
    (currentPassage.value.PAS_CONTENT &&
    currentPassage.value.PAS_CONTENT.trim().length > 0) &&
    (insertPassageRef.value?.passageTitle && // 제목 입력 상태 체크
    insertPassageRef.value?.passageTitle.trim().length > 0)
  );
});

const resetContent = computed(() => {
    return (
    (currentPassage.value.PAS_CONTENT &&
    currentPassage.value.PAS_CONTENT.trim().length > 0) ||
    (insertPassageRef.value?.passageTitle && // 제목 입력 상태 체크
    insertPassageRef.value?.passageTitle.trim().length > 0)
  );
});

// LoadPassageModal에서 지문 선택 시 호출될 함수
const handleLoadPassage = (passage) => {
    setPassage(passage);
    showLoadPassageModal.value = false;
};

// 모달 닫기 함수
const closeLoadPassageModal = () => {
    showLoadPassageModal.value = false;
};

// "지문 불러오기" 버튼 클릭 시 모달 열기 (InsertPassage에서 호출)
const openLoadPassageModal = () => {
    showLoadPassageModal.value = true;
};

const validatePassageLength = () => {
  return currentPassage.value.PAS_CONTENT && currentPassage.value.PAS_CONTENT.length >= 500;
};

const showLengthWarning = () => {
  isConfirmModalOpen.value = true;
};

// 컴포넌트 마운트 시 실행
onMounted(() => {
    // 최근 작업 내역 개수 가져오기
    fetchListCount();

    // 로컬 스토리지에서 임시 저장된 지문 데이터 불러오기
    const savedPassageData = localStorage.getItem('tempPassageData');
    if (savedPassageData) {
        try {
            const passageData = JSON.parse(savedPassageData);
            setPassage({
                PAS_TITLE: passageData.PAS_TITLE || '',
                PAS_CONTENT: passageData.PAS_CONTENT || '',
                PAS_GIST: passageData.PAS_GIST || '',
            });
            // 사용 후 삭제
            localStorage.removeItem('tempPassageData');
        } catch (error) {
            console.error('저장된 지문 데이터를 불러오는 중 오류 발생:', error);
        }
    }
    setTimeout(() => {
        if (paymentUsageRef.value && paymentUsageRef.value.creditcount) {
            creditCountValue.value = paymentUsageRef.value.creditcount.value;
        }
    }, 0);
});


// provide를 통해 하위 컴포넌트에 상태와 메서드 제공
provide('passageData', {
    currentPassage, setPassage, resetTitlePassage, openLoadPassageModal, validatePassageLength, showLengthWarning
});

const closeGenerateQuestionModal = () => {
  showGenerateQuestionModal.value = false;
};
</script>
<style scoped>
.app-container {
    width: 100%;
    padding: 20px 30px 80px 20px;
}
#main-head {
    position: absolute;
    width: 90px;
    height: 36px;
    left: 292px;
    top: 70px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #16252D;
}
#reset_button {
    position: absolute;
    left: 1244px;
    top: 852px;
}
#select-type {
    position: absolute;
    top: 852px;
    left: 1516px;
}
</style>