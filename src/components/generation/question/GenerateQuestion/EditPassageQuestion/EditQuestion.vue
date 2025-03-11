<template>
    <div class="edit-question">
        <div class="edit-main">
            <div class="question-main">
                <div class="question-header">
                    <div class="title-container">
                        <span v-if="!isEditing" id="question-title">{{ title }}</span>
                        <input v-else type="text" v-model="title" id="input-title" ref="titleInput" @input="handleQuestionChanged"/>
                    </div>
                    
                    <button class="edit-button" @click="isEditing ? toggleEditMode() : requestEditMode()">
                        <Icon icon="mingcute:pencil-fill" width="24" height="24" 
                        :style="{color: isEditing ? '#FF9F40' : '#303030' }" />
                    </button>
                </div>
                <div class="question-items">
                    <div v-for="(item, index) in items" :key="index" class="question-item">
                        <span class="question-number">{{ circledNumbers[index] }}</span>
                        <span v-if="!isEditing" class="question-text">{{ item }}</span>
                        <input v-else type="text" v-model="items[index]" id="input-question" @input="handleQuestionChanged"/>
                    </div>
                </div>
            </div>
            <BaseButton text="재생성하기" type="type4" id="recreate-button" width="200px" height="54px" @click="handleRecreate"/>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import BaseButton from '@/components/common/button/BaseButton.vue';

// props 정의
const props = defineProps({
    // 문제 제목
    questionTitle: {
        type: String,
        default: '다음 중 본문과 내용이 다른 것을 고르시오.'
    },
    // 문항 리스트
    questions: {
        type: Array,
        default: () => [
            'LLMs의 성능은 모델의 크기를 줄일수록 향상된다.',
            'LLMs의 성능은 모델의 크기를 줄일수록 향상된다.',
            'LLMs는 인공지능이 인간 언어를 이해하고 생성하는 방식을 변화시키고 있다.',
            'ChatGPT와 같은 혁신은 LLMs가 독특한 문제 해결 능력을 보여주기 시작했음을 나타낸다.',
            '연구자들은 LLMs의 잠재력을 확대하기 위해 새로운 아키텍처와 훈련 전략을 탐구하고 있다.'
        ]
    }
});

// emits 정의
const emit = defineEmits([
    'edit-mode-changed', 
    'update:questions', 
    'update:questionTitle', 
    'question-changed',
    'request-edit-mode',
    'recreate-question'  // 재생성 버튼 클릭 시 이벤트 추가
]);

// 반응형 상태 정의
const isEditing = ref(false);
const title = ref(props.questionTitle);
const items = ref([...props.questions]);
const titleInput = ref(null);

// 문항 번호 기호 배열
const circledNumbers = ['①', '②', '③', '④', '⑤'];

// 재생성 버튼 클릭 핸들러
const handleRecreate = () => {
    emit('recreate-question');
};

// 편집 버튼 클릭 핸들러 - 부모 컴포넌트에게 편집 요청을 알림
const requestEditMode = () => {
    emit('request-edit-mode');
};

// 편집 모드 토글 (부모 컴포넌트에서 호출될 수 있음)
const toggleEditMode = (forceEditMode) => {
    console.log('toggleEditMode 호출됨, 이전 상태:', isEditing.value, '강제 값:', forceEditMode);
    
    // forceEditMode가 제공되면 해당 값으로 설정, 아니면 토글
    if (forceEditMode !== undefined) {
        isEditing.value = forceEditMode;
    } else {
        isEditing.value = !isEditing.value;
    }
    
    console.log('toggleEditMode 실행 후 상태:', isEditing.value);

    // 편집 모드 변경 이벤트를 발생시켜 부모 컴포넌트에 알림
    emit('edit-mode-changed', isEditing.value);

    // 편집 모드로 전환되면 input title에 포커스
    if (isEditing.value) {
        nextTick(() => {
            if (titleInput.value) {
                titleInput.value.focus();
            }
        });
    } else {
        emit('update:questions', items.value);
        emit('update:questionTitle', title.value);
    }
};

// 문항 변경 시 이벤트 발생
const handleQuestionChanged = () => {
    emit('question-changed');
};

// props 변경 감시
watch(() => props.questions, (newVal) => {
    items.value = [...newVal];
}, { deep: true });

watch(() => props.questionTitle, (newVal) => {
    title.value = newVal;
});

// 컴포넌트 마운트 시 초기화
onMounted(() => {
    title.value = props.questionTitle;
    items.value = [...props.questions];
});

// 외부에서 호출 가능하도록 함수 노출
defineExpose({
    toggleEditMode
});
</script>
<style scoped>
.edit-question {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 4px;

    width: 100%;
    height: 100%;
}
.edit-main {
    box-sizing: border-box;
    width: 100%;
    height: 365px;
    
    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;
}
.question-main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-top: 7px;
    gap: 12px;
    position: relative;
    width: 90%;
    margin: 0 auto;
    height: auto;
    top: 25px;
}
.question-header {
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;
}
.title-container {
    flex: 1;
    margin-right: 10px;
}
#question-title {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;
    align-self: stretch;
}
#input-title {
    height: 36px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;
    align-self: stretch;

    border: none;
    width: 734px;
}
.edit-button {
    border: none;
    background: none;
    cursor: pointer;
    
    position: absolute;
    top: 3px;
    left: 830px;
    width: 16.67px;
}
.question-items {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 12px;

    width: 736.67px;
    height: 198px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
    z-index: 1;
}
.question-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 8px;

    width: 736.67px;
    height: 30px;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
.question-number, .question-text {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;

    flex: none;
    order: 0;
    flex-grow: 0;
}
#input-question {
    width: 710px;
    height: 30px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;
    letter-spacing: -0.02em;
    color: #303030;
    border: 1px solid #BDBDBD;
}
#recreate-button {
    position: relative;
    left: 703px;
    top: 40px;
}
</style>