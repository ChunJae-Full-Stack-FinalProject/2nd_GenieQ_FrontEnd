<template>
  <div class="app-container">
    <p id="main-head">문항 생성</p>

    <div class="passage-content">
      <p id="content-head">지문</p>
      <!-- EditPassage를 직접 사용 -->
      <div class="edit-content-container">
        <EditPassage 
          ref="editPassageRef" 
          :initialTitle="passageData.title"
          :initialContent="passageData.content" 
          @content-changed="handlePassageChange"
        />
      </div>
    </div>
        
      <!-- 문항 캐러셀 -->
    <div class="question-slide-container">
      <p>문항</p>
      <div class="carousel-slide" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(item, index) in questionsData" :key="index" class="carousel-item">
          <EditQuestion 
            ref="editQuestionRefs"
            :questions="item.queOption" 
            :questionTitle="item.queQuery"
            :isEditing="isEditingGlobal"
            :isFromRoute="isFromRoute"
            @edit-mode-changed="updateEditingMode"
            @question-changed="handleQuestionChange($event, index)"
            @request-edit-mode="openEditWarningModal"
            @recreate-question="handleRecreateButtonClick(index)"
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
            :queAnswer="item.queAnswer"
            :description="item.description"
            :slideIndex="index"
            @description-changed="handleDescriptionChange($event, index)"
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
        <BaseButton text="문항 추가하기" type="type2" id="add-button" width="248px" height="54px" :disabled="isContentChanged || isFromRoute" @click="validateAndOpenModal('generate')"/>
        <BaseButton text="저장하기" type="type2" id="save-button" width="248px" height="54px" :disabled="!isContentChanged" @click="handleSaveButtonClick"/>
        <BaseButton text="추출하기" type="type2" id="download-button" width="248px" height="54px" :disabled="isContentChanged" @click="openFileModal"/>
    </div>
        
    <GenerateQuestionModal 
      :isOpen="showGenerateQuestionModal" 
      createText="다음"
      mode="generate"
      @close="showGenerateQuestionModal = false"
      @openPaymentModal="handleUpdateQuestion"
    />
    <!-- PaymentUsageModal 컴포넌트 -->
    <PaymentUsageModal 
      :isOpen="showPaymentModal" 
      createText="문항 추가하기" 
      @close="showPaymentModal = false"
      @generate="handleQuestionGeneration"
      :selected-question="selectedQuestion"
    />

    <!-- 재생성 모달 추가 -->
    <PaymentUsageModal
      :isOpen="showRecreateModal"
      createText="재생성하기" 
      @close="showRecreateModal = false"
      @generate="handleRecreateGeneration"
      :selected-question="selectedQuestion"
    />
    
    <!-- 500자 이하의 지문으로 문항 추가하기 클릭할 경우 -->
    <ConfirmModalComponent
      :isOpen="isConfirmModalOpen"
      title="문항 생성이 불가합니다."
      message="500자 이하의 지문으로 정상적인 문항을 생성하기 어렵습니다.<br>충분한 지문을 입력해 주세요."
      @close="isConfirmModalOpen = false"
      @confirm="isConfirmModalOpen = false"
    />

    <!-- 500자 이하의 지문으로 저장하기 클릭할 경우 -->
    <WarningModalComponent
      :isOpen="isLengthWarning"
      title="글자 수를 확인해주세요."
      message="500자 이하의 지문으로는 새로운 문항을 추가하기 어렵습니다.<br>그래도 저장하시겠습니까?"
      cancelText="취소하기"
      confirmText="저장하기"
      @close="cancelLengthWarning"
      @confirm="confirmLengthWarning"
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

    <!-- 문항 편집을 위한 경고 모달 추가 -->
    <WarningModalComponent 
      :isOpen="isEditWarningModalOpen" 
      title="문항 수정 시 최초 생성된 해설은 적용되지 않습니다." 
      message="해설 수정을 원하실 경우, 직접 수정도 가능합니다." 
      cancelText="취소하기" 
      confirmText="수정하기" 
      @close="closeEditWarningModal" 
      @confirm="confirmEditWarningModal" 
    />

    <!-- 파일 선택 모달 -->
    <FileSelectModal :isOpen="isFileModalOpen" :pasCode="pasCode" @close="closeFileModal" @confirm="handleFileSelect"/>

    <LoadingModal :isOpen="isLoading" :message="loadingMessage" />
  </div>
