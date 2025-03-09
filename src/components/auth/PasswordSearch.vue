<template>
    <div class="ps-page">
      <div class="logo-container">
        <h1 class="logo">Genie<span class="orange-q">Q</span></h1>
      </div>
      
      <div class="ps-container">
        <h2 class="ps-title">비밀번호 찾기</h2>
      
          <div class="form-group">
            <label class="input-label">이메일*</label>
            <div class="input-wrapper">
              <Icon icon="lucide:user-round" class="input-icon" />
              <input type="email" placeholder="이메일 주소를 입력해 주세요." class="form-input" />
            </div>
            <button class="button gray-button">인증메일 발송</button>
          </div> 
          
          <div class="form-group">
            <label class="input-label">인증코드 확인*</label>
            <div class="input-with-button">
              <input type="text" placeholder="인증코드를 입력하세요." class="form-input2" />
              <button class="button verify-button">인증</button>
            </div>
          </div>
        <Router-link to="/temppasswordnotice" class="button gray-button">완료</Router-link>
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
  .ps-page {
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
  
  .ps-container {
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
  
  .ps-title {
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

  .form-input2{
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 44px;
    border: 1px solid #BDBDBD;
    border-radius: 6px;
    padding: 10px;
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
  </style>
  