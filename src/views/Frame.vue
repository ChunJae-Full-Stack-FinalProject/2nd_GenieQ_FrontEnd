<template>
<div class="frame">
    <Sidebar/>
    <div class="main-content">
      <router-view />
    </div>
    <GenieQFooter/>
</div>
</template>

<script setup>
import Sidebar from '@/components/common/Sidebar.vue';
import GenieQFooter from '@/components/common/Footer.vue';
</script>

<style scoped>

.side-bar{
  width: 156px;
}
.frame {
  display: flex;
  min-height: 100vh;
  background-color: #F6F6F6;
  display: flex;
  min-height: 100vh; /* ✅ 전체 높이를 최소 100vh로 유지 */
  overflow: hidden; /* ✅ 내부 스크롤 방지 */
}
.main-content {
  margin-left: 156px; /* ✅ 사이드바 공간 확보 */
  min-height: 100vh; /* ✅ 전체 높이 유지 */
  justify-content: space-between;
  overflow: hidden; /* ✅ 내부 컨텐츠가 넘쳐도 스크롤 방지 */
}
</style>
