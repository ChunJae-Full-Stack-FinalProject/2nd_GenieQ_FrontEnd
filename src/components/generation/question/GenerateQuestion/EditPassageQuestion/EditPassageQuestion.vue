<template>
    <div class="edit-passage-question">
        <EditPassage ref="editPassageRef"/>
        <EditQuestion @edit-mode-changed="forwardEditModeChange"/>
    </div>
</template>
<script setup>
// EditPassageQuestion.vue 수정 코드
import { ref, inject, onMounted, watch } from 'vue';
import EditPassage from './EditPassage.vue';
import EditQuestion from './EditQuestion.vue';

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

// 부모로부터 지문 데이터 주입
const { passage, updatePassage } = inject('passageData', { 
  passage: ref(null), 
  updatePassage: () => {} 
});

// EditPassage 컴포넌트 참조
const editPassageRef = ref(null);

// 마운트 시 초기 설정
onMounted(() => {
  console.log('EditPassageQuestion - 마운트 시 지문 데이터:', passage.value);
  if (passage.value && passage.value.content && editPassageRef.value) {
    console.log('EditPassage에 지문 설정:', passage.value.content);
    editPassageRef.value.setContent(passage.value.content);
  }
});

// passage 변경 감지
watch(() => passage.value, (newValue) => {
  console.log('EditPassageQuestion - 지문 데이터 변경 감지:', newValue);
  if (newValue && newValue.content && editPassageRef.value) {
    console.log('EditPassage에 변경된 지문 설정:', newValue.content);
    editPassageRef.value.setContent(newValue.content);
  }
}, { deep: true });

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