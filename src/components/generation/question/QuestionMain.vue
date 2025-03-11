<template>
    <div class="app-container">
        <p id="main-head">문항 생성</p>
        <div class="main-content">
            <InputPassageTitle ref="passageTitleRef"/>
            <InsertPassage/>
            <PaymentUsage/>
            <BaseButton id="reset_button" text="초기화" type="type2" width="248px" height="54px" :disabled="!hasContent" @click="resetPassage"/>
            <BaseButton id="select-type" text="문항 유형 선택하기" type="type1" width="248px" height="54px" @click="validateAndOpenModal"/>
            <GenerateQuestionModal :isOpen="showGenerateQuestionModal" @close="showGenerateQuestionModal = false"/>
            <LoadPassageModal :isOpen="showLoadPassageModal" @close="closeLoadPassageModal" @loadPassage="handleLoadPassage"/>
        </div>
    </div>
    <ConfirmModalComponent
        :isOpen="isConfirmModalOpen"
        title="글자 수를 확인해 주세요."
        message="500자 이하의 지문으로 정상적인 문항을 생성하기 어렵습니다. 충분한 지문을 입력해 주세요."
        @close="isConfirmModalOpen = false"
        @confirm="isConfirmModalOpen = false"
    />

    <GenerateQuestionModal 
    :isOpen="showGenerateQuestionModal" 
    @close="closeGenerateQuestionModal"
    @openPaymentModal="openPaymentModal"
  />
  <PaymentUsageModal 
    :isOpen="showPaymentUsageModal" 
    @close="closePaymentModal"
  />
</template>
<script setup>
import { ref, provide, onMounted, computed } from 'vue';
import PaymentUsage from '../PaymentUsage.vue';
import InsertPassage from './QuestionMain/InsertPassage.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import GenerateQuestionModal from '@/components/common/modal/type/generation/GenerateQuestionModal.vue';
import LoadPassageModal from "@/components/common/modal/type/generation/LoadPassageModal.vue";
import ConfirmModalComponent from '@/components/common/modal/type/ConfirmModalComponent.vue';
import InputPassageTitle from '@/components/generation/passage/PassageContent/InputPassageTitle.vue';
import PaymentUsageModal from '@/components/common/modal/type/generation/PaymentUsageModal.vue';

const showGenerateQuestionModal = ref(false);
const showLoadPassageModal = ref(false);
const isConfirmModalOpen = ref(false);  

// 지문 상태 및 메서드
const currentPassage = ref({
    title: '',
    content: ''
});

const validateAndOpenModal = () => {
  if (!validatePassageLength()) {
    showLengthWarning();
  } else {
    // 모든 모달 명시적으로 닫기
    showPaymentUsageModal.value = false;
    showGenerateQuestionModal.value = false;
    showLoadPassageModal.value = false;
    
    // 기존 데이터 전면 초기화
    localStorage.removeItem('selectedQuestionData');
    localStorage.removeItem('generateQuestionPassageData');
    localStorage.removeItem('tempPassageData');
    
    // 지연을 주어 상태 초기화 보장
    setTimeout(() => {
      // 로컬 스토리지에 지문 데이터 저장
      localStorage.setItem('tempPassageData', JSON.stringify(currentPassage.value));
      
      // GenerateQuestionModal만 열기
      showGenerateQuestionModal.value = true;
    }, 100);
  }
};

// 지문 설정 함수
const setPassage = (passage) => {
    currentPassage.value = passage;
};

// 지문 초기화 함수
const resetPassage = () => {
    currentPassage.value = {
        title: '',
        content: ''
    };
};

const hasContent = computed(() => {
    return currentPassage.value.content && currentPassage.value.content.trim().length > 0;
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
  return currentPassage.value.content && currentPassage.value.content.length >= 500;
};

const showLengthWarning = () => {
  isConfirmModalOpen.value = true;
};

// 컴포넌트 마운트 시 실행
onMounted(() => {
    // 로컬 스토리지에서 임시 저장된 지문 데이터 불러오기
    const savedPassageData = localStorage.getItem('tempPassageData');
    if (savedPassageData) {
        try {
            const passageData = JSON.parse(savedPassageData);
            setPassage({
                title: passageData.title || '',
                content: passageData.content || ''
            });
            // 사용 후 삭제
            localStorage.removeItem('tempPassageData');
        } catch (error) {
            console.error('저장된 지문 데이터를 불러오는 중 오류 발생:', error);
        }
    }
});

// provide를 통해 하위 컴포넌트에 상태와 메서드 제공
provide('passageData', {
    currentPassage, setPassage, resetPassage, openLoadPassageModal, validatePassageLength, showLengthWarning
});



const showPaymentUsageModal = ref(false);

const openPaymentModal = () => {
  // GenerateQuestionModal 닫기
  showGenerateQuestionModal.value = false;
  
  // PaymentUsageModal 열기
  showPaymentUsageModal.value = true;
};


const closeGenerateQuestionModal = () => {
  showGenerateQuestionModal.value = false;
};

const closePaymentModal = () => {
  // PaymentUsageModal 닫기
  showPaymentUsageModal.value = false;
  
  // localStorage 데이터 정리
  localStorage.removeItem('selectedQuestionData');
  localStorage.removeItem('generateQuestionPassageData');

  // 모든 모달 상태 명시적 초기화
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