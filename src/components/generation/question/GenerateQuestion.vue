<template>
  <div class="app-container">
      <p id="main-head">문항 생성</p>
      <div class="main-content">
        <p id="content-head">지문</p>
        <div class="edit-content-container">
          <EditPassage ref="editPassageRef"/>
          <EditQuestion @edit-mode-changed="updateEditingMode"/>
        </div>
        <PassageSummary id="passage-summary"/>
        <QuestionDescription :isEditing="isEditingGlobal" :questionData="questionData"/>
        <div class="button-container">
            <BaseButton text="문항 추가하기" type="type2" id="add-button" width="248px" height="54px" :disabled="!hasManualSave" @click="validateAndOpenModal"/>
            <BaseButton text="저장하기" type="type2" id="save-button" width="248px" height="54px" @click="handleSaveButtonClick"/>
            <BaseButton text="추출하기" type="type2" id="download-button" width="248px" height="54px" :disabled="!hasManualSave" @click="handleButtonClick"/>
        </div>
        <GenerateQuestionModal :isOpen="showGenerateQuestionModal" @close="showGenerateQuestionModal = false"/>
      </div>
      <ConfirmModalComponent
        :isOpen="isConfirmModalOpen"
        title="글자 수를 확인해 주세요."
        message="500자 이하의 지문으로 정상적인 문항을 생성하기 어렵습니다. 충분한 지문을 입력해 주세요."
        @close="isConfirmModalOpen = false"
        @confirm="isConfirmModalOpen = false"
      />
      <WarningModalComponent 
        :isOpen="isWarningModalOpen" 
        title="작업을 중단하시겠습니까?" 
        message="마지막 편집 내용은 저장되지 않습니다." 
        cancelText="취소하기"
        confirmText="작업 중단하기"
        @close="cancelNavigation" 
        @confirm="confirmNavigation"
      />
  </div>
