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
  width: 930px;
  height: 1160px;
  left: 292px;
  top: 170px;
}
#passage-head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 12px;

  width: 610px;
  height: 30px;

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