<template>
    <div class="faq-container">
      <h2 class="faq-title">자주 묻는 질문</h2>
      <div class="faq-list">
        <div v-for="(item, index) in faqList" :key="index" class="faq-item">
          <div class="faq-question" @click="toggleFAQ(index)">
            <div class="faq-q">Q.</div>
            <div class="q-text">{{ item.question }}</div>
            <div class="faq-toggle-icon" :class="{ 'active': item.isOpen }">
              <span v-if="item.isOpen">
                <Icon icon="ep:arrow-up-bold" width="12px" style="color: #303030" />
              </span>
              <span v-else>
                <Icon icon="ep:arrow-down-bold" width="12px" style="color: #303030" />
              </span>
            </div>
          </div>
          <div class="faq-answer" :class="{ 'active': item.isOpen }">
            <div class="faq-a">A.</div>
            <div class="a-text">{{ item.answer }}</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const faqList = ref([
  { question: "환불 정책이 어떻게 되나요?", answer: "환불 정책은 이러이러한 내용이 있습니다. ...", isOpen: false },
  { question: "결제를 취소하고 싶어요", answer: "결제 취소는 마이페이지에서 가능합니다.", isOpen:false },
  { question: "문항 생성 시 사용자 입력에는 어떤 것을 써야 하나요?", answer: "사용자는 문항에 대한 설명을 입력해야 합니다.", isOpen:false },
  { question: "문항 생성 시 입력해야 하는 정보가 있나요?", answer: "네, 필수 정보는 문항 유형과 세부 설명입니다.", isOpen:false }
]);

const toggleFAQ = (index) => {
  faqList.value[index].isOpen = !faqList.value[index].isOpen;
};
</script>

<style scoped>
.faq-container {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 1764px;
}
.faq-title {
  position: absolute;
  width: 133px;
  height: 36px;
  left: 150px;
  top: 30px;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 150%;

  letter-spacing: -0.02em;
  color: #000000;
}
.faq-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;

  position: absolute;
  width: 1472px;
  left: 136px;
  top: 94px;

  box-sizing: border-box;

  background: #FFFFFF;
  border: 1px solid #BDBDBD;
  border-radius: 12px;

  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
}
.faq-item {
  align-items: center;
  padding: 0px 36px;
  width: 1472px;
  transition: height 0.3s ease; /* 높이 변화에 애니메이션 적용 */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  border-bottom: 1px solid #E1E1E1;
}
.faq-question {
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 120px;

  width: 1472px;
  height: 73px;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: -0.02em;
  color: #424242;
}
.faq-q {
  padding: 8px;
  width: 40px;
  height: 40px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: #424242;
}
.q-text {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 8px;

  width: 1080px;
  height: 40px;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;

  letter-spacing: -0.02em;
  color: #424242;
}

.faq-toggle-icon {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 8px;
  gap: 8px;

  width: 40px;
}
.faq-answer {
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  align-items: flex-start; /* 상단 정렬로 변경 */
  gap: 120px;

  width: 1472px;
  height: 73px;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: -0.02em;
  color: #424242;

  width: 1080px;
  max-height: 0; /* 초기에는 보이지 않음 */
  opacity: 0; /* 초기에는 투명 */
}
.faq-answer.active {
  width: 1080px;
  max-height: 100vh;
  opacity: 1;
}
.faq-a {
  padding: 8px;
  width: 40px;
  height: 40px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: #424242;
}
.a-text {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 8px;

  width: 1080px;
  height: 40px;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;

  letter-spacing: -0.02em;
  color: #424242;
}
</style>