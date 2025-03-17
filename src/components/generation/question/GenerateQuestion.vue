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
        <BaseButton text="문항 추가하기" type="type2" id="add-button" width="248px" height="54px" :disabled="isContentChanged || isFromRoute" @click="validateAndOpenModal"/>
        <BaseButton text="저장하기" type="type2" id="save-button" width="248px" height="54px" :disabled="!isContentChanged" @click="handleSaveButtonClick"/>
        <BaseButton text="추출하기" type="type2" id="download-button" width="248px" height="54px" :disabled="isContentChanged" @click="openFileModal"/>
    </div>
        
    <GenerateQuestionModal 
      :isOpen="showGenerateQuestionModal" 
      createText="다음"
      mode="generate"
      @close="showGenerateQuestionModal = false"
      @openPaymentModal="showPaymentModal = true"
    />
    <!-- PaymentUsageModal 컴포넌트 -->
    <PaymentUsageModal 
      :isOpen="showPaymentModal" 
      createText="문항 추가하기" 
      @close="showPaymentModal = false"
      @generate="handleQuestionGeneration"
    />

    <!-- 재생성 모달 추가 -->
    <PaymentUsageModal
      :isOpen="showRecreateModal"
      createText="재생성하기" 
      @close="showRecreateModal = false"
      @generate="handleRecreateGeneration"
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
  content: ''
});
const isConfirmModalOpen = ref(false);
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
const loadingMessage = ref('문항을 생성 중입니다...');

// EditQuestion 컴포넌트 참조
const editQuestionRefs = ref([]);

// 캐러셀 관련 상태
const currentSlide = ref(0);

const saveResponse = ref({});

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

// 제목 및 지문 수정
const handlePassageChange = (updatedData) => {
  passageData.value.title = updatedData.title || '';
  passageData.value.content = updatedData.content || '';

  console.log('지문 수정됨:', passageData.value);
  
  // 상태 변경 감지
  handleContentChange();
};

// 해설 수정
const handleDescriptionChange = (event, index) => {
  if (!event || index === undefined) return;

  console.log(`문항 ${index + 1} 해설 수정됨:`, event);

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
  console.log('재생성하기 버튼 클릭됨, 문항 인덱스:', index || currentSlide.value);
  
  // 현재 재생성하려는 문항 인덱스 저장
  currentRecreateIndex.value = index !== undefined ? index : currentSlide.value;
  
  // 지문 길이 검증
  if (!validatePassageLength()) {
    showLengthWarning();
  } else {
    // PaymentUsageModal 표시
    showRecreateModal.value = true;
  }
};

