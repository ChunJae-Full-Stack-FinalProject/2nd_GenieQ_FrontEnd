// @/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import Frame from '@/views/Frame.vue'
import TestHomeComponent from '@/components/test/TestHomeComponent.vue'
import ImmediatelyComponent from '@/components/test/ImmediatelyComponent.vue'
import ExampleView from '@/views/ExampleView.vue'
import SingUpPage from '@/components/auth/SingUpPage.vue'
import TermsView from '@/components/common/TermsView.vue'
import PolicyView from '@/components/common/Privacy.vue'

// 각 페이지의 라우트들 import
import generationRoutes from './generation.routes'
import myPageRoutes from './mypage.routes'

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
    { path: '/ex', name: 'ex', component: ExampleView },
    { path: '/singup', name:'singup', component:SingUpPage},
    
    // Frame 컴포넌트를 부모로 하는 중첩 라우트 구조
    { path: '/', component: Frame, // beforeEnter: requireAuth, // 인증 필요 - 모든 자식 라우트
      children: [
        { path: '', redirect: '/home' },
        { path: 'home', name: 'home', component: TestHomeComponent },
        { path: 'immediately', name: 'immediately', component: ImmediatelyComponent },
        ...generationRoutes,
        { path: '/terms', component: TermsView }, //이용약관
        { path: "/privacy", component: PolicyView}, //개인정보
        // 나중에 컴포넌트가 생성될 때 추가되도록 설정, 위에 import 안하고 사용 가능
        { path: 'delay', name: 'delay', component: () => import('@/components/test/DelayComponent.vue') },
        ...myPageRoutes,
      ]
    },
    // 존재하지 않는 페이지 처리
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
})

export default router