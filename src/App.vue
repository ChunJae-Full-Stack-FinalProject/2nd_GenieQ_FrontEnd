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
  console.log(`

.d8888b.                    d8b         %c.d8888b.    %c
d88P  Y88b                  Y8P         %cd88P  Y88b  %c
888    888                              %c888    888  %c
888        .d88b.  88888b.  888 .d88b.  %c888    888  %c
888  88888 88.  88 888 "88b 888 88.  88 %c888  "Y888  %c
888    888 888888P 888  888 888 888888P %c888    888b.%c
Y88b  d88P Yb.     888  888 888 Yb.     %cY88b  d8888b.%c
"Y88888P"  "Y889P" 888  888 888 "Y889P" %c"Y8888P"  88b.
  `,
    "color: #ff9f40;","color: #000000;",    "color: #ff9f40;","color: #000000;",    "color: #ff9f40;","color: #000000;",    "color: #ff9f40;","color: #000000;",    "color: #ff9f40;","color: #000000;",    "color: #ff9f40;","color: #000000;",    "color: #ff9f40;","color: #000000;",    "color: #ff9f40;",
  );
  console.log(`
Developed by Team Genius(풀스택 8기) 

with 천재교육(PM 8기, AI개발팀)

https://github.com/ChunJae-Full-Stack-FinalProject 
  `);
  console.log(`
--------------------------------------------------
version : 25-03-22 10:32
  - 0319 QA 요청 사항 반영
  - 테이블 커서 스타일, 불필요 스크롤 바 제거
  - 세션 정보 (서버) 부분 수정된 버전으로 배포완료

version : 25-03-22 14:14
  - 마이페이지 height 973px 이하에서만 적용되도록 추가 적용

version : 25-03-24 11:20
  - 1700->2300 제한 해제
  - Design 글씨 크기 및 볼드 설정 변경

version : 25-03-25 21:09
  - 문항 선지 잘림 오류 해결: (편법)쉼표 제거하여 db 저장
  - 문항 선지에서 ①②③④⑤ 제거 후 저장되도록 설정
  - 사용자 입력-문항 생성 경우, 논점이 생성되지 않는 오류 해결
  - 자료실 불러오기, 작업 내역에 없는 항목 출력되는 문제 해결
  - * 재생성하기 버튼 삭제
--------------------------------------------------
  `);
  
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


/* 미디어 쿼리 추가 - 모바일 환경 대응 */
@media (max-width: 768px) {
  .login-bg {
    background-size: 100vw;
    background-position: top;
    background-color: white;
  }
}
</style>