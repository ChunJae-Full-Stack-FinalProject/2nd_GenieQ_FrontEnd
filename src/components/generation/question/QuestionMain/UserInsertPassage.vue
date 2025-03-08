<template>
    <div>
        <textarea id="user-passage-text" v-model="userInput" placeholder="지문을 입력해주세요."></textarea>
    </div>
</template>
<script setup>
import { ref, inject, watch } from 'vue';

const userInput = ref('');

// 상위 컴포넌트에서 제공한 데이터 주입
const { currentPassage } = inject('passageData');

// 부모 컴포넌트에서 전달받은 지문 상태 감시
watch(() => currentPassage.value, (newPassage) => {
    if (newPassage && newPassage.content) {
        userInput.value = newPassage.content;
    }
}, { immediate: true, deep: true });
</script>
<style scoped>
#user-passage-text {
    width: 756px;
    height: 358px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;

    letter-spacing: -0.02em;
    color: #303030;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 1;

    border: none;
    outline: none; /* 포커스 된 경우의 파란 테두리 삭제 */
    resize: none;
}
</style>