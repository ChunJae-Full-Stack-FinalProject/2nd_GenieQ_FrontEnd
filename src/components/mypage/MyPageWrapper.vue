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
import { ref } from "vue";
import MyPageContent from './MyPageContent.vue';

/* 현재 선택된 탭 (기본값: 회원정보) */
const selectedTab = ref("회원정보");

/* 탭 목록 */
const tabs = ["회원정보", "이용권", "공지사항", "자주 묻는 질문"];
</script>

<style scoped>
/* 마이페이지 상단바 전체 스타일 */
.mypage-header {
  position: absolute;
  width: 1764px;
  height: 182px;
  left: 156px;
  top: 0px;
  background: #FFFFFF;
}

/* "마이페이지" 제목 스타일 */
.page-title {
  position: absolute;
  font-weight: 700;
  font-size: 24px;
  line-height: 150%;
  letter-spacing: -0.02em;
  color: #303030;
  left: 40px; /* 왼쪽 간격 유지 */
  top: 40px;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 15.5px;
  line-height: 150%;

  letter-spacing: -0.02em;

  color: #303030;
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
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 12.9167px;
  line-height: 150%;

  letter-spacing: -0.02em;

  color: #303030;

  flex: none;
  order: 0;
  flex-grow: 0;

}

/* 선택된 탭 스타일 (볼드 + 밑줄) */
.active-tab {
  border-bottom: 2px solid #FF9F40;
  font-weight: bold !important;
}
</style>