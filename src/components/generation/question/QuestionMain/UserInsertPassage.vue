<template>
    <div>
        <textarea id="user-passage-text" v-model="userInput" placeholder="지문을 입력해주세요."></textarea>
    </div>
</template>
<script setup>
import { ref, inject, watch, onMounted } from 'vue';

const userInput = ref('');


// 상위 컴포넌트에서 제공한 데이터 주입
const { currentPassage, showLengthWarning } = inject('passageData');
const MIN_LENGTH = 500;
const MAX_LENGTH = 1700;

// 부모 컴포넌트에서 전달받은 지문 상태 감시
watch(() => currentPassage.value.PAS_CONTENT, (newContent) => {
  userInput.value = newContent || '';
}, { immediate: true });

// 사용자 입력 감시
watch(userInput, (newValue) => {
  // 최대 글자 수 제한
  if (newValue.length > MAX_LENGTH) {
    userInput.value = newValue.slice(0, MAX_LENGTH);
  }
  
  // 현재 패시지 내용 업데이트
  currentPassage.value.PAS_CONTENT = userInput.value;
});
</script>
<style scoped>
textarea {
  position: absolute;
  top: 32px;
  left: 32px;
  width: 776px;
  height: 358px;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;

  letter-spacing: -0.02em;
  color: #303030;

  border: none;
  outline: none; /* 포커스 된 경우의 파란 테두리 삭제 */
  resize: none;
}
</style>