// 재생성 실행 핸들러 (PaymentUsageModal에서 버튼 클릭 시 호출)
const handleRecreateGeneration = async () => {
  if (showRecreateModal.value === false) {
    return;
  }

  if (isProcessing.value) return; // 중복 실행 방지
  isProcessing.value = true;

  isLoading.value = true;
  loadingMessage.value = '문항을 재생성 중입니다...';

  try {
    console.log("pattern: ", route.query.pattern);
    console.log("type: ", route.query.type);
    console.log("queExample: ", route.query.queExample);

            // 임시 api 연결
            const apiUrl = import.meta.env.VITE_API_URL;

            // 1단계: 문항 생성 API 호출
            const requestData = {
                "custom_passage": saveResponse.value.passage?.content || '',
                "type_question": route.query.pattern,
                "type_question_detail": route.query.type,
                "question_example": route.query.queExample,
            };

            console.log("Request Data:", requestData);

            const response = await fetch('http://10.41.1.56:7777/generate-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

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
              throw new Error(`문항 생성 실패: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('문항 생성 성공:', result);
            

            //2단계: 문항 저장 API 호출
            const newQuestion = {
              "queQuery": result.generated_question,
              "queOption": result.generated_option,
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
              ]
            };

            console.log("saveRequest: ", saveRequestData);

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
              throw new Error(`문항 저장 실패: ${updateResponse.status}`);
            }

            
            const updateResult = await updateResponse.json();
            console.log('문항 저장 성공:', updateResult);

            // 상태 업데이트
            questionsData.value = [...questionsData.value, newQuestion]; // 기존 질문 + 새 질문 추가
            saveResponse.value = {
              ...saveResponse.value,
              passage: updateResult // 저장된 값 갱신
            };

            //새 문항이 표시되도록 캐러셀 인덱스 업데이트
            currentSlide.value = questionsData.value.length - 1;

            localStorage.setItem('saveResponse', JSON.stringify(saveResponse.value));

            console.log('저장된 값:', localStorage.getItem('saveResponse'));
            isLoading.value = false;

            // 모달 닫기
            showRecreateModal.value = false;     
      } catch (error) {
          console.error('API 요청 실패:', error);
          alert(`오류 발생: ${error.message}`);
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
      console.log('수정 모드 활성화: 현재 슬라이드', currentSlide.value);
      const currentEditQuestion = editQuestionRefs.value[currentSlide.value];
      currentEditQuestion.toggleEditMode(true); // true를 명시적으로 전달
    } else {
      console.error('에러: 현재 슬라이드의 EditQuestion 컴포넌트를 찾을 수 없습니다.', { 
        slideIndex: currentSlide.value, 
        refsLength: editQuestionRefs.value ? editQuestionRefs.value.length : 0
      });
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
  console.log('내용이 변경되었습니다:', { isContentChanged: isContentChanged.value, hasManualSave: hasManualSave.value });
};

// 저장 버튼 클릭 핸들러
const handleSaveButtonClick = () => {
  if (isProcessing.value) return; // 중복 실행 방지
      isProcessing.value = true;

  updateEditingMode(false);

  if (editPassageRef.value) {
    const isValid = editPassageRef.value.validateTextLength();
    
    if (isValid) {

      console.log("저장데이터: ", passageData.value);
      const apiUrl = import.meta.env.VITE_API_URL;
      const pasCode = saveResponse.value.passage.pasCode;
      const selectedQuestion = saveResponse.value.question;

      // 지문 저장 api
      fetch(`${apiUrl}/pass/ques/update/${pasCode}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(passageData.value),
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
        localStorage.setItem('saveResponse', JSON.stringify({
            question: selectedQuestion,
            passage: data
        }))
    })
    .catch(error => {
        console.error("문항 수정 실패 : ", error);
    });

    
      savePassageData();
      isSaved.value = true;
      hasManualSave.value = true;
      isContentChanged.value = false; // 저장 후 내용 변경 플래그를 false로 설정
      console.log('내용이 저장되었습니다:', { isContentChanged: isContentChanged.value, hasManualSave: hasManualSave.value });
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
  console.log('전역 편집 모드 변경:', value);
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
    // GenerateQuestion 표시
    showGenerateQuestionModal.value = true;
  }
};

// 파일 선택 모달 열기 함수
const openFileModal = () => {
  // 지문 길이 검증
  if (!validatePassageLength()) {
    showLengthWarning();
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
  console.log('선택된 파일 형식:', fileType);
  // 여기에 선택된 파일 형식에 따른 추출 로직 구현
  // 예: PDF, Word, TXT 파일 생성 및 다운로드 등
};

// 문항 생성 처리 함수
const handleQuestionGeneration = () => {
  if (showPaymentModal.value === false) {
    return;
  }

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
    queAnswer: '①',
    description: "으아아아아아아아아악 너무 힘들어요오오오오오오 살려줘 제에에에에ㅔㅇ바라라아ㅏ아아라"
  };

  // 기존 배열을 유지하면서 새 문항 추가
  questionsData.value.push(newQuestion);

  // 새로운 문항이 표시되는 페이지로 이동
  currentSlide.value = questionsData.value.length - 1;
  
  // 모달 닫기
  showPaymentModal.value = false;
  console.log(questionsData);
};

// const handleQuestionChange = (event, index) => {
//   handleContentChange();
//   // 필요한 경우, 특정 인덱스의 문항 데이터 업데이트
// }

const handleQuestionChange = (updatedData, index) => {
    if (!updatedData || index === undefined) return;

    console.log(`문항 수정됨 [${index}]:`, updatedData);

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
  try {
    const data = localStorage.getItem('saveResponse');
    if (data) {
      saveResponse.value = JSON.parse(data);
      console.log("로드된 데이터:", saveResponse.value);
      
      // ✅ 값이 있으면 상태에 반영
      passageData.value.title = saveResponse.value.passage?.title || '';
      passageData.value.content = saveResponse.value.passage?.content || '';
      questionsData.value = saveResponse.value.passage?.questions || [];
      pasCode.value = saveResponse.value.passage?.pasCode || '';
    }
  } catch (error) {
    console.error('JSON 파싱 오류:', error);
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
        console.error('저장된 지문 데이터를 불러오는 중 오류 발생:', error);
      }
    }
  }

  // 이전 경로가 /home 또는 /storage로 시작하는지 확인
  const fromPath = route.query.from || '';
  isFromRoute.value = fromPath.startsWith('/home') || fromPath.startsWith('/storage');
  console.log('이전 경로:', route.query.from, isFromRoute.value);
  
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
    localStorage.removeItem('saveResponse');
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