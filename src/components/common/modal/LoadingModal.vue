<template>
    <div v-if="isOpen" class="loading-overlay">
      <div class="loading-content">
        <img :src="loadingImage" alt="Loading..." class="loading-icon" />
        <p style="white-space: pre-wrap;" class="loading-msg">{{ message }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import loadingImage from '@/assets/images/loading.gif';
  
  defineProps({
    isOpen: Boolean, // 모달 표시 여부 (true/false)
    message: String, // 표시할 메시지
  });
  </script>
  
  <style scoped>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .loading-icon {
    width: 80px;
    height: 80px;
  }
  
  .loading-msg {
    margin-top: 16px;
    color: #fff;
    font-size: 18px;
    text-align: center;
  }
  </style>
  