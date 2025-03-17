<template>
  <div class="wrapper">
    <!-- 조건부 활성화 버튼 -->
    <BaseButton 
      text="저장하기" 
      :type="isDataModified ? 'type1' : 'disabled'" 
      id="save-button" 
      width="248px" 
      height="46px" 
      @click="saveUserInfo"
      :disabled="!isDataModified"
    />

    <div class="content">
      <!-- 기본 정보 -->
      <section class="basic">
        <div class="title-container">
          <span class="title">기본 정보</span>
        </div>
        <div class="item">
          <span class="label">이름</span>
          <input class="value value-box" v-model="userData.name" @input="checkModified">
        </div>
        <div class="item">
          <span class="label">이메일</span>
          <span class="value">{{ userData.email }}</span>
        </div>
        <div class="item">
          <span class="label">비밀번호</span>
          <span class="value">****</span>
          <BaseButton text="비밀번호 변경" type="type3" id="pwd-change" width="125px" height="40px" @click="openPasswordModal"/>
        </div>
      </section>

      <!-- 추가 정보 -->
      <section class="additional">
        <div class="title-container">
          <span class="title">추가 정보</span>
        </div>
        <div class="item">
          <span class="label">성별</span>
          <span class="value">{{ userData.gender === 'male' ? '남성' : '여성' }}</span>
        </div>
        <div class="item">
          <span class="label">소속</span>
          <select class="value value-box" id="user-type" v-model="userData.memType" @change="checkModified">
            <option value="초등교사">초등교사</option>
            <option value="중등교사">중등교사</option>
            <option value="고등교사">고등교사</option>
            <option value="학원">학원</option>
            <option value="기업">기업</option>
            <option value="학생">학생</option>
            <option value="학부모">학부모</option>
            <option value="기타">기타</option>
          </select>
        </div>
      </section>
    </div>

    <div v-if="isLoading" class="loading">정보를 불러오는 중...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div class="account">
      <span class="withdrawal" @click="openWithdrawalWarning">회원 탈퇴</span>
      <span class="logout" @click="handleLogout">로그아웃</span>
    </div>
  </div>
  <changePasswordModal :isOpen="showPasswordModal" @close="closePasswordModal" @success-message="handleSuccessMessage" @error-message="handleErrorMessage"/>

  <!-- 회원탈퇴 경고 모달 -->
  <WarningModalComponent
    :isOpen="showWithdrawalWarning"
    title="서비스를 탈퇴하시겠습니까"
    message="탈퇴 시 남은 이용권은 소멸되며, 회원 정보 및 생성한 데이터는 즉시 파기됩니다."
    cancelText="취소하기"
    confirmText="탈퇴하기"
    @close="closeWithdrawalWarning"
    @confirm="processWithdrawal"
  />

  <!-- 회원탈퇴 완료 확인 모달 -->
  <ConfirmModalComponent
    :isOpen="showWithdrawalComplete"
    title="서비스 탈퇴 완료"
    message="이용해 주셔서 감사합니다. '확인' 버튼을 누르시면 홈으로 이동합니다." 
    @close="closeWithdrawalComplete"
    @confirm="redirectAfterWithdrawal"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BaseButton from '../common/button/BaseButton.vue';
import changePasswordModal from '../common/modal/type/mypage/ChangePasswordModal.vue';
import WarningModalComponent from '../common/modal/type/WarningModalComponent.vue';
import ConfirmModalComponent from '../common/modal/type/ConfirmModalComponent.vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// 비밀번호 변경 모달 상태 관리
const showPasswordModal = ref(false);
const isLoading = ref(false);
const error = ref(null);

// 회원탈퇴 관련 모달 상태 관리
const showWithdrawalWarning = ref(false);
const showWithdrawalComplete = ref(false);

// 데이터 수정 여부 체크 - 여기서 먼저 선언
const isDataModified = ref(false);

// 회원탈퇴 입력 정보
const withdrawalInfo = ref({
  memEmail: '',
  memPassword: ''
});

