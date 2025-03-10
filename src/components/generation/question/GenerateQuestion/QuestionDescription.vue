<template>
    <div class="question-description">
        <p id="description-head">문제 해설</p>
        <div class="description-main">
            <span v-if="!isEditing" id="correct-answer">정답 {{ answer }}</span>
            <!-- <input v-else type="text" v-model="answer" id="input-answer"/> -->
            <div v-else class="select-answerbox">
                <div id="input-answer">
                    <p>정답</p>
                    <div class="answer-option">
                        <input type="radio" id="answer1" value="1" checked v-model="selectedAnswer">
                        <label for="answer1">①</label>
                    </div>
                    <div class="answer-option">
                        <input type="radio" id="answer2" value="2" v-model="selectedAnswer">
                        <label for="answer2">②</label>
                    </div>
                    <div class="answer-option">
                        <input type="radio" id="answer3" value="3" v-model="selectedAnswer">
                        <label for="answer3">③</label>
                    </div>
                    <div class="answer-option">
                        <input type="radio" id="answer4" value="4" v-model="selectedAnswer">
                        <label for="answer4">④</label>
                    </div>
                    <div class="answer-option">
                        <input type="radio" id="answer5" value="5" v-model="selectedAnswer">
                        <label for="answer5">⑤</label>
                    </div>
                </div>
            </div>
            
            <div class="content-box">
            <span v-if="!isEditing" id="description-content">{{ content }}</span>
            <textarea v-else type="text" v-model="content" id="input-content"></textarea>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'QuestionDescription',
    props: {
        // 정답
        correct: {
            type: String,
            default: '①'
        },
        // 해설
        description: {
            type: String,
            default: "연구 커뮤니티는 이러한 모델의 규모를 확장하면 성능이 향상된다고 인정한다고 했으므로, \n① ‘LLMs의 성능은 모델의 크기를 줄일수록 향상된다.’ 는 글의 내용과 일치하지 않는다."
        },
        // 편집 모드 상태를 props로 받음
        isEditing: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            selectedAnswer: 1,
            // 내부적으로 관리할 정답 데이터
            answer: '',
            // 내부적으로 관리할 해설 데이터
            content: '',
        }
    },
    created() {
        // props로 받은 데이터를 내부 상태로 복사
        this.answer = this.correct;
        this.content = this.description;
    },
    watch: {
        // props가 외부에서 변경될 경우, 내부 상태도 업데이트
        correct: {
            handler(newVal) {
                this.answer = newVal;
            }
        },
        description: {
            handler(newVal) {
                this.content = newVal;
            }
        }
    }
}
</script>
<style scoped>
.question-description {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 4px;

    position: absolute;
    width: 520px;
    height: 407px;
    left: 1244px;
    top: 963px;
}
#description-head {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 105px;
    height: 48px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    color: #000000;
}
.description-main {
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 8px;

    width: 520px;
    height: 365px;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
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