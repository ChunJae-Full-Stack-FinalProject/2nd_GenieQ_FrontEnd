<template>
    <div class="signup-page">
      <div class="logo-container">
        <h1 class="logo">Genie<span class="orange-q">Q</span></h1>
      </div>
      
      <div class="signup-container">
        <h2 class="signup-title">임시 비밀번호 안내</h2>
      
          <div class="form-group">
            <label class="input-label">임시 비밀번호가 입력해 주신 이메일로 전송되었습니다. <br> 보안을 위해 비밀번호를 변경하세요.*</label>
          </div>

          <div class="email-display-container">
            <div class="email-label">이메일 주소</div>
            <div class="email-value">songwinter@naver.com</div>
          </div>
      
        
        <button class="button gray-button">완료</button>
      </div> 
    </div>
   
  </template>
  
  <script setup>
  import { Icon } from "@iconify/vue";
  </script>
  
  <style scoped>
  * {
    box-sizing: border-box;
  }
  
  .signup-page {
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
  
  .signup-container {
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
  
  .signup-title {
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
  
  .input-label {
    display: block;
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    line-height: 150%;
    letter-spacing: -0.02em;
    color: #424242;
    margin-bottom: 8px;
  }
  
  .input-wrapper {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 44px;
    border: 1px solid #BDBDBD;
    border-radius: 6px;
    margin-bottom: 8px;
  }
  
  .input-icon {
    width: 24px;
    height: 24px;
    margin-left: 12px;
    color: #BDBDBD;
  }
  
  .eye-icon {
    width: 24px;
    height: 24px;
    margin-right: 12px;
    color: #BDBDBD;
    cursor: pointer;
  }
  
  .form-input {
    flex: 1;
    height: 100%;
    padding: 8px 12px;
    border: none;
    font-size: 16px;
    line-height: 28px;
    letter-spacing: -0.02em;
    color: #424242;
    background: transparent;
  }
  
  .form-input:focus {
    outline: none;
  }
  
  .input-with-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 16px;
    width: 100%;
    height: 44px;
  }
  
  .input-with-margin {
    width: 80%;
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
    background: #BDBDBD;
    color: #FFFFFF;
  }
  
  .verify-button {
    width: 73px;
    height: 44px;
    background: #BDBDBD;
    border-radius: 6px;
    color: #FFFFFF;
  }
  
  .password-hint {
    width: 100%;
    font-size: 13px;
    font-weight: 400;
    line-height: 150%;
    letter-spacing: -0.02em;
    color: #757575;
    margin: 4px 0 0 0;
  }
  
  .select-wrapper {
    position: relative;
    width: 100%;
    height: 44px;
  }
  
  .form-select {
    width: 100%;
    height: 100%;
    padding: 8px;
    border: 1px solid #BDBDBD;
    border-radius: 8px;
    background: #FFFFFF;
    font-size: 16px;
    line-height: 28px;
    letter-spacing: -0.02em;
    color: #303030;
    appearance: none;
  }
  .email-display-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  width: 252.52px; 
  height: 29.33px;
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
  