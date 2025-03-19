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
              <input type="text" placeholder="이메일을 입력하세요." v-model="email" class="form-input" @input="validateEmail">
            </div>
            <div v-if="emailError" class="error-message">{{ emailError }}</div>
          </div>
 
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">
                <Icon icon="mdi:password-outline" width="32" height="32" style="color: #BDBDBD"/>
              </span>
              <input type="password" placeholder="비밀번호를 입력해 주세요." v-model="password" class="form-input">
            </div>
            <div v-if="loginFailed" class="error-message">
              {{ loginFailed ? '이메일 또는 비밀번호가 일치하지 않습니다.' : ''}}
            </div>
          </div>

          <div class="login-options">
            <router-link to="/passwordsearch" class="find-account">비밀번호 찾기</router-link>
          </div>

          <button @click="loginHandler" class="login-button" :disabled="emailError || !email || !password">
          로그인하기
          </button>

          <div class="signup-section">
            <a class="notion" href="https://learned-science-af1.notion.site/1af66d6c49e280209a8af79ece08be6d">GenieQ가 처음이신가요?</a>
            <router-link to="/signup" class="signup-link">계정 만들기</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
   
<script setup>
import { ref, watch, onMounted } from 'vue';
import { Icon } from '@iconify/vue'; // 또는 사용 중인 아이콘 라이브러리에 맞게 수정
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Auth 스토어 가져오기
// 라우터와 스토어 초기화
const router = useRouter();
const authStore = useAuthStore();
// 상태 관리
const email = ref('');
const password = ref('');
const emailError = ref('');
const loginError = ref(''); // (추가) 로그인 오류 메시지
const isLoading = ref(false); // (추가) 로딩 상태
const loginFailed = ref(false);

// 컴포넌트 마운트 시 이미 로그인되어 있으면 홈으로 리디렉션
onMounted(() => {

  if (authStore.isLoggedIn) {

    router.push('/home');
  }
  // 테스트 계정 정보 알림 - 처음 방문 시에만 표시
  // if (!authStore.isLoggedIn) {
  //   alert('테스트 계정 정보:\n이메일: teacher@gmail.com\n비밀번호: 1234');
  // }
});

// 이메일 유효성 검사
const validateEmail = () => {
  // @을 기준으로 한 구간이 알파벳 or 숫자 or 특수문자 조합으로 이루어져 있는지 체크
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = '이메일 형식으로 입력해 주세요';
  } else {
    emailError.value = '';
  }
};

// 로그인 기능
const loginHandler = () => {
  // 유효성 검사 다시 확인
  validateEmail();
  
  // 오류가 있으면 로그인 중단
  if (emailError.value || !email.value || !password.value) return;


  // 로그인 진행
  loginError.value = ''; // 이전 오류 초기화
  isLoading.value = true;
  
  // console.log('로그인 핸들러: 로그인 시작'); // (추가) 로그: 로그인 시작
  
  const loginData = {
    memEmail: email.value,
    memPassword: password.value
  };
  
  const apiUrl = import.meta.env.VITE_API_URL;
  // fetch를 이용한 로그인 요청
  fetch(`${apiUrl}/api/auth/select/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // 쿠키를 포함시켜 세션 유지
    body: JSON.stringify(loginData)
  })
  .then(response => {

    if (!response.ok) {
      return response.text().then(text => { throw new Error(text || '로그인에 실패했습니다.'); });
    }
    return response.json();
  })
  .then(userData => {
    // console.log('로그인 성공:', userData); // (추가) 로그: 로그인 성공
    
    // 사용자 정보 상태 업데이트
    authStore.setUser(userData);

    // 로컬 스토리지에 사용자 상태 저장 (새로고침 시 상태 유지)
    localStorage.setItem('authUser', JSON.stringify(userData));
    
    // 홈으로 리디렉션
    // console.log('로그인 성공, 홈으로 리디렉션'); // (추가) 로그: 로그인 성공
    router.push('/home');
  })
  .catch(error => {
    // console.error('로그인 오류:', error); // (추가) 로그: 로그인 오류
    loginFailed.value = true; // 로그인 실패 상태 활성화
  })
  .finally(() => {
    isLoading.value = false;
  });
};

// 입력값 변경 시 유효성 검사
watch(email, validateEmail);
// watch(password, validatePassword);
</script>
   
<style scoped>
   .login-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
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
     font-weight: bold;
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
     font-weight: bold;
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
     margin-right: 45px;
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