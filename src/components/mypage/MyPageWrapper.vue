<template>
  <div class="mypage-header">
    <h2 class="page-title">마이페이지</h2>
    <div class="tab-menu">
      <span 
        v-for="tab in tabs" 
        :key="tab"
        @click="selectedTab = tab"
        :class="{'active-tab': selectedTab === tab}"
      >
        {{ tab }}
      </span>
    </div>
  </div>
  <MyPageContent :selectedTab="selectedTab"/>
</template>

<script setup>
import { ref ,onMounted} from "vue";
import MyPageContent from './MyPageContent.vue';
import { useRoute } from "vue-router";

const route = useRoute();

/* 탭 목록 */
const tabs = ["회원정보", "이용권", "공지사항", "자주 묻는 질문"];

// 현재 선택된 탭 (기본값 : 회원정보)
const selectedTab = ref('회원정보');

onMounted(()=> {
  console.log("컴포넌트가 마운트되었습니다 !");
  // 라우터 쿼리 파라미터가 있고, 유효한 탭 값인 경우에만 설정
  if (route.query.tab && tabs.includes(route.query.tab)) {
    selectedTab.value = route.query.tab;
  } else {
    // 쿼리 파라미터가 없거나 유효하지 않은 경우, 기본값 유지
    selectedTab.value = "회원정보";
  }
});
</script>

<style scoped>
/* 마이페이지 상단바 전체 스타일 */
.mypage-header {
  position: absolute;
  width: 100%;
  height: 182px;
  left: 156px;
  top: 0px;
  background: #FFFFFF;
}

/* "마이페이지" 제목 스타일 */
.page-title {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  gap: 8px;

  position: absolute;
  width: 120px;
  height: 48px;
  left: 28px;
  top: 34px;

  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;

  color: #000000;
}

/* 상단 탭 메뉴 */
.tab-menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 180px; 
  gap: 40px; 
  position: absolute;
  width: auto;
  height: 50px;
  top: 131px;
}

/* 기본 탭 스타일 */
.tab-menu span {
  width: auto;
  height: 30px;

  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 150%;

  letter-spacing: -0.02em;
  color: #303030;
}

/* 선택된 탭 스타일 (볼드 + 밑줄) */
.active-tab {
  font-weight: bold !important;
}

.active-tab {
  font-weight: bold !important;
  position: relative; /* 포지션 설정 */
}

/* active-tab에 아래 border 적용 */
.active-tab::after {
  content: "";
  position: absolute;
  bottom: -11px; /* 탭 메뉴의 bottom border와 일치하도록 조정 */
  left: -10%;
  width: 120%;
  height: 2px;
  background-color: #FF9F40;
}
</style>