</template>
<script setup>
import { ref, onMounted, provide, onBeforeUnmount, getCurrentInstance, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
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
import FileSelectModal from '@/components/common/modal/type/FileSelectModal.vue';
import LoadingModal from '@/components/common/modal/LoadingModal.vue';

const isEditingGlobal = ref(false);
const pattern = ref(null);
const type = ref(null);
const questionData = ref(null);
const passageData = ref({
  title:'',
  content: '',
  gist: ''
});
const isConfirmModalOpen = ref(false);
const isLengthWarning = ref(false);
const showGenerateQuestionModal = ref(false);
const showPaymentModal = ref(false); // PaymentUsageModal 상태
const showRecreateModal = ref(false); // 재생성하기 모달 상태 추가
const isSaved = ref(true); // 저장 상태 초기값을 true로 변경
const hasManualSave = ref(true); // 처음에는 true로 설정하여 문항 추가하기와 추출하기 버튼 활성화
const isContentChanged = ref(false); // 내용 변경 플래그 (false로 시작)
const isWarningModalOpen = ref(false);
const isFileModalOpen = ref(false); // 파일 선택 모달 상태 추가
const isEditWarningModalOpen = ref(false); // 문항 편집 경고 모달 상태 추가
const currentRecreateIndex = ref(null); // 현재 재생성하려는 문항 인덱스 추가
const isFromRoute = ref(false); // 문항 생성 페이지로 오기 전 주소에 따라 "문항 추가" 버튼 비활성화
const isProcessing = ref(false);
const pasCode = ref(0);
const isLoading = ref(false);
const loadingMessage = ref('문항을 생성 중입니다.\n생성까지 최대 3분이 소요될 수 있습니다.');

// 내용 변경 감지를 위한 타이머 설정
let changeDetectionTimer = null;

// EditQuestion 컴포넌트 참조
const editQuestionRefs = ref([]);

// 캐러셀 관련 상태
const currentSlide = ref(0);

const saveResponse = ref({});

const selectedQuestion = ref({
  pattern: '',
  type: '',
  queExample: ''
});

// try {
//   const data = localStorage.getItem('saveResponse');
//   if (data) {
//     saveResponse = JSON.parse(data);
//   }
// } catch (error) {
//   console.error('JSON 파싱 오류:', error);
//   saveResponse={};
// }

const questionsData = ref([]);

const authStore = useAuthStore();

// ✅ 값 저장 후 PaymentUsageModal 열기
const handleUpdateQuestion = (data) => {
  if (data) {

    selectedQuestion.value = {
      pattern: data.pattern || '',
      type: data.type || '',
      queExample: data.queExample || ''
    };

    // ✅ PaymentUsageModal 열기
    showPaymentModal.value = true;
  }
};

// 제목 및 지문 수정
const handlePassageChange = (updatedData) => {
  passageData.value.title = updatedData.title || '';
  passageData.value.content = updatedData.content || '';


  
  // 상태 변경 감지
  handleContentChange();
};

// 해설 수정
const handleDescriptionChange = (event, index) => {
  if (!event || index === undefined) return;



  if (event.queAnswer) {
    questionsData.value[index].queAnswer = event.queAnswer;
  }
  
  if (event.description) {
    questionsData.value[index].description = event.description;
  }

  handleContentChange();
};


// 재생성하기 버튼 클릭 핸들러
const handleRecreateButtonClick = (index) => {
    // 현재 재생성하려는 문항 인덱스 저장
    currentRecreateIndex.value = index !== undefined ? index : currentSlide.value;

    // ✅ 지문 길이 검증이 필요하면 추가
    if (!validatePassageLength()) {
      showLengthConfirm(); // 지문이 너무 짧을 경우 경고
      return; // ✅ 검증 실패 시 함수 종료
    }
    selectedQuestion.value = {
      mode: 'recreate',
      title: questionsData.value[index].queQuery,
      options: questionsData.value[index].queOption
    };

    showRecreateModal.value = true;
};


// 재생성 실행 핸들러 (PaymentUsageModal에서 버튼 클릭 시 호출)
const handleRecreateGeneration = async () => {
  if (showRecreateModal.value === false) {
    return;
  }

  if (isProcessing.value) return; // 중복 실행 방지
  isProcessing.value = true;

  isLoading.value = true;
  loadingMessage.value = '문항을 재생성 중입니다.\n재생성까지 최대 3분이 소요될 수 있습니다.';

  try {
    const apiUrl = import.meta.env.VITE_API_URL;

    // 1단계: 문항 생성 API 호출
    const requestData = {
        "custom_passage": saveResponse.value.passage?.content || '',
        "type_question": route.query.pattern,
        "type_question_detail": route.query.type,
        "question_example": route.query.queExample,
        "mode": "recreate"
    };



    const response = await fetch('http://api.chunjae-it-edu.com/generate-question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      // 인증 오류 처리 (401)
      if (response.status === 401) {


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
      throw new Error(`문항 생성 실패: ${response.status}`);
    }
    
    const result = await response.json();

    // (추가) 선택지에서 쉼표 제거 또는 대체
    const processedOptions = result.generated_option.map(option => {
        // 쉼표를 다른 문자(예: 대시)로 대체
        return option.replace(/,/g, '').replace(/^[①②③④⑤]\s*/, '');
    });

    console.log('쉼표 제거해 줬는지 확인:', {
        original: result.generated_option,
        processed: processedOptions
    });

    //2단계: 문항 저장 API 호출
    const newQuestion = {
      "queQuery": result.generated_question,
      "queOption": processedOptions,
      "queAnswer": result.generated_answer,
      "description": result.generated_description
    };

    const saveRequestData = {
      "type": saveResponse.value.passage.type,
      "keyword": saveResponse.value.passage.keyword,
      "title": saveResponse.value.passage?.title || '',
      "content": saveResponse.value.passage?.content || '',
      "gist": saveResponse.value.passage?.gist || '',
      "isGenerated": 0,
      "questions": [
        ...questionsData.value, // 기존 질문 유지
        newQuestion
      ],
      "mode": "recreate"
    };



    const updateResponse = await fetch(`${apiUrl}/pass/ques/update/${saveResponse.value.passage.pasCode}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(saveRequestData),
    });

    if (!updateResponse.ok) {
      // 인증 오류 처리 (401)
      if (response.status === 401) {


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
      throw new Error(`문항 저장 실패: ${updateResponse.status}`);
    }

            
    const updateResult = await updateResponse.json();


    // 상태 업데이트
    questionsData.value = [...questionsData.value, newQuestion]; // 기존 질문 + 새 질문 추가
    saveResponse.value = {
      ...saveResponse.value,
      passage: updateResult // 저장된 값 갱신
    };

    //새 문항이 표시되도록 캐러셀 인덱스 업데이트
    currentSlide.value = questionsData.value.length - 1;

    localStorage.setItem('saveResponse', JSON.stringify(saveResponse.value));


    isLoading.value = false;

    // 모달 닫기
    showRecreateModal.value = false;
    isProcessing.value = false;     
  } catch (error) {

      alert(`오류 발생: ${error.message}`);
      isProcessing.value = false;
  }
};

// 문항 저장 함수 (백엔드 연동 시 구현 예정)
const saveQuestion = () => {
  
  // 편집 모드 해제
  updateEditingMode(false);
  
  // 현재 EditQuestion 컴포넌트의 편집 모드 해제
  if (editQuestionRefs.value && editQuestionRefs.value[currentSlide.value]) {
    editQuestionRefs.value[currentSlide.value].toggleEditMode(false);
  }
  
  // 기존의 저장하기 버튼의 핸들러 함수 호출
  handleSaveButtonClick();
};

// 편집 경고 모달 열기
const openEditWarningModal = () => {
  isEditWarningModalOpen.value = true;
};

// 편집 경고 모달 닫기
const closeEditWarningModal = () => {
  isEditWarningModalOpen.value = false;
};

// 편집 경고 모달 확인 시 처리
const confirmEditWarningModal = () => {
  isEditWarningModalOpen.value = false;
  
  // 먼저 전역 편집 상태를 true로 설정
  updateEditingMode(true);
  
  // 현재 슬라이드의 EditQuestion 컴포넌트에서 편집 모드를 true로 강제 설정
  nextTick(() => {
    if (editQuestionRefs.value && editQuestionRefs.value[currentSlide.value]) {

      const currentEditQuestion = editQuestionRefs.value[currentSlide.value];
      currentEditQuestion.toggleEditMode(true); // true를 명시적으로 전달
    } else {
      // console.error('에러: 현재 슬라이드의 EditQuestion 컴포넌트를 찾을 수 없습니다.', { 
      //   slideIndex: currentSlide.value, 
      //   refsLength: editQuestionRefs.value ? editQuestionRefs.value.length : 0
      // });
    }
  });
};

// 슬라이드 네비게이션 함수
const nextSlide = () => {
  // 정상 이동 처리
  if (currentSlide.value < questionsData.value.length - 1) {
    currentSlide.value++;
  }
};

const prevSlide = () => {
  // 정상 이동 처리
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

// 네비게이션 관련 변수
const pendingRoute = ref(null);

// EditPassage 컴포넌트 참조
const editPassageRef = ref(null);

// 내용 변경 시 호출되는 함수
const handleContentChange = () => {
  // 내용이 변경되면 isContentChanged를 true로, hasManualSave를 false로 설정
  isContentChanged.value = true;
  hasManualSave.value = false;
  isSaved.value = false;

};

// 실제 저장 로직 (모달 분기처리하면서 저장 로직 3번 반복으로 인해 별도로 선언함)
const performSave = () => {
  const currentContent = editPassageRef.value.getContent();
  const currentTitle = editPassageRef.value.getTitle();

  const apiUrl = import.meta.env.VITE_API_URL;
  const pasCode = saveResponse.value.passage.pasCode;
  // const selectedQuestion = saveResponse.value.question;
  
  // 올바른 요청 데이터 구조 생성
  const requestData = {
    "type": saveResponse.value.passage.type,
    "keyword": saveResponse.value.passage.keyword,
    "title": passageData.value.title,
    "content": currentContent,
    "gist": saveResponse.value.passage.gist || '',
    "isGenerated": saveResponse.value.passage.isGenerated || 0,
    "questions": saveResponse.value.passage.questions || []
  };

  if (isProcessing.value) return; // 중복 실행 방지
  isProcessing.value = true;

  // 지문 저장 api
  fetch(`${apiUrl}/pass/ques/update/${pasCode}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData),
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) {
      // 인증 오류 처리 (401)
      if (response.status === 401) {
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
      throw new Error(`지문 저장 실패: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
      // API 응답으로 받은 데이터로 saveResponse 업데이트
      saveResponse.value = {
          ...saveResponse.value,
          passage: data
      };
      
      // 업데이트된 데이터를 로컬스토리지에 저장
      localStorage.setItem('saveResponse', JSON.stringify(saveResponse.value));
      
      // 상태 업데이트
      isSaved.value = true;
      hasManualSave.value = true;
      isContentChanged.value = false;
  })
  .catch(error => {
      alert("지문 저장에 실패했습니다.");
  })
  .finally(() => {
      isProcessing.value = false;
  });
  
  savePassageData();
  isSaved.value = false;
  hasManualSave.value = true;
  isContentChanged.value = false; // 저장 후 내용 변경 플래그를 false로 설정

  return true;
};

// 저장 버튼 클릭 핸들러
const handleSaveButtonClick = () => {
  updateEditingMode(false);

  if (editPassageRef.value) {
    const isValid = editPassageRef.value.validateTextLength();
    
    if (isValid || isFromRoute.value) {
      // 자료실에서 온 경우, 모달 노출 없이 바로 저장

      // 저장 버튼 클릭 시 EditPassage 컴포넌트에서 최신 내용 가져오기
      performSave();
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

// showLengthConfirm 함수
const showLengthConfirm = () => {
  isConfirmModalOpen.value = true;
};

// showLengthWarning 함수
const showLengthWarning = () => {
  isLengthWarning.value = true;
}

  // 취소 버튼 클릭
  const cancelLengthWarning = () => {
    isLengthWarning.value = false;
  };

  // 저장 버튼 클릭
  const confirmLengthWarning = () => {
    isLengthWarning.value = false;
    // 저장 실행 함수 호출
    performSave();
  }

// validateAndOpenModal 함수 수정
const validateAndOpenModal = () => {
  if (!validatePassageLength()) {
    showLengthConfirm();
  } else {
    localStorage.setItem('tempPassageData', JSON.stringify(passageData.value));
    // GenerateQuestion 표시
    showGenerateQuestionModal.value = true;
  }
};

// 파일 선택 모달 열기 함수
const openFileModal = () => {
  // 지문 길이 검증
  if (!validatePassageLength()) {
    showLengthConfirm();
  } else {
    isFileModalOpen.value = true;
  }
};

// 파일 선택 모달 닫기 함수
const closeFileModal = () => {
  isFileModalOpen.value = false;
};

// 파일 선택 처리 함수
const handleFileSelect = (fileType) => {

  // 여기에 선택된 파일 형식에 따른 추출 로직 구현
  // 예: PDF, Word, TXT 파일 생성 및 다운로드 등
};

// 문항 생성 처리 함수
const handleQuestionGeneration = async () => {
  if (showPaymentModal.value === false) {
    return;
  }

  if (isProcessing.value) return; // 중복 실행 방지
  isProcessing.value = true;

  isLoading.value = true;
  loadingMessage.value = '새로운 문항을 생성 중입니다.\n생성까지 최대 3분이 소요될 수 있습니다.';

  try {
            // 임시 api 연결
            const apiUrl = import.meta.env.VITE_API_URL;

            // 1단계: 문항 생성 API 호출
            const requestData = {
                "custom_passage": saveResponse.value.passage?.content || '',
                "type_question": selectedQuestion.value.pattern,
                "type_question_detail": selectedQuestion.value.type,
                "question_example": selectedQuestion.value.queExample,
            };



            const response = await fetch('http://api.chunjae-it-edu.com/generate-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
              // 인증 오류 처리 (401)
              if (response.status === 401) {


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
              throw new Error(`문항 생성 실패: ${response.status}`);
            }
            
            const result = await response.json();
            
            // (추가) 선택지에서 쉼표 제거 또는 대체
            const processedOptions = result.generated_option.map(option => {
                // 쉼표를 다른 문자(예: 대시)로 대체
                return option.replace(/,/g, '').replace(/^[①②③④⑤]\s*/, '');
            });

            console.log('쉼표 제거해 줬는지 확인용 로직:', {
                original: result.generated_option,
                processed: processedOptions
            });

            //2단계: 문항 저장 API 호출
            const newQuestion = {
              "queQuery": result.generated_question,
              "queOption": processedOptions,
              "queAnswer": result.generated_answer,
              "description": result.generated_description
            };

            const saveRequestData = {
              "type": saveResponse.value.passage.type,
              "keyword": saveResponse.value.passage.keyword,
              "title": saveResponse.value.passage?.title || '',
              "content": saveResponse.value.passage?.content || '',
              "gist": saveResponse.value.passage?.gist || '',
              "isGenerated": 0,
              "questions": [
                ...questionsData.value, // 기존 질문 유지
                newQuestion
              ],
               // ✅ 추가된 필드
              "mode": "generate", // mode를 명확히 추가
            };



            const updateResponse = await fetch(`${apiUrl}/pass/ques/update/${saveResponse.value.passage.pasCode}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify(saveRequestData),
            });

            if (!updateResponse.ok) {
              // 인증 오류 처리 (401)
              if (response.status === 401) {


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
              throw new Error(`문항 저장 실패: ${updateResponse.status}`);
            }

            
            const updateResult = await updateResponse.json();


            // 상태 업데이트
            questionsData.value = [...questionsData.value, newQuestion]; // 기존 질문 + 새 질문 추가
            saveResponse.value = {
              ...saveResponse.value,
              passage: updateResult // 저장된 값 갱신
            };

            //새 문항이 표시되도록 캐러셀 인덱스 업데이트
            currentSlide.value = questionsData.value.length - 1;

            localStorage.setItem('saveResponse', JSON.stringify(saveResponse.value));


            isLoading.value = false;

            // 모달 닫기
            showPaymentModal.value = false;
            isProcessing.value = false;     
      } catch (error) {

          alert(`오류 발생: ${error.message}`);
          isProcessing.value = false;
      }
};

const handleQuestionChange = (updatedData, index) => {
    if (!updatedData || index === undefined) return;



    // ✅ 수정된 값 명확하게 저장
    questionsData.value[index] = {
        ...questionsData.value[index],
        queQuery: updatedData.title || '',
        queOption: updatedData.options || []
    };

    // 상태 변경 감지
    handleContentChange();
};

// const handleDescriptionChange = (event, index) => {
//   handleContentChange();

//   // 해당 인덱스의 문항 데이터 업데이트
//   if (event && index !== undefined) {
//     const targetIndex = index;

//     if (event.correct) {
//       console.log(`문항 ${targetIndex+1}의 정답을 ${event.correct}로 업데이트`);
//       questionsData.value[targetIndex].correct = event.correct;
//     }
//     if (event.description) {
//       console.log(`문항 ${targetIndex+1}의 해설 업데이트`);
//       questionsData.value[targetIndex].description = event.description;
//     }
//   }
// };

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
                          
  // console.log('변경 감지 상태:', {
  //   isContentChanged: isContentChanged.value,
  //   isSaved: isSaved.value,
  //   hasManualSave: hasManualSave.value,
  //   hasContentChanged,
  //   hasUnsavedContent
  // });

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
  isWarningModalOpen.value = false;
  pendingRoute.value = null;
};

// 이동 확인 - 타겟 페이지로 이동
const confirmNavigation = () => {

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
  try {
    const data = localStorage.getItem('saveResponse');
    if (data) {
      saveResponse.value = JSON.parse(data);

      
      // ✅ 값이 있으면 상태에 반영
      passageData.value.title = saveResponse.value.passage?.title || '';
      passageData.value.content = saveResponse.value.passage?.content || '';
      questionsData.value = saveResponse.value.passage?.questions || [];
      pasCode.value = saveResponse.value.passage?.pasCode || '';
    }
  } catch (error) {

    saveResponse.value = {}; // ✅ 오류 발생 시 빈 객체로 초기화
  }
  // URL 쿼리 파라미터에서 문항 유형과 서술 방식 가져오기
  if (route.query) {
    pattern.value = route.query.pattern || null;
    type.value = route.query.type || null;
  }

  // 라우터 state에서 선택된 문항 데이터 가져오기
  if (saveResponse.value && saveResponse.value.question) {
    questionData.value = saveResponse.question;
  }

  // 라우터 state에서 지문 데이터 가져오기
  if (saveResponse.value && saveResponse.value.passage) {
    passageData.value = saveResponse.value.passage;
    
    // EditPassage에 지문 내용 설정
    if (editPassageRef.value && saveResponse.value.passage && saveResponse.value.passage.content) {
      editPassageRef.value.setContent(saveResponse.value.passage.content);
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

      }
    }
  }

  // 이전 경로가 /home 또는 /storage로 시작하는지 확인
  const fromPath = route.query.from || '';
  isFromRoute.value = fromPath.startsWith('/home') || fromPath.startsWith('/storage');

  
  // 브라우저 새로고침, 닫기 등에 대한 이벤트 리스너 추가
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // 전역 네비게이션 가드 설정
  routerGuard = router.beforeEach((to, from, next) => {

    
    // 현재 라우트에서 다른 라우트로 이동하는 경우에만 확인
    if (from.path === route.path && hasUnsavedChanges()) {

      
      // 저장되지 않은 변경사항이 있다면 모달 표시하고 대기
      isWarningModalOpen.value = true;
      pendingRoute.value = to.fullPath; // 이동하려는 전체 경로 저장
      
      return false; // 네비게이션 중단
    }
    

    localStorage.removeItem('saveResponse');
    return next(); // 네비게이션 계속
  });
  
    // localStorage 변경 감지 타이머 설정
    changeDetectionTimer = setInterval(() => {
    const hasChanged = localStorage.getItem('editPassageChanged') === 'true';
    if (hasChanged) {
      // 변경사항 있음 - 버튼 활성화
      isContentChanged.value = true;
      localStorage.removeItem('editPassageChanged');
    }
  }, 500); // 500ms마다 체크
});

onBeforeUnmount(() => {
  // 컴포넌트 해제 시 이벤트 리스너 제거
  window.removeEventListener('beforeunload', handleBeforeUnload);

  // 라우터 가드 제거
  if (routerGuard) {
    routerGuard();
  }

    // 타이머 정리
    if (changeDetectionTimer) {
    clearInterval(changeDetectionTimer);
  }
  
  // localStorage 정리
  localStorage.removeItem('editPassageChanged');
});

// provide 실행
provide('passageData', {
  passage: passageData,
  updatePassage: (newContent) => {
    if (passageData.value) {
      passageData.value.content = newContent;
      // 내용이 변경되었음을 표시
      handleContentChange();
    } else {
      passageData.value = { content: newContent };
      // 새로운 내용이 추가되었음을 표시
      handleContentChange();
    }
  }
});


// 슬라이드가 변경될 때마다 포커스 조정 (접근성 개선)
watch(currentSlide, (newSlide) => {

});
</script>
<style scoped>
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
  gap: 8px;

  width: 100px;
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