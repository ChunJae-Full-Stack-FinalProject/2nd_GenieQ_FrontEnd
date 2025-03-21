<template>
    <BaseModal :isOpen="isOpen" width="1000px" height="700px" @close="closeModal">
    <div class="privacy-page">
        <div class="privacy-container">
            <h1>개인정보 처리방침</h1>
        <div class="privacy-box">
          <pre>{{ privacyText }}</pre> 
        </div>
      </div>
    </div>
      <div class="close-btn-container">
        <BaseButton class="close-btn" text="닫기" type="type3" width="90.42px" height="34.5px" @click="closeModal" />
      </div>
    </BaseModal>
</template> 
<script setup>
import { ref, onMounted } from "vue";
import BaseModal from "../../BaseModal.vue";
import BaseButton from "@/components/common/button/BaseButton.vue";

//is open props 정의 = warn주의 문구 해결.
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const privacyText = ref("");
const files = import.meta.glob("@/assets/policy/*.txt", { as: "raw" });

onMounted(async () => {
  try {
    const file = await files["/src/assets/policy/privacy.txt"](); 
    privacyText.value = file;
  } catch (error) {

    privacyText.value = "개인정보 처리방침을 불러오는 중 오류가 발생했습니다.";
  }
});
const emit = defineEmits(['close']);
const closeModal = () => {
  emit("close");
};
</script>
<style>
pre{
  text-align: left;
  white-space: pre-wrap; /* 자동 줄바꿈 적용 */
  word-wrap: break-word; /* 긴 단어도 줄바꿈 */
  width: 100%; /* 컨테이너 너비에 맞춤 */
  overflow-x: hidden; /* 가로 스크롤 제거 */
  margin: 0; /* 기본 마진 제거 */
}

/* 전체 스크롤 문제 해결 */
html, body {
  overflow-x: hidden; /* 가로 스크롤 제거 */
  margin: 0;
  padding: 0;
}

/* 배경색 적용 및 높이 자동 조정 */
.privacy-page {
  display: flex;
  flex-direction: column;
  align-items: centesr;
  width: 100%;
  padding-bottom: 50px;
}

/* 이용약관 컨텐츠 중앙 배치 */
.privacy-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  max-width: 950.67px;
}

/* 스크롤을 `terms-box` 내부에서만 적용 */
.privacy-box {
  width: 100%;
  height: 550px;
  background-color: #FFFFFF;
  border-radius: 7.75px;
  border: 0.65px solid #FF9F40;
  padding: 10.33px 15.5px;
  overflow-y: auto; /* 내부에서만 스크롤 가능 */
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.5;
  margin-top: 40px;
}

.privacy-container h1 {
  width: 100%;
  text-align: left; /* 왼쪽 정렬 */
  padding-left: 15px; /* 왼쪽 여백 추가 */

  position: absolute;
  top: 10px;
  left: 20px;
}

.close-btn-container {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  margin-top: 10px; /* 위쪽 여백 추가 */

  position: absolute;
  top: 620px;
  right: 20px;
}

.close-btn {
  font-size: 12.92px;
  font-weight: 700;
}

h1 {
  font-size: 15.5px;
  font-weight: 700;
  margin-bottom: 15px;
  margin-top: 20px;
}
</style>