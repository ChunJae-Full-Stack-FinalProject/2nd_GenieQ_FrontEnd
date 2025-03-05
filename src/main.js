import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Icon } from '@iconify/vue'; // iconify 아이콘 사용 1-1. import

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('Icon', Icon); // iconify 아이콘 사용 1-2. 전역 컴포넌트 등록 https://icon-sets.iconify.design/

app.mount('#app')
