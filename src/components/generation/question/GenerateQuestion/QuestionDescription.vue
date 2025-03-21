<template>
    <div class="question-description">
        <div class="description-main">
            <span v-if="!isEditing" id="correct-answer">정답 {{ queAnswer }}</span>
            <!-- <input v-else type="text" v-model="answer" id="input-answer"/> -->
            <div v-else class="select-answerbox">
                <div id="input-answer">
                    <p>정답</p>
                    <div class="answer-option">
                        <input type="radio" :id="`answer1-${uniqueId}`" value="①" v-model="localAnswer" @change="handleDescriptionChanged">
                        <label :for="`answer1-${uniqueId}`">①</label>
                    </div>
                    <div class="answer-option">
                        <input type="radio" :id="`answer2-${uniqueId}`" value="②" v-model="localAnswer" @change="handleDescriptionChanged">
                        <label :for="`answer2-${uniqueId}`">②</label>
                    </div>
                    <div class="answer-option">
                        <input type="radio" :id="`answer3-${uniqueId}`" value="③" v-model="localAnswer" @change="handleDescriptionChanged">
                        <label :for="`answer3-${uniqueId}`">③</label>
                    </div>
                    <div class="answer-option">
                        <input type="radio" :id="`answer4-${uniqueId}`" value="④" v-model="localAnswer" @change="handleDescriptionChanged">
                        <label :for="`answer4-${uniqueId}`">④</label>
                    </div>
                    <div class="answer-option">
                        <input type="radio" :id="`answer5-${uniqueId}`" value="⑤" v-model="localAnswer" @change="handleDescriptionChanged">
                        <label :for="`answer5-${uniqueId}`">⑤</label>
                    </div>
                </div>
            </div>
            
            <div class="content-box">
            <span v-if="!isEditing" id="description-content">{{ description }}</span>
            <textarea v-else type="text" v-model="description" id="input-content" @input="handleDescriptionChanged"></textarea>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// props 정의
const props = defineProps({
    // 정답
    queAnswer: {
        type: String,
        default: '①'
    },
    // 해설
    description: {
        type: String,
        default: ""
    },
    // 편집 모드 상태를 props로 받음
    isEditing: {
        type: Boolean,
        default: false
    },
    // 현재 슬라이드 인덱스
    slideIndex: {
        type: Number,
        default: 0
    }
});

// emits 정의
const emit = defineEmits(['description-changed']);

// 내부적으로 관리할 정답 데이터 (v-model에 연결)
const localAnswer = ref('');
// 내부적으로 관리할 해설 데이터
const description = ref('');

// 고유 ID 계산 (slideIndex 기반)
const uniqueId = computed(() => `desc-${props.slideIndex}`);

// 해설 변경 시 이벤트 발생
const handleDescriptionChanged = () => {
    // 변경사항을 부모 컴포넌트에 알림
    emit('description-changed', {
        queAnswer: localAnswer.value,
        description: description.value,
        slideIndex: props.slideIndex
    });
};

// 초기 상태 설정
onMounted(() => {
    localAnswer.value = props.queAnswer;
    description.value = props.description;
});

// props 변경 감시
watch(() => props.queAnswer, (newVal) => {
    localAnswer.value = newVal;
});

watch(() => props.description, (newVal) => {
    description.value = newVal;
});

watch(() => props.isEditing, (newVal) => {
    // console.log('편집 모드 변경 : ', newVal);
});
</script>
<style scoped>
.question-description {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 4px;

    position: relative;
    left: 0;
    top: 0;
}
.description-main {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 8px;

    width: 100%;
    height: 365px;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;
}
#correct-answer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 34px;
    width: 480px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    line-height: 32px;

    letter-spacing: -0.019em;
    color: #000000;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
#description-content, #input-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 34px;

    width: 480px;
    height: 277px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    line-height: 32px;

    letter-spacing: -0.019em;
    color: #000000;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;

    resize: none;
}
.select-answerbox{
    display: flex;
    flex-direction: start;
    align-items: center;
    padding: 0px;
    gap: 8px;

    width: 480px;
    height: 40px;

    white-space: nowrap;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
#input-answer {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 19px;

    width: 217px;
    height: 20px;

    flex: none;
    order: 0;
    flex-grow: 0;
}
input[type="radio"] {
    display: none;
}

label {
    font-size: 20px;
}


.answer-option {
    display: flex;
    align-items: center;
    justify-content: center;
}

.answer-option input[type="radio"] {
    display: none; /* 기본 라디오 버튼 숨기기 */
}

.answer-option label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12px; /* 정확한 너비 */
    height: 12px; /* 정확한 높이 */
    border-radius: 50%; /* 완전한 원 모양 */
    font-size: 19px;
    line-height: 32px;
    text-align: center;
}

.answer-option input[type="radio"]:checked + label {
    background-color: #FFEDDC; /* 연한 주황색 배경 */
    color: #FF9F40; /* 진한 주황색 텍스트 */
}
</style>