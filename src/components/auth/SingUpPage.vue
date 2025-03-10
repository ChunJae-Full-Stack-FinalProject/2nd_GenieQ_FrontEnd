<template>
    <div class="signup-page">
      <div class="logo-container">
        <h1 class="logo">Genie<span class="orange-q">Q</span></h1>
      </div>
      
      <div class="signup-container">
        <h2 class="signup-title">계정 만들기</h2>
        
        <div class="form-section">
          <h3 class="section-title">개인정보 입력</h3>
          
          <div class="form-group">
            <label class="input-label">이메일*</label>
            <div class="input-wrapper" :class="{ 'error': emailError }">
              <Icon icon="lucide:user-round" class="input-icon" />
              <input type="text" placeholder="이메일을 입력하세요." v-model="email" class="form-input" @input="validateEmail">
            </div>
            <div v-if="emailError" class="error-message">{{ emailError }}</div>
            <button class="button gray-button" style="margin-top: 10px;" @click="startTimer">인증메일 발송</button>
          </div> 
          
          <div class="form-group">
            <label class="input-label">인증코드 확인*</label>
            <div class="input-with-button">
              <div class="input-wrapper-with-timer">
                <input type="text" placeholder="인증코드를 입력하세요." class="form-input2" />
                <span v-if="isTimerRunning" class="timer">{{ formattedTime }}</span>
              </div>
              <button class="button verify-button">인증</button>
            </div>
          </div>
          
          <div class="form-group">
            <label class="input-label">비밀번호 입력*</label>
            <div class="input-wrapper" :class="{ 'error': passwordError, 'success': isPasswordMatch && confirmPassword && !passwordError }">
              <Icon icon="lucide:lock-keyhole" class="input-icon" />
              <input :type="showPassword ? 'text' : 'password'" placeholder="비밀번호를 입력해 주세요." v-model="password" class="form-input" @input="validatePassword" @blur="passwordTouched = true; validatePassword()" />
              <Icon :icon="showPassword ? 'ic:baseline-remove-red-eye' : 'ic:outline-remove-red-eye'" class="eye-icon" @click="toggleShowPassword"/>
            </div>
            <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
            <p class="password-hint">8자리 이상, 영문+숫자+특수문자(!@#$%^&*)조합</p>
          </div>
          
          <div class="form-group">
            <div class="input-wrapper" :class="{ 'error': confirmPasswordError, 'success': isPasswordMatch && confirmPassword && !passwordError }">
              <Icon icon="lucide:lock-keyhole" class="input-icon" />
              <input :type="showConfirmPassword ? 'text' : 'password'" placeholder="비밀번호를 한 번 더 입력해 주세요." v-model="confirmPassword" class="form-input" @input="validateConfirmPassword" @blur="confirmPasswordTouched = true; validateConfirmPassword()" />
              <Icon :icon="showConfirmPassword ? 'ic:baseline-remove-red-eye' : 'ic:outline-remove-red-eye'" class="eye-icon" @click="toggleShowConfirmPassword"/>
            </div>
            <div v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</div>
            <div v-else-if="isPasswordMatch && confirmPassword && !passwordError" class="success-message">비밀번호가 일치합니다!</div>
          </div>
        
        <div class="form-section">
          <h3 class="section-title">필수정보 입력</h3>
          
          <div class="form-group">
            <label class="input-label">이름*</label>
            <div class="input-wrapper" :class="{ 'error': nameError }">
              <input type="text" placeholder="이름을 입력해 주세요." class="form-input" v-model="username" @input="validateName" @blur="nameTouched = true; validateName()" />
            </div>
            <div v-if="nameError" class="error-message">{{ nameError }}</div>
          </div>
        </div>
        
        <div class="form-section">
          <h3 class="section-title">추가정보 입력</h3>
          
          <div class="form-group">
            <label class="input-label">성별</label>
            <div class="gender-buttons">
              <button 
                class="button gender-button" 
                :class="{ active: gender === 'male' }" 
                @click="selectGender('male')"
              >
                남성
              </button>
              <button 
                class="button gender-button" 
                :class="{ active: gender === 'female' }" 
                @click="selectGender('female')"
              >
                여성
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label class="input-label">소속</label>
            <div class="select-wrapper">
              <select class="form-select">
                <option selected>고등교사</option>
                <option selected>초등교사</option>
                <option selected>중등교사</option>
                <option selected>학원</option>
                <option selected>기업</option>
                <option selected>학부모</option>
                <option selected>학생</option>
                <option selected>기타</option>
                <option disabled selected>소속을 선택해 주세요.</option>
              </select>
              <span class="dropdown-arrow">▼</span>
            </div>
          </div>
        </div>
        
        <div class="checkbox-section">
          <div class="checkbox-container">
            <div class="checkbox-wrapper">
              <input type="checkbox" id="privacy" class="checkbox-input" v-model="privacyChecked" />
              <label for="privacy" class="custom-checkbox"></label>
              <span class="checkbox-label" @click="showPrivacyModal = true">개인정보 처리방침 동의</span>
            </div>
            <div class="checkbox-wrapper">
              <input type="checkbox" id="terms" class="checkbox-input" v-model="termsChecked" />
              <label for="terms" class="custom-checkbox"></label>
              <span class="checkbox-label" @click="showTermsModal = true">이용약관 동의</span>
            </div>
          </div>
        </div>
        <BaseButton class="gray-button" text="완료" :type="isButtonEnabled ? 'type1' : 'type3'" width="389px" height="40px" @click="submitForm" :disabled="!isButtonEnabled" />
      </div>
    </div>
</div>
    <!-- 개인정보 처리방침 모달 -->
    <PrivacyModal :isOpen="showPrivacyModal" @close="showPrivacyModal = false" />
    <!-- 이용 약관 모달 -->
    <TermsModal :isOpen="showTermsModal" @close="showTermsModal = false" />
  </template>
  
  <script setup>
  import { Icon } from "@iconify/vue";
  import { ref, watch, computed } from 'vue';
  import PrivacyModal from "@/components/common/modal/type/auth/PrivacyModal.vue";
  import TermsModal from "@/components/common/modal/type/auth/TermsModal.vue";
import BaseButton from "../common/button/BaseButton.vue";

  const showPrivacyModal = ref(false);
  const showTermsModal = ref(false);

  const email = ref('');
  const emailError = ref('');
  // 비밀번호 관련 상태
  const password = ref('');
  const confirmPassword = ref('');
  const passwordError = ref('');
  const confirmPasswordError = ref('');
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const passwordTouched = ref(false);
  const confirmPasswordTouched = ref(false);
  // 이름 관련 상태
  const username = ref('');
  const nameError = ref('');
  const nameTouched = ref(false);

// 타이머 관련 상태
const isTimerRunning = ref(false);
  const remainingTime = ref(180); // 3분(180초)
  const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60);
  const seconds = remainingTime.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

  const startTimer = () => {
    // 이메일 유효성 검사
    validateEmail();
    
    // 이메일이 유효하면 타이머 시작
    if (!emailError.value && email.value) {
      isTimerRunning.value = true;
      remainingTime.value = 180; // 3분으로 초기화
      
      // 타이머 시작
      const timer = setInterval(() => {
        remainingTime.value--;
        
        // 시간이 다 되면 타이머 중지
        if (remainingTime.value <= 0) {
          clearInterval(timer);
          isTimerRunning.value = false;
        }
      }, 1000);
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

  // 비밀번호 보이기/숨기기 토글
const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};



// 비밀번호 유효성 검사
const validatePassword = () => {
  // 입력값이 없고, 아직 사용자가 입력을 시작하지 않았다면 오류 표시하지 않음
  if (!password.value && !passwordTouched.value) {
    passwordError.value = '';
    return;
  }
  
  // 입력값이 없고, 사용자가 이미 입력을 시작했다면 오류 표시
  if (!password.value && passwordTouched.value) {
    passwordError.value = '비밀번호를 입력해 주세요.';
    return;
  }

  // 8자리 이상 검사
  if (password.value.length < 8) {
    passwordError.value = '비밀번호를 조건에 맞게 입력해 주세요.';
    return;
  }

  // 영문 포함 검사
  const hasLetter = /[a-zA-Z]/.test(password.value);
  // 숫자 포함 검사
  const hasNumber = /[0-9]/.test(password.value);
  // 특수문자 포함 검사
  const hasSpecial = /[!@#$%^&*]/.test(password.value);

  if (!hasLetter || !hasNumber || !hasSpecial) {
    passwordError.value = '비밀번호를 조건에 맞게 입력해 주세요.';
  } else {
    passwordError.value = '';
  }

  // 확인 비밀번호가 있을 경우 일치 여부 확인
  if (confirmPassword.value) {
    validateConfirmPassword();
  }
};

// 비밀번호 확인 유효성 검사
const validateConfirmPassword = () => {
  // 입력값이 없고, 아직 사용자가 입력을 시작하지 않았다면 오류 표시하지 않음
  if (!confirmPassword.value && !confirmPasswordTouched.value) {
    confirmPasswordError.value = '';
    return;
  }
  
  // 입력값이 없고, 사용자가 이미 입력을 시작했다면 오류 표시
  if (!confirmPassword.value && confirmPasswordTouched.value) {
    confirmPasswordError.value = '비밀번호를 확인해 주세요.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = '비밀번호를 확인해 주세요.';
  } else {
    confirmPasswordError.value = '';
  }
};

// 비밀번호 일치 여부를 확인하는 계산된 속성
const isPasswordMatch = computed(() => {
  return password.value && 
         confirmPassword.value && 
         password.value === confirmPassword.value && 
         !passwordError.value;
});

// 이름 유효성 검사
const validateName = () => {
  // 입력값이 없고, 아직 사용자가 입력을 시작하지 않았다면 오류 표시하지 않음
  if (!username.value && !nameTouched.value) {
    nameError.value = '';
    return;
  }
  
  // 입력값이 없고, 사용자가 이미 입력을 시작했다면 오류 표시
  if (!username.value && nameTouched.value) {
    nameError.value = '이름을 입력해 주세요.';
    return;
  }

  // 한글만 허용하는 정규식
  const koreanOnly = /^[가-힣]{2,8}$/;
  
  // 숫자, 특수문자, 공백 포함 검사
  const hasInvalidChar = /[\d\s!@#$%^&*(),.?":{}|<>]/.test(username.value);
  
  if (hasInvalidChar) {
    nameError.value = '숫자, 특수문자, 공백은 입력할 수 없습니다.';
  } else if (!koreanOnly.test(username.value)) {
    nameError.value = '이름은 2~8자의 한글만 입력 가능합니다.';
  } else {
    nameError.value = '';
  }
};


  // 성별 상태 관리
  const gender = ref('male'); // 기본값은 남성으로 설정
  const privacyChecked = ref(false);
  const termsChecked = ref(false);
  // 성별 선택 함수
  const selectGender = (selectedGender) => {
    gender.value = selectedGender;
};


// 폼 유효성 검사를 위한 계산된 속성
const isButtonEnabled = computed(() => {
  // 이메일, 비밀번호, 이름이 유효하고
  const isEmailValid = email.value && !emailError.value;
  const isPasswordValid = password.value && confirmPassword.value && 
                         !passwordError.value && !confirmPasswordError.value;
  const isNameValid = username.value && !nameError.value;
  
  // 개인정보처리방침, 이용약관 체크가 되었는지 확인
  const isCheckboxesChecked = privacyChecked.value && termsChecked.value;
  
  // 모든 조건을 만족해야 true 반환
  return isEmailValid && isPasswordValid && isNameValid && isCheckboxesChecked;
});


const submitForm = () => {
  if (isButtonEnabled.value) {
    // 여기에 폼 제출 로직 추가
    console.log('폼 제출 성공!', {
      email: email.value,
      password: password.value,
      name: username.value,
    });
  }
};

  // 입력값 변경 시 유효성 검사
  watch(email, validateEmail);
  watch(password, validatePassword);
  watch(confirmPassword, validateConfirmPassword);  
  watch(username, validateName);
  
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
  
  .form-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 0px;
    gap: 16px;
    width: 100%;
  }
  
  .section-title {
    width: 100%;
    font-size: 20px;
    font-weight: 700;
    line-height: 150%;
    letter-spacing: -0.02em;
    color: #424242;
    margin: 0;
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
  
  .gender-buttons {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
    height: 40px;
  }
  
  .gender-button {
    flex: 1;
    height: 40px;
    padding: 8px 12px;
    gap: 12px;
    border: 1px solid #BDBDBD;
    border-radius: 6px;
    background: #FFFFFF;
    color: #424242;
  }
  
  .gender-button.active {
    background: #424242;
    color: #FFFFFF;
    border: none;
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
  
  .dropdown-arrow {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    font-weight: 300;
    color: #303030;
    pointer-events: none;
  }
  
  .checkbox-section {
  display: flex;
  justify-content: center;
  width: 100%;
  /* margin: 20px 0; */
}


.checkbox-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}


.checkbox-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.checkbox-input {
  display: none; /* 원래 체크박스는 완전히 숨김 */
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  cursor: pointer;
}

/* 체크된 상태 스타일 */
.checkbox-input:checked + .custom-checkbox {
  background-color: #FF9F40;
  border-color: #FF9F40;
}

.checkbox-input:checked + .custom-checkbox:after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
}

.checkbox-label {
  font-size: 14px;
  font-weight: 500;
  color: #424242;
  pointer-events: auto; /* 이 부분이 중요: 라벨에 클릭 이벤트 없애기 */
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

.checkbox-label:hover{
  text-decoration: underline;
}

/* 성공 스타일 추가 */
.input-wrapper.success {
  border-color: #64CA17;
  border-width: 1px;
}

.success-message {
  color: #64CA17;
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
  padding-left: 5px;
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
  </style>
  