// 라우터와 스토어 초기화
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 원본 사용자 데이터 저장 (변경 감지용)
const originalUserData = ref({
  name: '',
  memType: ''
});

// 반응형 userData 객체 생성
const userData = ref({
  name: '',
  email: '',
  gender: '',
  memType: '',
});

//수정 여부 확인 함수 구현
const checkModified = () => {
  isDataModified.value = 
    userData.value.name !== originalUserData.value.name || 
    userData.value.memType !== originalUserData.value.memType;
};

// 모달 열기
const openPasswordModal = () => {
  showPasswordModal.value = true;
};

// 모달 닫기
const closePasswordModal = () => {
  showPasswordModal.value = false;
};

// 모달 알림 메시지 처리
const handleSuccessMessage = (message) => {
  alert(message);
};

const handleErrorMessage = (message) => {
  alert(message);
};

// 회원탈퇴 모달 열기
const openWithdrawalWarning = () => {
  // 이메일 필드 초기화 - 현재 로그인한 사용자의 이메일로 자동 설정
  withdrawalInfo.value.memEmail = userData.value.email;
  withdrawalInfo.value.memPassword = '';
  showWithdrawalWarning.value = true;
};

// 회원탈퇴 경고 모달 닫기
const closeWithdrawalWarning = () => {
  showWithdrawalWarning.value = false;
};

// 회원탈퇴 진행
const processWithdrawal = () => {
  isLoading.value = true;
  error.value = null;

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9090';
  
  // API 요청 (PUT 메서드 사용)
  fetch(`${apiUrl}/api/auth/remove/withdrawal`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      memEmail: userData.value.email,
    })
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(errorText => { throw new Error(errorText || '회원탈퇴에 실패했습니다'); });
    }
    
    return response.text();
  })
  .then(data => {
    console.log('회원탈퇴 성공:', data);
    
    // 경고 모달 닫기
    showWithdrawalWarning.value = false;
    
    // 완료 모달 표시
    showWithdrawalComplete.value = true;
  })
  .catch(err => {
    console.error('회원탈퇴 오류:', err);
    alert('회원탈퇴 처리 중 오류가 발생했습니다: ' + err.message);
  })
  .finally(() => {
    isLoading.value = false;
  });
};
// 회원탈퇴 완료 모달 닫기
const closeWithdrawalComplete = () => {
  showWithdrawalComplete.value = false;
};

// 회원탈퇴 후 리다이렉트
const redirectAfterWithdrawal = () => {
  // 로그아웃 처리 및 로그인 페이지로 이동
  localStorage.removeItem('authUser');
  localStorage.removeItem('token');
  authStore.user = null;
  authStore.isAuthenticated = false;
  router.push('/login');
};

// 사용자 정보 가져오는 함수
const fetchUserInfo = () => {
  // 로그인 상태 확인
  if (!authStore.isAuthenticated) {
    console.error('로그인되지 않은 상태입니다.');
    router.push('/login');
    return;
  }

  isLoading.value = true;
  error.value = null;

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9090';
  
  // API 요청
  fetch(`${apiUrl}/api/info/select/entire`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(errorText => { throw new Error(errorText); });
    }
    return response.json();
  })
  .then(data => {
    console.log('사용자 정보 조회 성공:', data);
    
    // 반응형 userData 업데이트
    userData.value = {
      name: data.name || '',
      email: data.email || '',
      gender: data.gender || '',
      memType: data.memType || '',
    };
    
    // 원본 데이터 저장
    originalUserData.value = {
      name: data.name || '',
      memType: data.memType || ''
    };
    
    console.log('데이터 매핑 후:', userData.value);
  })
  .catch(error => {
    console.error('사용자 정보 조회 오류:', error);
    console.error('에러 유형:', error.name);
    console.error('에러 메시지:', error.message);
    error.value = `사용자 정보를 불러오는 중 오류가 발생했습니다: ${error.message}`;
  })
  .finally(() => {
    isLoading.value = false;
  });
};

