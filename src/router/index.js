// @/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import Frame from '@/views/Frame.vue'
import Mainhome from '@/components/mainhome/MainHome.vue'
import ImmediatelyComponent from '@/components/test/ImmediatelyComponent.vue'
import ExampleView from '@/views/ExampleView.vue'
import TermsView from '@/components/common/TermsView.vue'
import PolicyView from '@/components/common/Privacy.vue'
import { useAuthStore } from '@/stores/auth' 

// 각 페이지의 라우트들 import
import generationRoutes from './generation.routes'
import authRoutes from '@/router/auth.routes.js'
import myPageRoutes from './mypage.routes'
import strageRoutes from './storage.routes'

// 로그인 상태 체크 가드
const requireAuth = async (to, from, next) => {
  // localStorage에서 authUser가 있는지 확인
  let authUser = localStorage.getItem('authUser');
  
  // 인증 스토어 가져오기
  const authStore = useAuthStore();
  
  if (authUser) {

    // authUser가 있으면 인증된 상태로 처리
    authStore.setUser(JSON.parse(authUser));
    next();
  } else {

    // authUser가 없지만 유효한 세션이 있을 수 있으므로 세션 확인
    try {
      // API URL 가져오기
      const apiUrl = import.meta.env.VITE_API_URL;
      
      // 백엔드에 세션 유효성 확인 요청
      const response = await fetch(`${apiUrl}/api/info/select/entire`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' // 쿠키를 포함하여 요청
      });
      
      if (response.ok) {
        // 세션이 유효하고 사용자 정보를 받아옴
        const userData = await response.json();

        
        // 인증 스토어와 localStorage 업데이트
        authStore.setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
        
        // 이용권 정보도 함께 업데이트
        await authStore.updateTicketCount();
        
        next();
      } else {
        // 세션이 유효하지 않음

        next('/login');
      }
    } catch (error) {

      next('/login');
    }
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 인증 없이 접근 가능 - 로그인 페이지
    { path: '/login', name: 'login', component: LoginView },
    { path: '/ex', name: 'ex', component: ExampleView },
    ...authRoutes,
    
    // Frame 컴포넌트를 부모로 하는 중첩 라우트 구조
    { path: '/', component: Frame, beforeEnter: requireAuth, // 인증 필요 - 모든 자식 라우트
      children: [
        { path: '', redirect: '/home' },
        { path: 'home', name: 'home', component: Mainhome },
        { path: 'immediately', name: 'immediately', component: ImmediatelyComponent },
        ...generationRoutes,
        { path: '/terms', component: TermsView }, //이용약관
        { path: "/privacy", component: PolicyView}, //개인정보
        // 나중에 컴포넌트가 생성될 때 추가되도록 설정, 위에 import 안하고 사용 가능
        { path: 'delay', name: 'delay', component: () => import('@/components/test/DelayComponent.vue') },
        ...myPageRoutes,
        ...strageRoutes,
      ]
    },
    // 존재하지 않는 페이지 처리
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
})

export default router