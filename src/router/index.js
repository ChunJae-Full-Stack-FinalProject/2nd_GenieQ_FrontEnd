import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 초기 로딩 라우터 설정
    { path:'/login', name:'login', component:LoginView, },
    { path:'/home', name:'home', component:HomeView, },

    // 지연 로딩 라우터 설정
    // { path: '/about', name: 'about', component: () => import('../views/AboutView.vue'), },
  ],
})

export default router
