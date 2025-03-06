<template>
    <div class="faq-container">
      <h2 class="faq-title">자주 묻는 질문</h2>
      <div class="faq-list">
        <div
          v-for="(item, index) in faqList"
          :key="index"
          class="faq-item"
        >
          <div class="faq-question" @click="toggleFAQ(index)">
            <span class="faq-q">Q.</span>
            <span :class="{ 'active-question': activeIndex === index }">
              {{ item.question }}
            </span>
            <span class="faq-toggle-icon">{{ activeIndex === index ? '▲' : '▼' }}</span>
          </div>
          <div v-if="activeIndex === index" class="faq-answer">
            <span class="faq-a">A.</span>
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const activeIndex = ref(null);

const faqList = ref([
{ question: "환불 정책이 어떻게 되나요?", answer: "환불 정책은 이러이러한 내용이 있습니다. ..." },
{ question: "결제를 취소하고 싶어요", answer: "결제 취소는 마이페이지에서 가능합니다." },
{ question: "문항 생성 시 사용자 입력에는 어떤 것을 써야 하나요?", answer: "사용자는 문항에 대한 설명을 입력해야 합니다." },
{ question: "문항 생성 시 입력해야 하는 정보가 있나요?", answer: "네, 필수 정보는 문항 유형과 세부 설명입니다." }
]);

const toggleFAQ = (index) => {
activeIndex.value = activeIndex.value === index ? null : index;
};
</script>

<style scoped>

</style>