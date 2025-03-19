<template>
  <div :class="{ 'login-bg': isLoginPage }">
    <RouterView />
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { computed, onMounted, onBeforeUnmount  } from 'vue';

const authStore = useAuthStore();
const route = useRoute();
const isLoginPage = computed(() => route.path === '/login');

// 브라우저 창이 닫힐 때 실행될 함수
const handleBeforeUnload = () => {
  localStorage.removeItem('authUser');
  // 세션 쿠키는 브라우저가 유지하므로 다시 방문 시 세션 기반으로 복원 가능
};

// 앱이 로드될 때 인증 상태 초기화
onMounted(() => {
  console.log('25년 3월 18일 오후 7시 15분 버전 업데이트');
  console.log('- 파비콘 적용');
  console.log('- 콘솔 로그 삭제');
  console.log('- 문항 예제 데이터 수정');
  console.log('25년 3월 19일 오후 12시 36분 버전 업데이트');
  console.log('- 문항 유형 생성하기 버튼 비활성화 문제 수정');
  console.log('25년 3월 19일 오후 1시 30분 버전 업데이트');
  console.log('- 요청 주소 변경');
  console.log('25년 3월 19일 오후 2시 48분 버전 업데이트');
  console.log('- 테이블 데이터 개수 부족할 때 각 tr 높이 조정')
  
  authStore.initializeAuth();
  
  // beforeunload 이벤트 리스너 등록
  window.addEventListener('beforeunload', handleBeforeUnload);
});

// 컴포넌트가 언마운트될 때 이벤트 리스너 제거
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

</script>
<style scoped>
/* 글로벌 스타일 */
.login-bg {
  background: url("@/assets/images/login_bg.png") no-repeat;
  background-position: center;
  background-size: cover;
  min-height: 100vh;
  width: 100%;
}
</style>