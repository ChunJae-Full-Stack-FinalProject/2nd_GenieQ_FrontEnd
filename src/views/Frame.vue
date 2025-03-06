<template>
<div class="frame">
    <Sidebar/>
    <router-view />
    <GenieQFooter/>
</div>
</template>

<script setup>
import Sidebar from '@/components/common/Sidebar.vue';
import GenieQFooter from '@/components/common/Footer.vue';
</script>

<style>
.frame {
  display: flex;
  min-height: 100vh;
  background-color: #F6F6F6;
  display: flex;
  min-height: 100vh; /* ✅ 전체 높이를 최소 100vh로 유지 */
  overflow: hidden; /* ✅ 내부 스크롤 방지 */
  
}
.main-content {
  min-height: 100vh; /* ✅ 전체 높이 유지 */
  justify-content: space-between;
  width: calc(100% - 156px); /* 사이드바 제외한 너비 */
}
</style>