</template>
<script setup>
import { ref, onMounted, provide, onBeforeUnmount, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// EditPassageQuestion 임포트 대신 직접 EditPassage와 EditQuestion 임포트
import EditPassage from './GenerateQuestion/EditPassageQuestion/EditPassage.vue';
import EditQuestion from './GenerateQuestion/EditPassageQuestion/EditQuestion.vue';
import PassageSummary from '../passage/PassageContent/PassageSummary.vue';
import QuestionDescription from './GenerateQuestion/QuestionDescription.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
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
const pendingRoute = ref(null); // 대기 중인 라우트 정보 저장

const currentPassage = ref({
  title: '',
  content: ''
});

// EditPassage 컴포넌트 참조 (EditPassageQuestion 대신)
const editPassageRef = ref(null);

// 기존 버튼 클릭 핸들러
const handleButtonClick = () => {
  // EditPassage의 글자 수 검증
  if (editPassageRef.value) {
    return editPassageRef.value.validateTextLength();
  }
  return true;
};

// 저장 버튼 클릭 핸들러 추가
const handleSaveButtonClick = () => {
  // EditPassage의 글자 수 검증
  if (editPassageRef.value) {
    const isValid = editPassageRef.value.validateTextLength();
    
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
  if (editPassageRef.value) {
    return editPassageRef.value.validateTextLength();
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
  // 편집 중인지 확인하고, 내용이 변경됐는데 저장되지 않았는지 확인
  const hasContentChanged = isContentChanged.value && !isSaved.value;

  // 지문이 있고, 저장 버튼이 활성화 되어있는 경우 ( 내용이 있지만 저장되지 않음 )
  const hasUnsavedContent = passageData.value &&
                          passageData.value.content &&
                          passageData.value.content.length > 0 &&
                          !hasManualSave.value;
                          
  console.log('변경 감지 상태:', {
    isContentChanged: isContentChanged.value,
    isSaved: isSaved.value,
    hasManualSave: hasManualSave.value,
    hasContentChanged,
    hasUnsavedContent
  });

  return hasContentChanged || hasUnsavedContent;
};

// 페이지 이탈 시, 경고 (브라우저 새로고침, 닫기 등)
const handleBeforeUnload = (e) => {
  if (hasUnsavedChanges()) {
    e.preventDefault();
    e.returnValue = '';
    return '';
  }
};

// 이동 취소 - 현재 화면 유지
const cancelNavigation = () => {
  console.log('네비게이션 취소됨');
  isWarningModalOpen.value = false;
  pendingRoute.value = null;
};

// 이동 확인 - 타겟 페이지로 이동
const confirmNavigation = () => {
  console.log('네비게이션 승인됨, 이동 실행');
  isWarningModalOpen.value = false;

  // 변경 사항이 있었지만, 사용자가 이동을 확인했으므로 관련 상태 초기화
  isContentChanged.value = false;
  hasManualSave.value = true; // 사용자가 명시적으로 저장하지 않기로 함
  
  // 네비게이션 수행
  if (pendingRoute.value) {
    const targetPath = pendingRoute.value;
    pendingRoute.value = null;
    
    // 저장했던 경로로 직접 이동 실행
    router.push(targetPath);
  }
};

// Vue 인스턴스 참조
const instance = getCurrentInstance();
let routerGuard = null;

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
    
    // EditPassage에 지문 내용 설정
    if (editPassageRef.value && passageData.value && passageData.value.content) {
      editPassageRef.value.setContent(passageData.value.content);
    }
  } 
  // 로컬 스토리지에서 지문 데이터 확인
  else {
    const storedPassageData = localStorage.getItem('generateQuestionPassageData');
    if (storedPassageData) {
      try {
        passageData.value = JSON.parse(storedPassageData);
        
        // EditPassage에 지문 내용 설정
        if (editPassageRef.value && passageData.value && passageData.value.content) {
          editPassageRef.value.setContent(passageData.value.content);
        }
      } catch (error) {
        console.error('저장된 지문 데이터를 불러오는 중 오류 발생:', error);
      }
    }
  }
  
  // 브라우저 새로고침, 닫기 등에 대한 이벤트 리스너 추가
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // 전역 네비게이션 가드 설정
  routerGuard = router.beforeEach((to, from, next) => {
    console.log('라우터 가드 호출됨', { from: from.path, to: to.path, current: route.path });
    
    // 현재 라우트에서 다른 라우트로 이동하는 경우에만 확인
    if (from.path === route.path && hasUnsavedChanges()) {
      console.log('저장되지 않은 변경사항 감지됨, 네비게이션 중단 및 모달 표시');
      
      // 저장되지 않은 변경사항이 있다면 모달 표시하고 대기
      isWarningModalOpen.value = true;
      pendingRoute.value = to.fullPath; // 이동하려는 전체 경로 저장
      
      return false; // 네비게이션 중단
    }
    
    console.log('네비게이션 계속 진행');
    return next(); // 네비게이션 계속
  });
});

onBeforeUnmount(() => {
  // 컴포넌트 해제 시 이벤트 리스너 제거
  window.removeEventListener('beforeunload', handleBeforeUnload);

  // 라우터 가드 제거
  if (routerGuard) {
    routerGuard();
  }
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
      isContentChanged.value = true; // 내용이 변경됨을 표시
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
#content-head {
  position: absolute;
  width: 928px;
  height: 36px;
  left: 292px;
  top: 126px;

  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 150%;
  letter-spacing: -0.02em;
  color: #000000;
}
/* EditPassageQuestion의 스타일을 새로운 컨테이너에 적용 */
.edit-content-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 20px;

  position: absolute;
  width: 930px;
  height: 1160px;
  left: 292px;
  top: 170px;
}
#passage-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 20px;

  position: absolute;
  width: 520px;
  height: 739px;
  left: 1244px;
  top: 126px;
}
.button-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 154px 80px 272px;
  gap: 24px;

  position: absolute;
  top: 1475px;
  left: 156px;
  width: 1762px;
  height: 54px;
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