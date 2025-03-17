<template>
  <div :class="{ 'login-bg': isLoginPage }">
    <RouterView />
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';

const authStore = useAuthStore();
const route = useRoute();
const isLoginPage = computed(() => route.path === '/login');

// 앱이 로드될 때 인증 상태 초기화
onMounted(() => {
  console.log('App 컴포넌트 마운트: 인증 상태 초기화');
  authStore.initializeAuth();
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