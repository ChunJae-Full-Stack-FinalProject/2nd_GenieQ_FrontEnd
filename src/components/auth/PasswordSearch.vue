<template>
    <div class="ps-page">
      <div class="logo-container">
        <h1 class="logo">Genie<span class="orange-q">Q</span></h1>
      </div>
      
      <div class="ps-container">
        <h2 class="ps-title">비밀번호 찾기</h2>
      
          <div class="form-group">
            <label class="input-label">이메일*</label>
              <div class="input-wrapper" :class="{ 'error': emailError }">
                <Icon icon="lucide:user-round" class="input-icon" />
                <input type="text" placeholder="이메일을 입력하세요." v-model="email" class="form-input" @input="validateEmail">
              </div>
            <div v-if="emailError" class="error-message">{{ emailError }}</div>
            <button class="button email-button" style="margin-top: 10px; margin-bottom: 10px;" @click="sendVerificationEmail" :disabled="!isEmailValid || isEmailSent" :style="buttonStyle">{{ buttonText }}</button>
          
          <div class="form-group">
            <label class="input-label">인증코드 확인*</label>
            <div class="input-with-button">
              <div class="input-wrapper-with-timer" :class="{ 'success': isVerified }">
                <input type="text" placeholder="인증코드를 입력하세요." class="form-input2" v-model="verificationCode" :disabled="!isEmailSent || isVerified || !isTimerRunning" />
                <span v-if="isTimerRunning" class="timer">{{ formattedTime }}</span>
              </div>
              <button class="button verify-button" :class="{ 'active': verificationCode && !isVerified }" :disabled="!verificationCode || isVerified || !isTimerRunning" @click="verifyCode">
                {{ isVerified ? '완료' : '인증' }}
              </button>
            </div>
            <div v-if="verificationError" class="error-message">{{ verificationError }}</div>
            <div v-if="isVerified" class="success-message">인증이 완료되었습니다!</div>
          </div>
        <Router-link to="/temppasswordnotice" class="button gray-button">완료</Router-link>
      </div> 
    </div>
  </div>
  </template>
  
  <script setup>
  import { Icon } from "@iconify/vue";
  import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
  import emailjs from '@emailjs/browser';
  const email = ref('');
  const emailError = ref('');

  // 이메일 인증 관련 변수
  const isEmailSent = ref(false);
  const verificationCode = ref('');
  const verificationError = ref('');
  const isVerified = ref(false);
  const generatedCode = ref('');
  const isSending = ref(false); // 이메일 전송 중 상태



  // 타이머 관련 상태
  const isTimerRunning = ref(false);
  const remainingTime = ref(180); // 3분(180초)
  const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60);
  const seconds = remainingTime.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

let timerInterval = null; // 이 선언이 누락됨


  // EmailJS 초기화
onMounted(() => {
  // EmailJS 대시보드에서 확인한 Public Key
  emailjs.init("qaJXuBtmCey6I1KaF");
});

// 컴포넌트 언마운트시 타이머 정리
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

// 계산된 속성들
const isEmailValid = computed(() => { 
  return email.value && !emailError.value; 
});

const buttonText = computed(() => { 
  if (isSending.value) return '전송 중...';
  return isEmailSent.value ? '인증메일이 발송되었습니다.' : '인증메일 발송'; 
});

const buttonStyle = computed(() => {
  if (isSending.value || !isEmailValid.value || isEmailSent.value) { 
    return { backgroundColor: '#BDBDBD', color: '#FFFFFF' }; 
  } else { 
    return { backgroundColor: '#303030', color: '#FFFFFF' }; 
  }
});

const isPasswordMatch = computed(() => {
  return password.value && 
         confirmPassword.value && 
         password.value === confirmPassword.value && 
         !passwordError.value;
});

const isButtonEnabled = computed(() => {
  // 이메일, 비밀번호, 이름이 유효하고
  const isEmailValid = email.value && !emailError.value && isVerified.value; // 이메일 인증 확인 추가
  // 모든 조건을 만족해야 true 반환
  return isEmailValid ;
});

