<template>
    <BaseModal :isOpen="isOpen" width="1232px" height="968px" @close="closeModal">
        <div class="question-modal">
            <div class="modal-title">문항 생성하기</div>
            <div class="format-group">
                <div class="for-pattern">
                    <span class="chip-label">문항 유형</span>
                    <div class="chip-group">
                        <BaseButton
                            v-for="type in questionPattern"
                            :key="type.id"
                            class="chip"
                            :text="type.label"
                            type="type3"
                            :width="type.width"
                            height="40px"
                            :class="{ active: activePattern === type.label }"
                            @click="activePattern = type.label"
                        />
                    </div>
                </div>
                <div class="for-type">
                    <span class="chip-label">서술 방식</span>
                    <div class="chip-group">
                        <BaseButton
                            v-for="type in questionTypes"
                            :key="type.id"
                            class="chip"
                            :text="type.label"
                            type="type3"
                            :width="type.width"
                            height="40px"
                            :class="{ active: activeType === type.label }"
                            @click="activeType = type.label"
                        />
                    </div>
                </div>
                <!-- ✅ 난이도 선택 (라디오 버튼 방식) -->
                <!-- <div class="for-difficulty">
                    <span class="chip-label">난이도</span>
                    <div class="chip-group">
                        <BaseButton
                            v-for="level in difficultyLevels"
                            :key="level.id"
                            class="chip"
                            :text="level.label"
                            type="type3"
                            :width="level.width"
                            height="40px"
                            :class="{ active: activeDifficulty === level.label }"
                            @click="activeDifficulty = level.label"
                        />
                    </div>
                </div> -->
            </div>
            <div class="example-group">
                <!-- ✅ 필터링된 리스트 -->
                <div class="example-list">
                    <div class="list-wrapper" v-if="filteredQuestions.length > 0">
                        <div
                            v-for="(item, index) in filteredQuestions"
                            :key="index"
                            class="example-item"
                            :class="{ active: JSON.stringify(selectedQuestion) === JSON.stringify(item) }"
                            @click="selectedQuestion = item">
                            <span class="category">{{ item.pattern }}</span>
                            <div class="example-title">{{ item.title }}</div>
                        </div>
                    </div>

                    <!-- ✅ 필터링된 문항이 없을 때 -->
                    <div v-else>
                        <div class="empty-msg">문항 유형과 서술 방식을 선택해 주세요.</div>
                    </div>
                </div>

                <!-- ✅ 선택된 문항 미리보기 -->
                <div class="example-preview">
                    <div class="preview-title">문항 미리보기</div>
                    <div v-if="selectedQuestion">
                    <div class="question-title">{{ selectedQuestion.title }}</div>
                    <div class="question-content">{{ selectedQuestion.question }}</div>
                    </div>
                </div>    
            </div>
             <!-- 버튼 영역 -->
            <div class="modal-footer">
                <PlainTooltip id="tooltip" message="생성 시 이용권 1회 차감" width="205px"/>
                <BaseButton text="닫기" type="type3" width="140px" height="54px" @click="closeModal" />
                <BaseButton :text="createText" type="type1" width="182px" height="54px" :disabled="!selectedQuestion"
                @click.once="handleGenerateQuestion"/>
            </div>
        </div>
    </BaseModal>

    <LoadingModal :isOpen="isLoading" :message="loadingMessage" />
</template>
<script setup>
import { ref, computed, watch} from "vue";
import { useRouter } from 'vue-router';
import BaseModal from "../../BaseModal.vue";
import BaseButton from "@/components/common/button/BaseButton.vue";
import PlainTooltip from '@/components/common/PlainTooltip.vue';
import questionExample from '@/assets/data/questionExample.json';
import LoadingModal from '@/components/common/modal/LoadingModal.vue';

const router = useRouter();
const emit = defineEmits(["close", "openPaymentModal"]);

const props = defineProps({
  isOpen: Boolean,
  mode: {
    type: String,
    default: 'navigate' //'navigate' 또는 'generate'
  },
  createText: {type: String, default: "문항 생성하기"}, 
  passageTitle: String,  // 부모에서 전달된 제목
  passageContent: String,  // 부모에서 전달된 내용
});

const activePattern = ref(null); // 문항 유형 선택값
const activeType = ref(null); // 서술 방식 선택값
const activeDifficulty = ref(null); // 난이도 선택값
const selectedQuestion = ref(null); // 선택된 문항을 ref로 저장
const isProcessing = ref(false);
const isLoading = ref(false);
const loadingMessage = ref('문항을 생성 중입니다.\n생성까지 최대 3분이 소요될 수 있습니다.');