// 이름 업데이트 함수
const updateName = () => {
  // 이름이 변경되지 않았으면 업데이트 하지 않음
  if (userData.value.name === originalUserData.value.name) {
    return Promise.resolve();
  }
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9090';
  
  // 요청 데이터
  const nameData = {
    "memName": userData.value.name
  };
  
  console.log('이름 업데이트 요청 데이터:', nameData);
  
  return fetch(`${apiUrl}/api/info/update/name`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
    },
    body: JSON.stringify(nameData)
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(errorText => { throw new Error(errorText || '이름 업데이트에 실패했습니다'); });
    }
    
    // 응답이 JSON인지 확인하고 적절히 처리
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return response.text();
    }
  })
  .then(data => {
    console.log('이름 업데이트 성공:', data);
    originalUserData.value.name = userData.value.name;
    return true;
  });
};

// 소속 업데이트 함수
const updateType = () => {
  // 소속이 변경되지 않았으면 업데이트 하지 않음
  if (userData.value.memType === originalUserData.value.memType) {
    return Promise.resolve();
  }
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9090';
  
  // 요청 데이터
  const typeData = {
    "memType": userData.value.memType
  };
  
  console.log('소속 업데이트 요청 데이터:', typeData);
  
  return fetch(`${apiUrl}/api/info/update/type`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
    },
    body: JSON.stringify(typeData)
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(errorText => { throw new Error(errorText || '소속 업데이트에 실패했습니다'); });
    }
    
    // 응답이 JSON인지 확인하고 적절히 처리
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return response.text();
    }
  })
  .then(data => {
    console.log('소속 업데이트 성공:', data);
    originalUserData.value.memType = userData.value.memType;
    return true;
  });
};




// 사용자 정보 저장하는 함수 (이름과 소속을 각각 업데이트)
// 이벤트 중복 실행 방지 플래그
let isSaving = false;

const saveUserInfo = () => {
  // 이미 저장 중이면 실행하지 않음
  if (isSaving) {
    console.log('이미 저장 중입니다.');
    return;
  }
  
  isSaving = true;
  isLoading.value = true;
  error.value = null;
  
  // 로그인 상태 확인
  if (!authStore.isAuthenticated) {
    alert('로그인이 필요합니다. 다시 로그인해주세요.');
    router.push('/login');
    isSaving = false;
    isLoading.value = false;
    return;
  }
    
  // 변경된 항목이 있는지 확인
  const isNameChanged = userData.value.name !== originalUserData.value.name;
  const isTypeChanged = userData.value.memType !== originalUserData.value.memType;
  
    
  // 변경된 항목이 없으면 알림만 표시
  if (!isNameChanged && !isTypeChanged) {
    alert('변경된 정보가 없습니다.');
    isSaving = false;
    isLoading.value = false;
    return;
  }
    
  console.log('변경할 정보:', {
    name: isNameChanged ? userData.value.name : '변경 없음',
    memType: isTypeChanged ? userData.value.memType : '변경 없음'
  });
    
  // 성공 여부 추적
  let successCount = 0;
  const updateCount = (isNameChanged ? 1 : 0) + (isTypeChanged ? 1 : 0);
  let namePromise = Promise.resolve();
  let typePromise = Promise.resolve();
  
  // 이름 변경이 필요한 경우
  if (isNameChanged) {
    namePromise = updateName()
      .then(() => {
        successCount++;
      })
      .catch(nameError => {
        console.error('이름 업데이트 중 오류:', nameError);
        throw nameError;
      });
  }
  
  // 소속 변경이 필요한 경우
  if (isTypeChanged) {
    typePromise = updateType()
      .then(() => {
        successCount++;
      })
      .catch(typeError => {
        console.error('소속 업데이트 중 오류:', typeError);
        throw typeError;
      });
  }
  
  // 모든 업데이트 완료 대기
  Promise.all([namePromise, typePromise])
    .then(() => {
      // 모든 업데이트가 성공한 경우에만 성공 메시지 표시
      if (successCount === updateCount) {
        alert('정보가 성공적으로 저장되었습니다.');
      }
    })
    .catch(err => {
      console.error('사용자 정보 업데이트 오류:', err);
      console.error('에러 유형:', err.name);
      console.error('에러 메시지:', err.message);
      error.value = `정보를 저장하는 중 오류가 발생했습니다: ${err.message}`;
      alert('정보 저장에 실패했습니다. ' + err.message);
    })
    .finally(() => {
      isLoading.value = false;
      isSaving = false; // 저장 상태 초기화
    });
};
// 로그아웃 처리 함수
const handleLogout = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9090';
  
  fetch(`${apiUrl}/api/auth/select/logout`, {
    method: 'POST',
    credentials: 'include'
  })
  .then(response => {
    localStorage.removeItem('authUser');
    authStore.user = null;
    authStore.isAuthenticated = false;
    router.push('/login');
  })
  .catch(error => {
    console.error('로그아웃 중 오류 발생:', error);
    localStorage.removeItem('authUser');
    authStore.user = null;
    authStore.isAuthenticated = false;
    router.push('/login');
    
  });
};

