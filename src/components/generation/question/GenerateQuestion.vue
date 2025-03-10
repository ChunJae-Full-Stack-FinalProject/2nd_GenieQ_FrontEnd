<template>
  <div class="app-container">
      <p id="main-head">문항 생성</p>
      <div class="main-content">
          <InputPassageTitle ref="passageTitleRef"/>
          <EditPassageQuestion ref="editPassageQuestionRef" @edit-mode-changed="updateEditingMode"/>
          <PassageSummary/>
          <QuestionDescription :isEditing="isEditingGlobal" :questionData="questionData"/>
          <div class="button-container">
              <BaseButton text="문항 추가하기" type="type2" id="add-button" width="248px" height="54px" :disabled="!hasManualSave" @click="validateAndOpenModal"/>
              <BaseButton text="저장하기" type="type2" id="save-button" width="248px" height="54px" @click="handleSaveButtonClick"/>
              <BaseButton text="추출하기" type="type2" id="download-button" width="248px" height="54px" :disabled="!hasManualSave" @click="handleButtonClick"/>
          </div>
          <PlainTooltip id="download-tooltip" message="추출은 저장 후 가능해요" width="203px" />
          <PlainTooltip id="add-question-tooltip" message="문항 추가는 저장 후 가능해요" width="233px" />
          <GenerateQuestionModal :isOpen="showGenerateQuestionModal" @close="showGenerateQuestionModal = false"/>
      </div>
      <ConfirmModalComponent
        :isOpen="isConfirmModalOpen"
        title="글자 수를 확인해 주세요."
        message="500자 이하의 지문으로 정상적인 문항을 생성하기 어렵습니다. 충분한 지문을 입력해 주세요."
        @close="isConfirmModalOpen = false"
        @confirm="isConfirmModalOpen = false"
      />
      <WarningModalComponent :isOpen="isWarningModalOpen" 
        title="저장되지 않은 변경사항이 있습니다." 
        message="변경 사항을 저장하지 않고 이동하시겠습니까? 저장하지 않은 내용은 사라집니다." 
        @close="cancleNavigation" @confirm="confirmNavigation"/>

  </div>
</template>
<script setup>
import { ref, onMounted, provide, onBeforeUnmount } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import EditPassageQuestion from './GenerateQuestion/EditPassageQuestion/EditPassageQuestion.vue';
import InputPassageTitle from '@/components/generation/passage/PassageContent/InputPassageTitle.vue';
import PassageSummary from '../passage/PassageContent/PassageSummary.vue';
import QuestionDescription from './GenerateQuestion/QuestionDescription.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import PlainTooltip from '@/components/common/PlainTooltip.vue';
import GenerateQuestionModal from '@/components/common/modal/type/generation/GenerateQuestionModal.vue';
import ConfirmModalComponent from '@/components/common/modal/type/ConfirmModalComponent.vue';
import WarningModalComponent from '@/components/common/modal/type/WarningModalComponent.vue';

const isEditingGlobal = ref(false);
const pattern = ref(null);
const type = ref(null);
const questionData = ref(null);
const passageData = ref(null);
const isConfirmModalOpen = ref(false);
const showGenerateQuestionModal = ref(false);
const isSaved = ref(false); // 저장 상태를 추적하는 변수 추가
const hasManualSave = ref(false); // 사용자가 직접 저장 버튼을 클릭했는지 추적
const isContentChanged = ref(false); // 내용 변경 여부 추적
const isWarningModalOpen = ref(false); // 경고 모달 상태

// 네비게이션 관련 변수
const pendingNavigation = ref(null);

const currentPassage = ref({
  title: '',
  content: ''
});

// EditPassageQuestion 컴포넌트 참조
const editPassageQuestionRef = ref(null);

// 기존 버튼 클릭 핸들러
const handleButtonClick = () => {
  // EditPassage의 글자 수 검증
  if (editPassageQuestionRef.value) {
    return editPassageQuestionRef.value.validatePassageLength();
  }
  return true;
};

// 저장 버튼 클릭 핸들러 추가
const handleSaveButtonClick = () => {
  // EditPassage의 글자 수 검증
  if (editPassageQuestionRef.value) {
    const isValid = editPassageQuestionRef.value.validatePassageLength();
    
    if (isValid) {
      // 유효성 검사에 통과하면 저장 처리 및 버튼 활성화
      savePassageData();
      isSaved.value = true; // 저장 상태를 true로 설정
      hasManualSave.value = true; // 수동 저장 플래그 설정
      isContentChanged.value = false; // 저장 후 변경사항 초기화
      return true;
    } else {
      showLengthWarning();
      return false;
    }
  }
  return false;
};

// 지문 데이터 저장 함수
const savePassageData = () => {
  if (passageData.value) {
    // 로컬 스토리지에 데이터 저장
    localStorage.setItem('generateQuestionPassageData', JSON.stringify(passageData.value));
    console.log('지문 데이터 저장 완료:', passageData.value);
    
    // 여기에 API 호출 등 다른 저장 로직 추가 가능
  }
};

