<template>
    <div class="edit-question">
        <div class="edit-main">
            <div class="question-main">
                <div class="question-header">
                    <div class="title-container">
                        <span v-if="!isEditing" id="question-title">{{ title }}</span>
                        <input v-else type="text" v-model="title" id="input-title" ref="titleInput"/>
                    </div>
                    
                    <button class="edit-button" @click="toggleEditMode">
                        <Icon icon="mingcute:pencil-fill" width="24" height="24" 
                        :style="{color: isEditing ? '#FF9F40' : '#303030' }" />
                    </button>
                </div>
                <div class="question-items">
                    <div v-for="(item, index) in items" :key="index" class="question-item">
                        <span class="question-number">{{ circledNumbers[index] }}</span>
                        <span v-if="!isEditing" class="question-text">{{ item }}</span>
                        <input v-else type="text" v-model="items[index]" id="input-question"/>
                    </div>
                </div>
            </div>
            <BaseButton text="재생성하기" type="type4" id="recreate-button" width="200px" height="54px"/>
        </div>
    </div>
</template>
<script>
import BaseButton from '@/components/common/button/BaseButton.vue';

export default {
    name: 'QuestionList',
    components: {
        BaseButton
    },
    props: {
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
    },
    data() {
        return {
            // 문항 번호 기호 배열
            circledNumbers: ['①', '②', '③', '④', '⑤'],
            // 편집모드 상태
            isEditing: false,
            // 내부적으로 관리할 제목 데이터
            title: '',
            // 내부적으로 관리할 문항 데이터
            items: []
        }
    },
    methods: {
        // 편집 모드 토글
        toggleEditMode() {
            this.isEditing = !this.isEditing;

            // 편집 모드 변경 이벤트를 발생시켜 부모 컴포넌트에 알림
            this.$emit('edit-mode-changed', this.isEditing);

            // 편집 모드로 전환되면 input title에 포커스
            if (this.isEditing) {
                this.$nextTick(() => {
                    if (this.$refs.titleInput) {
                        this.$refs.titleInput.focus();
                    }
                })
            } else {
                this.$emit('update:questions', this.items);
                this.$emit('update:questionTitle', this.title);
            }
        }
    },
    created() {
        // props로 받은 문항 데이터를 내부 상태로 복사
        this.title = this.questionTitle;
        this.items = [...this.questions];
    },
    watch: {
        // props가 외부에서 변경될 경우 내부 상태도 업데이트
        questions: {
            handler(newVal) {
                this.items = [...newVal];
            },
            deep: true
        },
        questionTitle: {
            handler(newVal) {
                this.title = newVal;
            }
        }
    }
}
</script>
<style scoped>
.edit-question {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 4px;

    width: 930px;
    height: 405px;

    flex: none;
    order: 1;
    flex-grow: 0;
}
.edit-main {
    box-sizing: border-box;

    width: 927px;
    height: 365px;
    left: 137px;
    top: 0px;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;

}
.question-main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 12px;

    position: relative;
    width: 736.67px;
    height: 246px;
    left: calc(50% - 736.67px/2 - 71.67px);
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
    left: 845px;
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
    left: 704px;
    top: 40px;
}
</style>