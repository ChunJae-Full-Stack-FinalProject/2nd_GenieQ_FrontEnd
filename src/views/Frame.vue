<template>
  <div class="frame">
    <Sidebar/>
    <div class="main-content">
      <div class="content-area">
        <router-view />
      </div>
    </div>
    <GenieQFooter id="footer"/>
  </div>
</template>

<script setup>
import Sidebar from '@/components/common/Sidebar.vue';
import GenieQFooter from '@/components/common/Footer.vue';
</script>

<style>
.frame {
  background-color: #F6F6F6;
  display: flex;
  overflow-x: auto;
  min-width: 1200px;
  /* min-height: 100vh; */
}

.main-content {
  min-height: 973px;
  width: calc(100% - 156px);
  margin-left: 156px;
  display: flex;
  flex-direction: column;
  background-color: #F6F6F6;
  flex: 1;
}

.content-area {
  flex: 1;
  background-color: #F6F6F6;
}

#footer {
  position: fixed;
  bottom: 0;
  width: calc(100% - 156px); /* 사이드바 제외한 너비 */
  margin-left: 156px;
}
</style>