const updateEditingMode = (value) => {
  isEditingGlobal.value = value;
};

// validatePassageLength 함수 추가
const validatePassageLength = () => {
  if (passageData.value && passageData.value.content) {
    return passageData.value.content.length >= 500;
  }
  return false;
};

// showLengthWarning 함수 추가
const showLengthWarning = () => {
  isConfirmModalOpen.value = true;
};

// validateAndOpenModal 함수 수정
const validateAndOpenModal = () => {
  if (!validatePassageLength()) {
    showLengthWarning();
  } else {
    // 모달을 열기 전에 로컬 스토리지에 지문 데이터 저장
    localStorage.setItem('tempPassageData', JSON.stringify(passageData.value));
    showGenerateQuestionModal.value = true;
  }
};

// 라우터 관련 정보 가져오기
const route = useRoute();
const router = useRouter();

// 저장되지 않은 변경사항이 있는지 확인하는 함수
const hasUnsavedChanges = () => {
  return isContentChanged.value && !isSaved.value;
};

// 라우트 이동 전 확인
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges()) {
    isWarningModalOpen.value = true;
    pendingNavigation.value = next;
  } else {
    next();
  }
});

// 페이지 이탈 시, 경고 (브라우저 새로고침, 닫기 등)
const handleBeforeUnload = (e) => {
  if (hasUnsavedChanges()) {
    e.preventDefault();
    e.returnValue = '';
    return '';
  }
};

// 이동 취소
const cancleNavigation = () => {
  isWarningModalOpen.value = false;
  pendingNavigation.value = null;
};

// 이동 확인
const confirmNavigation = () => {
  isWarningModalOpen.value = false;
  if (pendingNavigation.value) {
    pendingNavigation.value();
    pendingNavigation.value = null;
  }
}

onMounted(() => {
  // URL 쿼리 파라미터에서 문항 유형과 서술 방식 가져오기
  if (route.query) {
    pattern.value = route.query.pattern || null;
    type.value = route.query.type || null;
  }

  // 라우터 state에서 선택된 문항 데이터 가져오기
  if (route.state && route.state.questionData) {
    questionData.value = route.state.questionData;
  }

  // 라우터 state에서 지문 데이터 가져오기
  if (route.state && route.state.passageData) {
    passageData.value = route.state.passageData;
    
    // 데이터는 로드하지만 버튼은 활성화하지 않음 (오직 저장 버튼 클릭만이 다른 버튼들을 활성화함)
  } 
  // 로컬 스토리지에서 지문 데이터 확인
  else {
    const storedPassageData = localStorage.getItem('generateQuestionPassageData');
    if (storedPassageData) {
      try {
        passageData.value = JSON.parse(storedPassageData);
        
        // 데이터는 로드하지만 버튼은 활성화하지 않음 (오직 저장 버튼 클릭만이 다른 버튼들을 활성화함)
      } catch (error) {
        console.error('저장된 지문 데이터를 불러오는 중 오류 발생:', error);
      }
    }
  }
  // 브라우저 새로고침, 닫기 등에 대한 이벤트 리스너 추가
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  // 컴포넌트 해제 시 이벤트 리스너 제거
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

// 내부 저장 상태만 체크하는 함수 (버튼 활성화와는 무관)
const checkSavedState = () => {
  if (passageData.value && passageData.value.content && passageData.value.content.length >= 500) {
    // 내부 저장 상태만 업데이트하고 버튼은 활성화하지 않음
    isSaved.value = true;
  }
};

// provide 실행
provide('passageData', {
  passage: passageData,
  updatePassage: (newContent) => {
    if (passageData.value) {
      passageData.value.content = newContent;
      // 내용이 변경되면 저장 상태 초기화 및 수동 저장 플래그 초기화
      isSaved.value = false;
      isContentChanged.value = true; // 내용이 변경됨을 표시
      hasManualSave.value = false; // 내용이 변경되면 수동 저장 플래그도 초기화
    } else {
      passageData.value = { content: newContent };
      isSaved.value = false;
      hasManualSave.value = false;
    }
  }
});
</script>
<style scoped>
.app-container {
  width: 100%;
  padding: 20px 30px 480px 20px;
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
.button-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 154px 0px 272px;
  gap: 24px;

  position: absolute;
  width: 1762px;
  height: 54px;
  left: 160px;
  top: 1326px;
}
#add-button {
  flex: none;
  order: 0;
  flex-grow: 0;
}
#save-button {
  flex: none;
  order: 1;
  flex-grow: 0;
}
#download-button {
  flex: none;
  order: 2;
  flex-grow: 0;
}
#download-tooltip {
  position: absolute;
  top: 1277px;
  left: 1070px;
}
#add-question-tooltip {
  position: absolute;
  top: 1277px;
  left: 520px;
}
</style>