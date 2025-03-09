<template>
    <div class="edit-passage-question">
        <EditPassage ref="editPassageRef"/>
        <EditQuestion @edit-mode-changed="forwardEditModeChange"/>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import EditPassage from './EditPassage.vue';
import EditQuestion from './EditQuestion.vue';

// EditPassage 컴포넌트 참조
const editPassageRef = ref(null);

// 텍스트 길이 검증 메서드 추가
const validatePassageLength = () => {
  if (editPassageRef.value) {
    return editPassageRef.value.validateTextLength();
  }
  return false;
};

// EditQuestion 이벤트 전달
const forwardEditModeChange = (value) => {
  emit('edit-mode-changed', value);
};

// 외부에서 접근할 메서드 노출
defineExpose({
  validatePassageLength
});

// 이벤트 정의
const emit = defineEmits(['edit-mode-changed']);
</script>
<style scoped>
.edit-passage-question {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 20px;

    position: absolute;
    width: 928px;
    height: 1120px;
    left: 292px;
    top: 176px;
}
</style>