const closeModal = () => {
  emit("close");
  activePattern.value = null;
  activeType.value = null;
  activeDifficulty.value = null;
  selectedQuestion.value = null;
};

const handleGenerateQuestion = async () => {
    if (isProcessing.value) return; // 중복 실행 방지
    isProcessing.value = true;


    try {
        if (selectedQuestion.value) {
            // ✅ 로컬 스토리지에서 데이터 가져오기
            const savedPassageData = localStorage.getItem('tempPassageData');
            let passageData = null;

        if (savedPassageData) {
            passageData = JSON.parse(savedPassageData);

            localStorage.setItem('generateQuestionPassageData', savedPassageData);
            localStorage.setItem('selectedQuestionData', JSON.stringify(selectedQuestion.value));
        }

        // mode에 따라 다른 동작 수행
        if (props.mode === 'generate') {
            // GenerationQuestion 페이지에서 호출 (PaymentUsageModal 표시)
            emit('openPaymentModal', {
                pattern: selectedQuestion.value.pattern,
                type: selectedQuestion.value.type,
                queExample: selectedQuestion.value.title
            });
        } else {

            // const tempResponse = await fetch(`${apiUrl}/pass/ques/select/100`,{
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     credentials: "include",
            // });

            // if (!tempResponse.ok) throw new Error(`문항 생성 실패: ${tempResponse.status}`);

            // const saveResult = await tempResponse.json();
            // console.log('임시 데이터 성공:', saveResult);

            isLoading.value = true;
            loadingMessage.value = '문항을 생성 중입니다.\n생성까지 최대 3분이 소요될 수 있습니다.';

            // // ✅ 1단계: 키워드 생성 API 호출
            // const keywordRequestData = {
            //     "custom_passage": passageData?.PAS_CONTENT || ''
            // };

            // console.log("keywordRequestData:", keywordRequestData);


            // const keywordResponse = await fetch('http://api.chunjae-it-edu.com/get-type-keyword',{
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(keywordRequestData),
            // });

            // if (!keywordResponse.ok) throw new Error(`문항 생성 실패: ${keywordResponse.status}`);

            // const keywordResult = await keywordResponse.json();

            // ✅ 2단계: 문항 생성 API 호출
            const requestData = {
                "custom_passage": passageData?.PAS_CONTENT || '',
                "type_question": selectedQuestion.value.pattern,
                "type_question_detail": selectedQuestion.value.type,
                "question_example": selectedQuestion.value.title,
            };



            const response = await fetch('http://api.chunjae-it-edu.com/generate-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) throw new Error(`문항 생성 실패: ${response.status}`);
            
            const result = await response.json();



            // ✅ 3단계: 문항 저장 API 호출

            const saveRequestData = {
                "type": result.type_passage,
                "keyword": result.keyword[0],
                "title": passageData?.PAS_TITLE || '',
                "content": passageData?.PAS_CONTENT || '',
                "gist": passageData?.PAS_GIST ||'',
                "isGenerated": 0,
                "questions":[{
                    "queQuery": result.generated_question,
                    "queOption": result.generated_option,
                    "queAnswer": result.generated_answer,
                    "description": result.generated_description
                }]
            };



            const apiUrl = import.meta.env.VITE_API_URL;

            const saveResponse = await fetch(`${apiUrl}/pass/ques/insert/each`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify(saveRequestData),
            });

            if (!saveResponse.ok) throw new Error(`문항 저장 실패: ${saveResponse.status}`);
            
            const saveResult = await saveResponse.json();



            // ✅ 작업 완료 후 상태 초기화 및 모달 닫기

            localStorage.setItem('saveResponse', JSON.stringify({
                question: selectedQuestion.value,
                passage: saveResult
            }));
            isLoading.value = false;

            // QuestionMain 페이지에서 호출 (페이지 이동)
            router.push({
                path: '/questions/generate',
                query: {
                    pattern:selectedQuestion.value.pattern,
                    type: selectedQuestion.value.type,
                    queExample: selectedQuestion.value.title,
                },
            });
        }

        activePattern.value = null;
        activeType.value = null;
        activeDifficulty.value = null;
        selectedQuestion.value = null;
        emit("close");
    }
} catch (error) {

    alert(`오류 발생: ${error.message}`);
} finally {
    isProcessing.value = false;
}
};


