<template>
    <div>
        <div id="text-count"><span style="color: #FF9500;">{{ content.length }}</span>/1700</div>
        <div id="passage-content-main">
            <textarea id="content-text" placeholder="본문을 입력해주세요." v-model="content"></textarea>
        </div>
    </div>
</template>
<script setup>
import { ref, defineExpose, watch } from 'vue';

// 본문 내용 ref로 관리
const content = ref('');

// 초기 텍스트 길이 설정
if (content.value.length === 0) {
    content.value = '인공지능과 기계학습은 현대 기술의 핵심 요소로 자리 잡고 있습니다. 이러한 기술은 데이터 처리와 분석을 통해 지속적으로 성능을 개선하며, 이는 의료, 금융, 제조업 등 다양한 분야에 걸쳐 응용되고 있습니다. 인공지능의 발전은 효율적인 데이터 이용을 통해 새로운 가능성을 제공하고 있지만, 동시에 윤리적 문제도 동반할 수 있습니다. 따라서 기술의 공정성과 투명성을 확보하기 위한 관리가 필요합니다.';
}

// 외부에서 접근할 수 있도록 함수 노출
const getContent = () => {
    return content.value;
};

// 노출할 메소드 정의
defineExpose({
    getContent
});
</script>
<style scoped>
#text-count {
    position: absolute;
    width: 76px;
    height: 24px;
    left: 1135px;
    top: 192px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;

    text-align: right;
    letter-spacing: -0.02em;
    color: #BDBDBD;
}
#passage-content-main {
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 32.5px 32px;
    gap: 8px;
    isolation: isolate;

    position: absolute;
    width: 928px;
    height: 547px;
    left: 292px;
    top: 220px;

    background: #FFFFFF;
    border: 1px solid #FF9F40;
    border-radius: 12px;
}
#content-text {
    width: 820px;
    height: 476px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;

    letter-spacing: -0.02em;

    color: #303030;

    flex: none;
    order: 0;
    flex-grow: 0;
    z-index: 0;

    border: none;
    outline: none; /* 포커스 된 경우의 파란 테두리 삭제 */
    resize: none;
}
</style>