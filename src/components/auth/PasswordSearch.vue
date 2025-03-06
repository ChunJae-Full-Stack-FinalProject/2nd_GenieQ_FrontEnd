<template>
    <div class="signup-page">
      <div class="logo-container">
        <h1 class="logo">Genie<span class="orange-q">Q</span></h1>
      </div>
      
      <div class="signup-container">
        <h2 class="signup-title">비밀번호 찾기</h2>
      
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
              <input type="text" placeholder="인증코드를 입력하세요." class="form-input input-with-margin" />
              <button class="button verify-button">인증</button>
            </div>
          </div>
          
        <button class="button gray-button">완료</button>
      </div> 
    </div>
  </template>
  
  <script setup>
  import { Icon } from "@iconify/vue";


  import { ref } from 'vue';
  // 성별 상태 관리
  const gender = ref('male'); // 기본값은 남성으로 설정
  const privacyChecked = ref(false);
  const termsChecked = ref(false);
  // 성별 선택 함수
  const selectGender = (selectedGender) => {
    gender.value = selectedGender;
};


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
  pointer-events: none; /* 이 부분이 중요: 라벨에 클릭 이벤트 없애기 */
}
  </style>
  