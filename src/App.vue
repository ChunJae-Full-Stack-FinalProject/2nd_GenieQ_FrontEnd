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
  console.log('[App.vue] 브라우저 창 닫힘 감지: authUser 로컬 스토리지에서 제거');
  localStorage.removeItem('authUser');
  // 세션 쿠키는 브라우저가 유지하므로 다시 방문 시 세션 기반으로 복원 가능
};

// 앱이 로드될 때 인증 상태 초기화
onMounted(() => {
  console.log('App 컴포넌트 마운트: 인증 상태 초기화');
  authStore.initializeAuth();
  
  // beforeunload 이벤트 리스너 등록
  window.addEventListener('beforeunload', handleBeforeUnload);
  console.log('[App.vue] beforeunload 이벤트 리스너 등록 완료');
});

// 컴포넌트가 언마운트될 때 이벤트 리스너 제거
onBeforeUnmount(() => {
  console.log('[App.vue] 컴포넌트 언마운트: 이벤트 리스너 제거');
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
