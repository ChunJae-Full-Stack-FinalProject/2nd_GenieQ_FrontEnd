<template>
    <div class="shortcut-container">
      <!-- GenieQ 바로가기 아이콘 -->
      <div class="shortcut-icon" @click="toggleTooltip">
        <img src="/src/assets/images/genieq_logo.png" alt="GenieQ 바로가기" class="logo-image">
      </div>
      
      <!-- 안내 말풍선 -->
      <div class="shortcut-tooltip" v-if="showTooltip">
        <div class="tooltip-content">
          <h3 class="tooltip-title">GenieQ 바로가기</h3>
          <p class="tooltip-text">GenieQ 서비스를 이용하시려면 직접 회원가입을 하시거나 개발자에게 문의하세요.</p>
          <div class="tooltip-buttons">
            <a href="http://43.202.6.90" target="_blank" class="tooltip-button primary">GenieQ 방문하기</a>
            <a href="mailto:kwanghoon041@gmail.com" class="tooltip-button secondary">개발자 문의</a>
          </div>
          <button class="tooltip-close" @click="toggleTooltip">
            <span>&times;</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const showTooltip = ref(false);
  
  const toggleTooltip = () => {
    showTooltip.value = !showTooltip.value;
  };
  </script>
  
  <style scoped>
  .shortcut-container {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 1000;
  }
  
  .shortcut-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    border: 2px solid #FFEDDC;
  }
  
  .shortcut-icon:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
    border-color: #FF9F40;
  }
  
  .logo-image {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
  
  .shortcut-tooltip {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 400px;
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .tooltip-content {
    background-color: #FFFFFF;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    position: relative;
    border: 1px solid #EEEEEE;
  }
  
  .tooltip-content::after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: 30px;
    width: 20px;
    height: 20px;
    background-color: #FFFFFF;
    transform: rotate(45deg);
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.07);
    border-right: 1px solid #EEEEEE;
    border-bottom: 1px solid #EEEEEE;
    z-index: -1;
  }
  
  .tooltip-title {
    font-size: 18px;
    font-weight: 600;
    color: #303030;
    margin: 0 0 10px 0;
  }
  
  .tooltip-text {
    font-size: 14px;
    color: #757575;
    line-height: 1.5;
    margin-bottom: 15px;
  }
  
  .tooltip-buttons {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }
  
  .tooltip-button {
    padding: 8px 16px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    text-align: center;
    flex: 1;
    transition: all 0.3s ease;
  }
  
  .tooltip-button.primary {
    background-color: #FF9F40;
    color: white;
  }
  
  .tooltip-button.primary:hover {
    background-color: #E08730;
  }
  
  .tooltip-button.secondary {
    background-color: #FFEDDC;
    color: #FF9F40;
  }
  
  .tooltip-button.secondary:hover {
    background-color: #FFE0C0;
  }
  
  .tooltip-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    color: #757575;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .tooltip-close:hover {
    background-color: #F6F6F6;
    color: #303030;
  }
  
  /* 모바일 반응형 스타일 */
  @media (max-width: 768px) {
    .shortcut-icon {
      width: 50px;
      height: 50px;
    }
    
    .logo-image {
      width: 32px;
      height: 32px;
    }
    
    .shortcut-tooltip {
      width: 350px;
    }
  }
  </style>