<template>
    <div class="login-container">
       <div class="login-header">
         <h2 class="title">문제 출제를 <span class="highlight">더 쉽고, 빠르고, 정확하게!</span></h2>
         <p class="subtitle">Genie<span class="highlight-orange">Q</span>와 함께 새로운 차원의 문제 생성을 경험하세요.</p>
     
       </div>
       <div class="login-box">
         
         <div class="login-form">
           <h3 class="form-title">로그인</h3>
           
           <div class="form-group">
             <div class="input-wrapper">
               <span class="input-icon">
                 <Icon icon="icon-park-outline:people" width="28" height="28"  style="color: #BDBDBD"/>
               </span>
               <input type="text" placeholder="이메일을 입력하세요." v-model="username" class="form-input">
             </div>
           </div>
           
           <div class="form-group">
             <div class="input-wrapper">
               <span class="input-icon">
                 <Icon icon="mdi:password-outline" width="32" height="32"  style="color: #BDBDBD"/>
               </span>
               <input type="password" placeholder="비밀번호를 입력해 주세요." v-model="password" class="form-input">
             </div>
           </div>
           
           <div class="login-options">
             <router-link to="/passwordsearch" class="find-account">비밀번호 찾기</router-link>
           </div>
           
           <button @click="login" class="login-button">로그인하기</button>
           
           <div class="signup-section">
             <span class="notion">GenieQ가 처음이신가요?</span>
             <router-link to="/singup" class="signup-link">계정 만들기</router-link>
           </div>
         </div>
       </div>
     </div>
   </template>
   
   <script setup>
   </script>
   
   <style scoped>
   .login-container {
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     min-height: 100vh;
     background: url("@/assets/images/login_bg.png") no-repeat;
     padding: 20px;
   }
   
   .login-box {
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     width: 435px;
     max-width: 480px;
     height: 412px;
     overflow: hidden;
     padding: 22px;
   }
   
   .login-header {
     text-align: center;
     margin-top: 246px;
     margin-bottom: 39px;
   }
   
   .title {
     font-size: 48px;
     font-weight: 700;
     color: #000000;
     margin-bottom: 12px;
   }
   
   .subtitle {
     font-size: 48px;
     color: #000000;
     margin-bottom: 20px;
   }
   
   .highlight {
     font-size: 48px;
     font-weight : 700;
     color: #ff9f40;
   }
   
   .highlight-orange {
     font-size: 48px;
     font-weight : 600;
     color: #ff9500;
   }
   
   .form-title {
     font-size: 24px;
     font-weight: 600;
     margin-bottom: 40px;
     text-align: center;
   }
   
   .form-group {
     margin-bottom: 16px;
   }
   
   .input-wrapper {
     position: relative;
     display: flex;
     align-items: center;
     border: 1px solid #e0e0e0;
     border-radius: 6px;
     overflow: hidden;
   }
   
   .input-icon {
     display: flex;
     align-items: center;
     justify-content: center;
     width: 48px;
     height: 48px;
   }
   
   .form-input {
     flex: 1;
     padding: 14px 16px;
     border: none;
     font-size: 14px;
     outline: none;
   }
   
   .login-options {
     display: flex;
     justify-content: flex-end;
     margin-bottom: 20px;
   }
   
   .find-account {
     font-size: 13px;
     color: #757575;
     text-decoration: none;
   }
   
   .find-account:hover {
     text-decoration: underline;
   }
   
   .login-button {
     display: flex;
     flex-direction: row;
     justify-content: center;
     align-items: center;
     padding: 8px;
     gap: 8px;
 
     width: 391px;
     height: 40px;
     padding: 14px;
     background-color: #ff9f40;
     color: white;
     border: none;
     border-radius: 8px;
     font-size: 16px;
     font-weight: 600;
     cursor: pointer;
     transition: background-color 0.2s;
   }
 
   .login-button:hover {
     background-color: #EC933B;
   }
   
   .signup-section {
     display: flex;
     justify-content: end;
     align-items: center;
     margin-top: 20px;
     gap: 8px;
   }
   
   .notion {
     font-size: 13px;
     color: #757575;
   }
 
   .notion:hover {
     text-decoration: underline;
   }
   
   .signup-link {
     font-size:13px;
     color: #ff9f40;
     font-weight: 400;
     text-decoration: none;
     margin-left: 20px;
   }
 
   .signup-link:hover {
     text-decoration: underline;
   }
   </style>