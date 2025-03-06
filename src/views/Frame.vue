<template>
<div class="frame">
    <Sidebar/>
    <router-view/>
    <GenieQFooter/>
</div>
</template>

<script setup>
import Sidebar from '@/components/common/Sidebar.vue';
import GenieQFooter from '@/components/common/Footer.vue';
</script>

<style scoped>
/*가로 스크롤 완벽 제거 */
html, body {
  overflow-x: hidden;
  overflow-y: hidden; /* 세로 스크롤도 방지 */
  height: 100%;
  margin: 0;
  padding: 0;
}

/* 전체 컨테이너 */
.app-container {
  display: flex;
  min-height: 100vh; /* 전체 높이를 최소 100vh로 유지 */
  overflow: hidden; /* 내부 스크롤 방지 */
}

/* 사이드바를 제외한 컨텐츠 영역 */
.main-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  /* background-color: #F6F6F6; */
  margin-left: 156px; /* 사이드바 공간 확보 */
  min-height: 100vh; /*  전체 높이 유지 */
  justify-content: space-between;
  overflow: hidden; /* 내부 컨텐츠가 넘쳐도 스크롤 방지 */
}

/* 컨텐츠 영역 (푸터 위까지 채움) */
.content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto; /* 컨텐츠 내부에서만 스크롤 가능 */
}

/* 푸터를 최하단에 고정 */
footer {
  width: 100%;
  height: 50px; /* 푸터 높이 조정 */
  background: #fff;
  text-align: center;
  flex-shrink: 0; /* 푸터가 밀려 올라가지 않도록 설정 */
}
</style>
