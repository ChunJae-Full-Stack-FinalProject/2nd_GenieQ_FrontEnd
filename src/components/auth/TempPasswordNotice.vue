<template>
    <div class="temp-page">
      <div class="logo-container">
        <h1 class="logo">Genie<span class="orange-q">Q</span></h1>
      </div>
      
      <div class="temp-container">
        <h2 class="temp-title">임시 비밀번호 안내</h2>
      
          <div class="form-group">
            <label class="input-label">임시 비밀번호가 입력해 주신 이메일로 전송되었습니다. <br> 보안을 위해 비밀번호를 변경하세요.*</label>
          </div>

          <div class="email-display-container">
            <div class="email-label">이메일 주소</div>
            <div class="email-value">{{ userEmail }}</div>
          </div>
      
      
          <router-link to="/login" custom v-slot="{ navigate }">
            <button class="button gray-button" @click="navigate">로그인하기</button>
          </router-link>
          
      </div> 
    </div>
   
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const userEmail = ref('');

  // 컴포넌트가 마운트 될 때 이메일 값을 가져옴
  onMounted(() => {
    if (route.query.email) {
      userEmail.value = route.query.email;
    }
  });
  </script>
  
  <style scoped>
  * {
    box-sizing: border-box;
  }
  
  .temp-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    padding: 20px;
  }
  
  .logo-container {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .logo {
    font-size: 32px;
    font-weight: 700;
    color: #303030;
    margin: 0;
  }
  
  .orange-q {
    font-size: 32px;
    font-weight: 700;
    color: #FF9500;
  }
  
  .temp-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 435px;
    padding: 22px;
    gap: 24px;
    background: #FFFFFF;
    border: 1px solid #E1E1E1;
    border-radius: 12px;
  }
  
  .temp-title {
    width: 100%;
    font-size: 24px;
    font-weight: 700;
    line-height: 150%;
    text-align: center;
    letter-spacing: -0.02em;
    color: #303030;
    margin: 0 0 10px 0;
  }
  
  .form-group {
    width: 100%;
    margin-bottom: 16px;
  }

  .button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px;
    gap: 8px;
    height: 40px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    line-height: 150%;
    letter-spacing: -0.02em;
    cursor: pointer;
  }
  
  .gray-button {
    width: 100%;
    background: #FF9F40;
    color: #FFFFFF;
  }
  
  .email-display-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  width: 380.22px; 
  height: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 20px auto;
}

.email-label {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #333;
  color: white;
  height: 100%;
  width: 20%;
  font-size: 12px;
  white-space: nowrap;
}

.email-value {
  display: flex;
  align-items: center;
  padding: 0 8px;
  flex-grow: 1;
  height: 100%;
  background-color: white;
  font-size: 12px;
  color: #333;
}
  </style>
  