// 페이지 로드 시 사용자 정보 가져오기
onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
/* 전체 레이아웃 */
.wrapper {
  position: absolute;
  top: 0px;
  left: 20px;
  width: 1764px;
}

#save-button {
  position: absolute;
  top:24px;
  left: 1360px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 40px;

  position: absolute;
  width: 1472px;
  height: 250px;
  left: 136px;
  top: 94px;
}

/* 기본 정보, 추가 정보 공통 박스 스타일 */
.basic, .additional {
  width: 1472px;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 8px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

/* 기본 정보 박스 */
.basic {
  height: 194px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
}

/* 추가 정보 박스 */
.additional {
  height: 150px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
}

/* 타이틀 */
.title-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 8px;
  border-bottom: 1px solid #E1E1E1;
  width: 1432px;
  flex: none;
  order: 0;
  flex-grow: 0;
}

.title {
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: -2%;
  color: #FF9F40;
}

/* 기본 정보, 추가 정보 내용 스타일 */
.item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 160px;
  width: 1432px;
  height: 40px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
}

/* 라벨 및 값 스타일 */
.label {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 8px;
  width: 120px;
  height: 40px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: -0.02em;
  color: #424242;
}

.value {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 8px;
  width: 360px;
  height: 40px;
  flex: none;
  order: 1;
  flex-grow: 0;
}

.value-box {
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;
  width: 360px;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #FF9F40;
  border-radius: 8px;
  flex: none;
  order: 1;
  flex-grow: 0;
  color: #303030;
}

#pwd-change {
  left: 1000px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  letter-spacing: -0.02em;
  color: #424242;
  position: absolute;
  left: 535px;
}

.content::after {
  content: ""; 
  display: block;
  width: 100%;
  height: 1px;
  background-color: #BDBDBD;
  position: absolute;
  bottom: -240px;
}

.account {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 30px;
  gap: 16px;
  position: absolute;
  width: 240px;
  height: 40px;
  left: 1524px;
  top: 620px;
}

.withdrawal {
  position: absolute;
  left: -112px;
  width: 112px;
  height: 40px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: -0.02em;
  color: #5F5F5F;
}

.logout {
  position: absolute;
  width: 112px;
  height: 40px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: -0.02em;
  color: #FF9F40;
  cursor: pointer;
}

.loading {
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 4px;
  z-index: 1000;
}

.error {
  position: absolute;
  top: 250px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background-color: rgba(220, 53, 69, 0.9);
  color: white;
  border-radius: 4px;
  z-index: 1000;
}
.disabled {
  background-color: #BDBDBD !important;
  color: #FFFFFF !important;
  cursor: not-allowed !important;
}
</style>