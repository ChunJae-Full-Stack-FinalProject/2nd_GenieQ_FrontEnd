<template>
    <div class="edit-title">
        <p id="passage-head">작업이름</p>
            <input type="text" id="passage-title"
            placeholder="작업 이름을 입력해 주세요. (최대 50자)" v-model="title"/>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';

const title = ref('');
const MAX_LENGTH = 50;

watch(title, (newValue) => {
    // 최대 글자 수 제한 
    if (newValue.length > MAX_LENGTH) {
        // 최대 길이로 잘라서 다시 설정
        title.value = newValue.substring(0, MAX_LENGTH);
    }
});
</script>
<style scoped>
.edit-title {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 12px;

    position: absolute;
    width: 848px;
    height: 88px;
    left: 39px;
    top: 24px;
}
#passage-head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 12px;

    width: 610px;
    height: 30px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;
    letter-spacing: -0.02em;

    color: #303030;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
#passage-title {
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 848px;
    height: 46px;

    background: #FFFFFF;
    border: 1px solid #FF9F40;
    border-radius: 8px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
</style>