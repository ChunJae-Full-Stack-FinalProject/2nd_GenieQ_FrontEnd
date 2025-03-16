<template>
    <div>
        <input type="text" id="passage-title" placeholder="작업 이름을 입력해 주세요." v-model="title"/>
    </div>
</template>
<script setup>
import { ref, defineExpose, watch } from 'vue';

// 제목 데이터 ref로 관리
const title = ref('');

// 외부에서 접근할 수 있도록 함수 노출
const getTitle = () => {
    return title.value;
}

// InputPassageTitle.vue 수정
// 외부에서 제목을 설정할 수 있는 메서드 추가
const setTitle = (newTitle) => {
  // console.log('[32] InputPassageTitle: 제목 설정', newTitle);
  if (newTitle !== undefined) {
    title.value = newTitle || '';
  }
}
// (추가) 제목 변경 시 로그 출력
watch(title, (newValue) => {
  // console.log('[33] InputPassageTitle: 제목 변경됨', newValue);
});

// 외부에 노출할 메소드 정의 업데이트
defineExpose({
  getTitle,
  setTitle  // 추가
});

</script>
<style scoped>
#passage-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 15px;
    gap: 8px;

    position: absolute;
    width: 1472px;
    height: 46px;
    left: 292px;
    top: 118px;

    background: #FFFFFF;
    border-radius: 8px;
    border: none;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
}
</style>