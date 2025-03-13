<template>
  <div class="wrapper">
    <BaseButton text="저장하기" type="type1" id="save-button" width="248px" height="46px" @click="saveUserInfo"/>

    <div class="content">
      <!-- 기본 정보 -->
      <section class="basic">
        <div class="title-container">
          <span class="title">기본 정보</span>
        </div>
        <div class="item">
          <span class="label">이름</span>
          <input class="value value-box" v-model="userData.name">
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
          <select class="value value-box" id="user-type" v-model="userData.memType">
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
      <span class="withdrawal">회원 탈퇴</span>
      <span class="logout" @click="handleLogout">로그아웃</span>
    </div>
  </div>
  <changePasswordModal :isOpen="showPasswordModal" @close="closePasswordModal"/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseButton from '../common/button/BaseButton.vue';
import changePasswordModal from '../common/modal/type/mypage/ChangePasswordModal.vue';

// 비밀번호 변경 모달 상태 관리
const showPasswordModal = ref(false);
const isLoading = ref(false);
const error = ref(null);
const router = useRouter();
const authStore = useAuthStore();

// 반응형 userData 객체 생성
const userData = ref({
  name: '',
  email: '',
  gender: '',
  memType: '',
});

// 모달 열기
const openPasswordModal = () => {
  showPasswordModal.value = true;
};

// 모달 닫기
const closePasswordModal = () => {
  showPasswordModal.value = false;
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

// 사용자 정보 저장하는 함수
const saveUserInfo = () => {
  isLoading.value = true;
  error.value = null;

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9090';
  
  // 업데이트할 정보
  const updateData = {
    name: userData.value.name,
    memType: userData.value.memType
  };

  fetch(`${apiUrl}/api/info/update/profile`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(errorText => { throw new Error(errorText); });
    }
    return response.json();
  })
  .then(data => {
    console.log('사용자 정보 업데이트 성공:', data);
    alert('정보가 성공적으로 저장되었습니다.');
  })
  .catch(error => {
    console.error('사용자 정보 업데이트 오류:', error);
    console.error('에러 유형:', error.name);
    console.error('에러 메시지:', error.message);
    error.value = `정보를 저장하는 중 오류가 발생했습니다: ${error.message}`;
    alert('정보 저장에 실패했습니다.');
  })
  .finally(() => {
    isLoading.value = false;
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
  left: 0px;
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
  height: 384px;
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
  bottom: -340px;
}

.account {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 16px;
  position: absolute;
  width: 240px;
  height: 40px;
  left: 1524px;
  top: 860px;
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
</style>