import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Icon } from '@iconify/vue'; // iconify 아이콘 사용 1-1. import
import { useAuthStore } from './stores/auth';

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(createPinia())
app.use(router)
app.component('Icon', Icon); // iconify 아이콘 사용 1-2. 전역 컴포넌트 등록 https://icon-sets.iconify.design/
app.use(pinia)

const authStore = useAuthStore(); // 앱 시작 시 인증 상태 초기화
authStore.initializeAuth();

app.mount('#app')