// 이메일 발송 함수
const sendVerificationEmail = () => {
  validateEmail();
  if (isEmailValid.value && !isSending.value) {
    generatedCode.value = generateVerificationCode();
    
    // 로딩 상태 표시
    isSending.value = true;
    
    // EmailJS로 이메일 전송 - 수신자 이메일 명확하게 지정
    const templateParams = {
      to_name: email.value.split('@')[0],
      from_name: "GenieQ",
      message: `인증 코드: ${generatedCode.value}`, // 기존 메시지 유지
      verification_code: generatedCode.value,      // 명시적으로 추가
      to_email: email.value,
      reply_to: "no-reply@genieq.com"
    };
    
    console.log("전송 파라미터:", templateParams); // 디버깅용
    
    emailjs.send(
      'service_gamja',   // 서비스 ID
      'template_zcvkxgp',  // 템플릿 ID
      templateParams
    )
    .then(() => {
      console.log('이메일 발송 성공!', generatedCode.value);
      console.log('수신자:', email.value);
      isEmailSent.value = true;
      isSending.value = false;
      startTimer(); // 타이머 시작
    })
    .catch((error) => {
      console.error('이메일 발송 실패:', error);
      emailError.value = '인증 메일 발송에 실패했습니다. 다시 시도해주세요.';
      isSending.value = false;
    });
  }
};
// 테스트용 인증코드 생성 함수
const generateVerificationCode = () => { 
  return Math.floor(100000 + Math.random() * 900000).toString(); 
};

// 인증코드 검증 함수
const verifyCode = () => {
  if (verificationCode.value === generatedCode.value) {
    isVerified.value = true;
    verificationError.value = '';
  } else {
    verificationError.value = '인증코드가 일치하지 않습니다.';
  }
};

// 타이머 시작 함수
const startTimer = () => {
  isTimerRunning.value = true;
  remainingTime.value = 180; // 3분으로 초기화
  
  // 기존 타이머가 있으면 정리
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  // 타이머 시작
  timerInterval = setInterval(() => {
    remainingTime.value--;
    
    // 시간이 다 되면 타이머 중지
    if (remainingTime.value <= 0) {
      clearInterval(timerInterval);
      isTimerRunning.value = false;
      isEmailSent.value = false; // 인증 시간 만료
      generatedCode.value = ''; // 코드 초기화
      verificationError.value = '인증 시간이 만료되었습니다. 다시 요청해주세요.';
    }
  }, 1000);
};

// 인증코드 재발송 함수
const resendVerificationCode = () => {
  // 타이머가 실행 중이지 않을 때만 재발송 가능
  if (!isTimerRunning.value) {
    isEmailSent.value = false;
    verificationCode.value = '';
    verificationError.value = '';
    sendVerificationEmail();
  }
};

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

  watch(email, validateEmail);  
  // 인증코드 입력 감시
  watch(verificationCode, () => { 
  if (verificationError.value) { 
    verificationError.value = ''; 
  } 
});
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
  .error-message {
  color: #ff0000;
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
  padding-left: 5px;
  z-index: 21;
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


/* 인풋창 타이머 c디자인. */
.input-wrapper-with-timer {
  position: relative;
  width: 100%;
}

.timer {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #424242;
  font-size: 14px;
}

.form-input2 {
  padding-right: 60px; /* 타이머가 입력 필드 내용을 가리지 않도록 */
}
/* 성공 스타일 추가 - PasswordSearch.vue에 추가 필요 */
.success-message {
  color: #64CA17;
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
  padding-left: 5px;
}

.email-button { 
  width: 100%; 
  height: 40px; 
  border-radius: 8px; 
  font-size: 16px; 
  font-weight: 600; 
  transition: background-color 0.3s; 
}

/* 인증 버튼 스타일 - PasswordSearch.vue에서 완성 필요 */
.verify-button.active { 
  background-color: #303030 !important; 
  color: #FFFFFF !important; 
}

/* 인증 관련 입력창 스타일 - PasswordSearch.vue에서 완성 필요 */
.input-wrapper-with-timer.success { 
  border-color: #64CA17; 
}
/* 이메일 인증관련  */
.verify-button.active { background-color: #303030 !important; color: #FFFFFF !important; }
.email-button { width: 100%; height: 40px; border-radius: 8px; font-size: 16px; font-weight: 600; transition: background-color 0.3s; }
.input-wrapper-with-timer.success { border-color: #64CA17; }
.input-wrapper.success { border-color: #64CA17; border-width: 1px; }
  </style>
  