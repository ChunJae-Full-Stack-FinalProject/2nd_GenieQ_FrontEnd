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
import { onMounted, onUnmounted } from 'vue';

// 기존 body 스타일을 저장할 변수
let originalMinWidth;

// 컴포넌트 마운트 시 body에 minWidth 적용
onMounted(() => {
  // 기존 스타일 저장
  originalMinWidth = document.body.style.minWidth;
  
  // Frame에 필요한 스타일 적용
  document.body.style.minWidth = '1920px';
  
  console.log('[Frame] body 스타일 적용: min-width=1920px');
});

// 컴포넌트 언마운트 시 body 스타일 복원
onUnmounted(() => {
  // 기존 스타일로 복원
  document.body.style.minWidth = originalMinWidth;
  
  console.log('[Frame] body 스타일 복원');
});
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
