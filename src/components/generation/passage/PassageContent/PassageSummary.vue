<template>
    <div id="passage-summary">
        <div class="passage-type-container">
            <p id="passage-type-text">지문 유형</p>
            <div class="passage-type-main">
                <div id="subject">
                    <p id="subject-head">지문 주제</p>
                    <p id="subject-text">사회</p>
                </div>
                <div id="keyword">
                    <p id="keyword-head">지문 제재</p>
                    <p id="keyword-text">인공지능과 기계학습</p>
                </div>
            </div>
        </div>
        <div class="gist-container">
            <p id="gist-text">핵심 논점</p>
            <div class="gist-main">
                <ol class="gist-list">
                    <li v-for="(item, index) in items" :key="index" class="list-item">
                        {{ item }}
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const items = ref ([
    '인공지능과 기계학습의 원리는 데이터 처리와 분석을 통해 성능을 개선하는 것이다.',
    '기계학습의 응용은 의료, 금융, 제조업 등 다양한 분야에 걸쳐 있으며, 데이터의 효율적 이용을 통해 새로운 가능성을 제공한다.',
    '인공지능과 기계학습의 활용은 윤리적 문제를 동반할 수 있으며, 기술의 공정성과 투명성을 확보하기 위한 관리가 필요하다.'

]);
</script>
<style scoped>
#passage-summary {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 44px;

    position: absolute;
    width: 522px;
    height: 591px;
    left: 1244px;
    top: 176px;
}

.passage-type-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 8px;

    width: 522px;
    height: 152px;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
#passage-type-text {
    width: 522px;
    height: 36px;
    padding-top: 5px;
    margin: 0px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
.passage-type-main {
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 20px;

    width: 522px;
    height: 108px;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
#subject {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 20px;

    width: 482px;
    height: 46px;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
#subject-head {
    height: 30px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;
}
#subject-text {
    height: 30px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;

    flex: none;
    order: 0;
    flex-grow: 0;
}
#keyword {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 20px;

    width: 482px;
    height: 46px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
#keyword-head {
    width: 73px;
    height: 30px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;

    flex: none;
    order: 0;
    flex-grow: 0;
}
#keyword-text {
    height: 30px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;

    flex: none;
    order: 0;
    flex-grow: 1;
}
.gist-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 8px;

    width: 522px;
    height: 395px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
#gist-text {
    width: 522px;
    height: 32px;
    margin: 0px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;

    color: #000000;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
.gist-main {
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 8px;

    width: 522px;
    height: 355px;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
.gist-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-left: 20px;
    gap: 20px;

    width: 482px;
    height: 208px;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;

    letter-spacing: -0.02em;
    color: #000000;
}
</style>