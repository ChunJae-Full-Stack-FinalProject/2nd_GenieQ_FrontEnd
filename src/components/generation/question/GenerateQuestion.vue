<template>
  <div class="app-container">
    <p id="main-head">문항 생성</p>

    <div class="passage-content">
      <p id="content-head">지문</p>
      <!-- EditPassage를 직접 사용 -->
      <div class="edit-content-container">
        <EditPassage ref="editPassageRef"/>
      </div>
    </div>
        
      <!-- 문항 캐러셀 -->
    <div class="question-slide-container">
      <p>문항</p>
      <div class="carousel-slide" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(item, index) in questionsData" :key="index" class="carousel-item">
          <EditQuestion 
            :questions="item.questions" 
            :questionTitle="item.title"
            @edit-mode-changed="updateEditingMode"
          />
        </div>
      </div>
    </div>
        
    <PassageSummary id="passage-summary"/>
        
    <!-- 해설 캐러셀 -->
    <p id="description-head">문제 해설</p>
    <div class="description-container">
      <div class="carousel-slide" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(item, index) in questionsData" :key="index" class="carousel-item description-item">
          <QuestionDescription 
            :isEditing="isEditingGlobal" 
            :correct="item.correct" 
            :description="item.description"
          />
        </div>
      </div>
    </div>
        
    <!-- 페이지네이션 추가 -->
    <div class="pagination-container">
      <button class="pagination-arrow" :disabled="currentSlide === 0" @click="prevSlide">
        <Icon icon="ep:arrow-left-bold" width="18px" height="18px" class="arrow-left" style="color: #303030" />
      </button>
      <div class="pagination-text">
        <span style="color:#FF9F40; font-size:20px;">{{ currentSlide + 1 }}</span>  /  {{ questionsData.length }}
      </div>
      <button class="pagination-arrow" :disabled="currentSlide === questionsData.length - 1" @click="nextSlide">
        <Icon icon="ep:arrow-right-bold" width="18px" height="18px" class="arrow-right" style="color: #303030" />
      </button>
    </div>
        
    <div class="button-container">
        <BaseButton text="문항 추가하기" type="type2" id="add-button" width="248px" height="54px" :disabled="!hasManualSave" @click="validateAndOpenModal"/>
        <BaseButton text="저장하기" type="type2" id="save-button" width="248px" height="54px" @click="handleSaveButtonClick"/>
        <BaseButton text="추출하기" type="type2" id="download-button" width="248px" height="54px" :disabled="!hasManualSave" @click="handleButtonClick"/>
    </div>
        
    <GenerateQuestionModal :isOpen="showGenerateQuestionModal" @close="showGenerateQuestionModal = false"/>
    <!-- PaymentUsageModal 컴포넌트 -->
    <PaymentUsageModal 
      :isOpen="showPaymentModal" 
      @close="showPaymentModal = false"
      @generate="handleQuestionGeneration"
    />
    
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
import { ref, onMounted, provide, onBeforeUnmount, getCurrentInstance, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// 직접 컴포넌트 임포트
import EditPassage from './GenerateQuestion/EditPassageQuestion/EditPassage.vue';
import EditQuestion from './GenerateQuestion/EditPassageQuestion/EditQuestion.vue';
import PassageSummary from '../passage/PassageContent/PassageSummary.vue';
import QuestionDescription from './GenerateQuestion/QuestionDescription.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import GenerateQuestionModal from '@/components/common/modal/type/generation/GenerateQuestionModal.vue';
import ConfirmModalComponent from '@/components/common/modal/type/ConfirmModalComponent.vue';
import WarningModalComponent from '@/components/common/modal/type/WarningModalComponent.vue';
import PaymentUsageModal from '@/components/common/modal/type/generation/PaymentUsageModal.vue';

const isEditingGlobal = ref(false);
const pattern = ref(null);
const type = ref(null);
const questionData = ref(null);
const passageData = ref(null);
const isConfirmModalOpen = ref(false);
const showGenerateQuestionModal = ref(false);
const showPaymentModal = ref(false); // PaymentUsageModal 상태
const isSaved = ref(false);
const hasManualSave = ref(false);
const isContentChanged = ref(false);
const isWarningModalOpen = ref(false);

// 캐러셀 관련 상태
const currentSlide = ref(0);

const questionsData = ref([
  {
    title: '다음 중 본문과 내용이 다른 것을 고르시오.',
    questions: [
      'LLMs의 성능은 모델의 크기를 줄일수록 향상된다.',
      'LLMs의 성능은 모델의 크기를 줄일수록 향상된다.',
      'LLMs는 인공지능이 인간 언어를 이해하고 생성하는 방식을 변화시키고 있다.',
      'ChatGPT와 같은 혁신은 LLMs가 독특한 문제 해결 능력을 보여주기 시작했음을 나타낸다.',
      '연구자들은 LLMs의 잠재력을 확대하기 위해 새로운 아키텍처와 훈련 전략을 탐구하고 있다.'
    ],
    correct: '①',
    description: "연구 커뮤니티는 이러한 모델의 규모를 확장하면 성능이 향상된다고 인정한다고 했으므로, \n① 'LLMs의 성능은 모델의 크기를 줄일수록 향상된다.' 는 글의 내용과 일치하지 않는다."
  }
]);

// 슬라이드 네비게이션 함수
const nextSlide = () => {
  if (currentSlide.value < questionsData.value.length - 1) {
    currentSlide.value++;
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

// 네비게이션 관련 변수
const pendingRoute = ref(null);

const currentPassage = ref({
  title: '',
  content: ''
});

// EditPassage 컴포넌트 참조
const editPassageRef = ref(null);

// 기존 버튼 클릭 핸들러
const handleButtonClick = () => {
  if (editPassageRef.value) {
    return editPassageRef.value.validateTextLength();
  }
  return true;
};

// 저장 버튼 클릭 핸들러
const handleSaveButtonClick = () => {
  if (editPassageRef.value) {
    const isValid = editPassageRef.value.validateTextLength();
    
    if (isValid) {
      savePassageData();
      isSaved.value = true;
      hasManualSave.value = true;
      isContentChanged.value = false;
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
    localStorage.setItem('generateQuestionPassageData', JSON.stringify(passageData.value));
    console.log('지문 데이터 저장 완료:', passageData.value);
  }
};

const updateEditingMode = (value) => {
  isEditingGlobal.value = value;
};

// validatePassageLength 함수
const validatePassageLength = () => {
  if (editPassageRef.value) {
    return editPassageRef.value.validateTextLength();
  }
  return false;
};

// showLengthWarning 함수
const showLengthWarning = () => {
  isConfirmModalOpen.value = true;
};

// validateAndOpenModal 함수 수정
const validateAndOpenModal = () => {
  if (!validatePassageLength()) {
    showLengthWarning();
  } else {
    localStorage.setItem('tempPassageData', JSON.stringify(passageData.value));
    // PaymentUsageModal 표시
    showPaymentModal.value = true;
  }
};

// 문항 생성 처리 함수 - 여기가 핵심입니다
const handleQuestionGeneration = () => {
  // 새 문항 데이터
  const newQuestion = {
    title: '새로운 문항: 다음 중 본문과 내용이 일치하는 것을 고르시오.',
    questions: [
      '문제가 바뀌는지 확인해보자',
      'LLMs는 다른 AI 기술들과 전혀 다른 접근 방식을 사용한다.',
      'ChatGPT는 LLMs의 가장 초기 모델 중 하나이다.',
      'LLMs는 기업 환경에서만 사용되는 전문적인 도구이다.',
      '연구자들은 LLMs의 성능을 줄이기 위해 노력하고 있다.'
    ],
    correct: '①',
    description: "으아아아아아아아아악 너무 힘들어요오오오오오오 살려줘 제에에에에ㅔㅇ바라라아ㅏ아아라"
  };

  // 여러 개의 문항이 있었던 배열을 초기화하고 기존 문항과 새 문항만 저장
  if (questionsData.value.length > 1) {
    // 기존 문항이 여러 개 있었으면 초기 문항과 새 문항만 유지
    questionsData.value = [questionsData.value[0], newQuestion];
  } else {
    // 문항이 하나만 있었으면 새 문항 추가
    questionsData.value.push(newQuestion);
  }
  // 새로운 문항이 표시되는 페이지로 이동
  currentSlide.value = questionsData.value.length - 1;
  
  // 모달 닫기
  showPaymentModal.value = false;
};

// 라우터 관련 정보 가져오기
const route = useRoute();
const router = useRouter();

// 저장되지 않은 변경사항이 있는지 확인하는 함수
const hasUnsavedChanges = () => {
  const hasContentChanged = isContentChanged.value && !isSaved.value;
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
  isContentChanged.value = false;
  hasManualSave.value = true;
  
  if (pendingRoute.value) {
    const targetPath = pendingRoute.value;
    pendingRoute.value = null;
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

// 슬라이드가 변경될 때마다 포커스 조정 (접근성 개선)
watch(currentSlide, (newSlide) => {
  console.log(`슬라이드 변경: ${newSlide + 1}/${questionsData.value.length}`);
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
#passage-summary {
  position: absolute;
  top: 126px;
  left: 1244px;
}
/* 슬라이드 컨테이너 스타일 */
.question-slide-container {
  position: absolute;
  width: 930px;
  height: 405px;
  left: 292px;
  top: 970px;
  overflow: hidden;
}
.question-slide-container > p {
  width: 928px;
  height: 36px;

  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 150%;

  letter-spacing: -0.02em;
  color: #000000;
}
.question-slide-container .carousel-slide {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: auto;
}
.question-slide-container .carousel-item {
  flex: 0 0 100%;
  min-width: 100%;
  width: 100%;
  height: 100%;
}
#description-head {
  position: absolute;
  top: 971px;
  left: 1244px;
  width: 100px;

  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #000000;
}
.description-container {
  box-sizing: border-box;
  position: absolute;
  width: 520px;
  height: 367px;
  top: 1011px;
  left: 1244px;
  overflow: hidden;
  border-radius: 12px;
}
.description-container .carousel-slide {
  display: flex;
  width: 100%;
}

.description-container .carousel-item {
  flex: 0 0 100%;
  width: 100%;
  min-width: 100%;
  height: 100%;
}

.description-item {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 페이지네이션 스타일 */
.pagination-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 12px;

  position: absolute;
  width: 134px;
  height: 30px;
  left: 971px;
  top: 1390px;
}

.pagination-arrow {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.pagination-arrow:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-text {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 8px;
  gap: 8px;

  width: 62px;
  height: 30px;

  font-family: 'Pretendard';
  font-size: 20px;
}

.button-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 154px 80px 272px;
  gap: 24px;

  position: absolute;
  width: 1762px;
  height: 54px;
  left: 155px;
  top: 1475px;
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