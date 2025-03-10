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
            <div class="input-wrapper" :class="{ 'error': emailError }">
            <span class="input-icon">
              <Icon icon="icon-park-outline:people" width="28" height="28" style="color: #BDBDBD"/>
            </span>
            <input type="text" placeholder="이메일을 입력하세요." v-model="email" class="form-input"@input="validateEmail">
          </div>
            <div v-if="emailError" class="error-message">{{ emailError }}</div>
          </div>
           
           <div class="form-group">
          <div class="input-wrapper" :class="{ 'error': passwordError }">
            <span class="input-icon">
              <Icon icon="mdi:password-outline" width="32" height="32" style="color: #BDBDBD"/>
            </span>
            <input 
              type="password" 
              placeholder="비밀번호를 입력해 주세요." 
              v-model="password" 
              class="form-input"
              @input="validatePassword"
            >
          </div>
          <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
        </div>
           
           <div class="login-options">
             <router-link to="/passwordsearch" class="find-account">비밀번호 찾기</router-link>
           </div>
           
           <button @click="login" class="login-button" :disabled="emailError || passwordError || !email || !password">
            로그인하기
           </button>
           
           <div class="signup-section">
             <span class="notion">GenieQ가 처음이신가요?</span>
             <router-link to="/singup" class="signup-link">계정 만들기</router-link>
           </div>
         </div>
       </div>
     </div>
   </template>
   
<script setup>
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue'; // 또는 사용 중인 아이콘 라이브러리에 맞게 수정
// 상태 관리
const email = ref('');
const password = ref('');
const emailError = ref('');
const passwordError = ref('');

// 이메일 유효성 검사
const validateEmail = () => {
  if (!email.value) {
    emailError.value = '이메일 형식으로 입력해 주세요';
    return;
  }
  
  // @을 기준으로 한 구간이 알파벳 or 숫자 or 특수문자 조합으로 이루어져 있는지 체크
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = '이메일 형식으로 입력해 주세요';
  } else {
    emailError.value = '';
  }
};

// 비밀번호 유효성 검사
const validatePassword = () => {
  if (!password.value) {
    passwordError.value = '이메일 또는 비밀번호가 일치하지 않습니다.';
    return;
  }
  
  // 임의의 비밀번호 검증 로직 (실제로는 서버 응답에 따라 처리)
  if (password.value.length < 6) {
    passwordError.value = '이메일 또는 비밀번호가 일치하지 않습니다.';
  } else {
    passwordError.value = '';
  }
};

// 로그인 기능
const login = () => {
  // 유효성 검사 다시 확인
  validateEmail();
  validatePassword();
  
  // 오류가 없으면 로그인 시도
  if (!emailError.value && !passwordError.value && email.value && password.value) {
    // 여기에 실제 로그인 API 호출 로직 추가
    console.log('로그인 시도:', { email: email.value, password: password.value });
  }
};

// 입력값 변경 시 유효성 검사
watch(email, validateEmail);
watch(password, validatePassword);
</script>
   
<style scoped>
   .login-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: url("@/assets/images/login_bg.png") no-repeat;
      background-position: center;
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

   /* 오류 스타일 추가 */
.input-wrapper.error {
  border-color: #ff0000;
}

.error-message {
  color: #ff0000;
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
  padding-left: 5px;
}

/* 비활성화된 버튼 스타일 */
.login-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* 입력 폼 너비 조정 */
.input-wrapper {
  width: 100%;
}
   </style>