// @/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import Frame from '@/views/Frame.vue'
import TestHomeComponent from '@/components/test/HomeComponent.vue'
import TestPassageComponent from '@/components/test/PassageComponent.vue'

// 로그인 상태 체크 가드
const requireAuth = (to, from, next) => {
  // 실제 구현에서는 localStorage나 vuex/pinia 상태에서 체크
  let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  isLoggedIn = true; // 로그인 상태 체크 가드 비활성화(true)
  if (isLoggedIn) { next()  
  } else { next('/login') } // isLoggedIn == false 일 경우 /login 경로로 라우터 설정  
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 인증 없이 접근 가능 - 로그인 페이지
    { path: '/login', name: 'login', component: LoginView },
    
    // Frame 컴포넌트를 부모로 하는 중첩 라우트 구조 (기존 코드 유지)
    { path: '/', component: Frame, // beforeEnter: requireAuth, // 인증 필요 - 모든 자식 라우트
      children: [
        { path: '', redirect: '/home' },
        { path: 'home', name: 'home', component: TestHomeComponent },
        { path: 'generation', name: 'generation', component: TestPassageComponent },
        { path: 'mypage', name: 'mypage', component: () => import('@/components/test/StoreComponent.vue') },
      ]
    },
    
    // 존재하지 않는 페이지 처리
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
})

export default router