const questionPattern = ref([
    { id: 1, label: "전체", width: "52px"},
    { id: 2, label: "사실적 읽기", width: "96px"},
    { id: 3, label: "추론적 읽기", width: "96px"},
    { id: 4, label: "비판적 읽기", width: "96px"},
    { id: 5, label: "어휘 및 문법", width: "99px"},
]);

const questionTypes = ref([
    { id: 6, label: "전체", width: "52px"},
    { id: 7, label: "정답형", width: "65px"},
    { id: 8, label: "부정형", width: "65px"},
])

const difficultyLevels = ref([
    { id: 9, label: "하", width: "38px" },
    { id: 10, label: "중", width: "38px" },
    { id: 11, label: "상", width: "38px" },
]);

const questions = questionExample;

// ✅ 선택된 라디오 버튼에 따라 자동 필터링
const filteredQuestions = computed(() => {
  if (!activePattern.value || !activeType.value && !activeDifficulty.value) {
    return []; // 필터가 선택되지 않았다면 빈 배열 반환
  }
  
  return questionExample.filter((q) => {
    return (
      (activePattern.value === "전체" || q.pattern === activePattern.value) &&
      (activeType.value === "전체" || q.type === activeType.value) &&
      (activeDifficulty.value === null || activeDifficulty.value === "전체" || q.difficulty === activeDifficulty.value)
    );
  });
});


// ✅ 필터링된 리스트 변경 시 첫 번째 문항을 자동으로 선택
watch(filteredQuestions, (newList) => {
  if (newList.length > 0) {
    // 기존 선택 문항이 필터링 결과에 포함되지 않으면 첫 번째 문항 선택
    if (!selectedQuestion.value || !newList.includes(selectedQuestion.value)) {
      selectedQuestion.value = newList[0];
    }
  } else {
    selectedQuestion.value = null;
  }
});
</script>

<style scoped>
/* 모달 컨테이너 */
.question-modal {
  width: 1232px;
  height: 968px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 40px;
}

.modal-title{
font-weight: 700;
font-size: 24px;
line-height: 150%;
letter-spacing: -2%;
}

.format-group{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.for-pattern, .for-type, .for-difficulty  {
    display: flex;
    align-items: center;
    gap: 16px;
}

.chip-label{
font-weight: 400;
font-size: 12.92px;
line-height: 150%;
letter-spacing: -2%;
color:#424242;
width: 50px;
text-align: left;
}

.chip-group{
    display: flex;
    gap: 16px;
}

.chip{
font-weight: 600;
font-size: 16px;
line-height: 150%;
letter-spacing: -2%;
padding: 12px 8px;
border: 1px solid #BDBDBD;
color: #BDBDBD;
}

/* ✅ 활성화된 Chip 스타일 */
.chip.active {
    background-color: #FFEDDC;
    border: none;
    color: #FF9F40;
}

.example-group{
    display: flex;
    gap: 20px;
}

.example-list{
    width: 578px;
    height: 582px;
    border-radius: 20px;
    border: 1px solid #BDBDBD;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.list-wrapper{
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 545px;
    height: 550px;
    max-height: 550px;
    overflow-y: scroll;
}

.example-item{
    width: 510px;
    height: 96px;
    border-radius: 20px;
    border: 1px solid #BDBDBD;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    gap: 10px;
    cursor: pointer;
}  

/* ✅ 활성화된 example-item 스타일 */
.example-item.active {
    border: 1px solid #FF9F40;
    background-color: #FFF5EB;
}


.category{
    width: 100px;
    height: 32px;
    border-radius: 8px;
    padding: 4px 8px;
    border: 1px solid #FF9F40;
    color: #FF9F40;
    background-color: #FFE5CA;
    font-weight: 600;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: -2%;
}

.example-title{
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: -2%;
    color: #303030;
}

.empty-msg{
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;
    letter-spacing: -2%;
    text-align: center;
    width: 205px;
}

.example-preview{
    width: 554px;
    height: 582px;
    border-radius: 20px;
    border: 1px solid #BDBDBD;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    /* 스크롤바 추가 */
    overflow-y: auto;
    max-height: 582px;
}

.preview-title{
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;
    letter-spacing: -2%;
    margin-bottom: 30px;
}

.question-title{
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;
    letter-spacing: -2%;
    margin-bottom: 12px;
    text-align: left;
}

.question-content{
    font-weight: 400;
    font-size: 16px;
    line-height: 40px;
    letter-spacing: -2%;
    white-space: pre-wrap;
    text-align: start;
}

/* 버튼 영역 */
.modal-footer {
  display: flex;
  gap: 10px;
  align-self: flex-end;
}

#tooltip{
    position:absolute; top:763px; left:1010px;
}
</style>