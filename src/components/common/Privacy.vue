<template>
    <div class="privacy-page">
      <div class="privacy-container">
        <h1>개인정보 처리방침</h1>
        <div class="privacy-box">
          <pre>{{ privacyText }}</pre> 
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const privacyText = ref("");
const files = import.meta.glob("@/assets/policy/*.txt", { as: "raw" });

onMounted(async () => {
  try {
    const file = await files["/src/assets/policy/privacy.txt"](); 
    privacyText.value = file;
  } catch (error) {
    console.error("개인정보 처리방침을 불러오는 중 오류 발생:", error);
    privacyText.value = "개인정보 처리방침을 불러오는 중 오류가 발생했습니다.";
  }
});
</script>

<style scoped>
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
  align-items: center;
  /* background-color: #F6F6F6; */
  width: 100%;
  min-height: 100vh; /* 푸터가 화면 하단에 고정되도록 설정 */
  padding-bottom: 50px;
}

/* 개인정보 처리방침 컨텐츠 중앙 배치 */
.privacy-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
  max-width: 950.67px;
  padding: 50px 0;
}

/* 스크롤을 `privacy-box` 내부에서만 적용 */
.privacy-box {
  width: 100%;
  height: 552.19px;
  background-color: #FFFFFF;
  border-radius: 7.75px;
  border: 0.65px solid #FF9F40;
  padding: 10.33px 15.5px;
  overflow-y: auto; /* 내부에서만 스크롤 가능 */
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.5;
}

/* 제목 왼쪽 정렬 */
.privacy-container h1 {
  width: 100%;
  text-align: left;
  padding-left: 15px;
}

</style>