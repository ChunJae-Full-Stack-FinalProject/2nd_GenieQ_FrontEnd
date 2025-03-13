// src/stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 사용자 인증 상태
    user: null,
    isAuthenticated: false,
    // 로그인 관련 로딩 및 에러 상태
    isLoading: false,
    error: null
  }),
  
  getters: {
    // 사용자가 로그인되어 있는지 확인
    isLoggedIn: (state) => state.isAuthenticated && state.user !== null,
    // 사용자 정보 반환
    userInfo: (state) => state.user,
  },
  
  actions: {
    // 사용자 정보 설정 (로그인 페이지에서 직접 호출)
    setUser(userData) {
      this.user = userData;
      this.isAuthenticated = true;
      this.error = null;
      console.log('Auth Store: 사용자 정보 설정됨', userData); // (추가) 로그: 사용자 정보 설정
    },
    
    // 로그인 요청 (직접 사용하지 않음 - LoginView.vue에서 fetch 사용)
    login(credentials) {
      this.isLoading = true;
      this.error = null;
      
      console.log('로그인 시도:', credentials); // (추가) 로그: 로그인 시도
      
      return new Promise((resolve, reject) => {
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/api/auth/select/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // 쿠키를 포함시켜 세션 유지
          body: JSON.stringify(credentials)
        })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => { throw new Error(text || '로그인에 실패했습니다.'); });
          }
          return response.json();
        })
        .then(userData => {
          console.log('로그인 성공:', userData); // (추가) 로그: 로그인 성공
          
          // 사용자 정보 상태 업데이트
          this.user = userData;
          this.isAuthenticated = true;
          
          // 로컬 스토리지에 사용자 상태 저장 (새로고침 시 상태 유지)
          localStorage.setItem('authUser', JSON.stringify(userData));
          
          resolve({ success: true, user: userData });
        })
        .catch(error => {
          console.error('로그인 오류:', error); // (추가) 로그: 로그인 오류
          this.error = error.message || '로그인 중 오류가 발생했습니다.';
          reject({ success: false, error: this.error });
        })
        .finally(() => {
          this.isLoading = false;
        });
      });
    },
    
    // 로그아웃 요청
    logout() {
      this.isLoading = true;
      
      console.log('로그아웃 시도'); // (추가) 로그: 로그아웃 시도
      
      return new Promise((resolve, reject) => {
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/api/auth/select/logout`, {
          method: 'POST',
          credentials: 'include'
        })
        .then(response => {
          // 로컬 상태 초기화
          this.user = null;
          this.isAuthenticated = false;
          
          // 로컬 스토리지 항목 제거
          localStorage.removeItem('authUser');
          
          console.log('로그아웃 성공'); // (추가) 로그: 로그아웃 성공
          resolve({ success: true });
        })
        .catch(error => {
          console.error('로그아웃 오류:', error); // (추가) 로그: 로그아웃 오류
          reject({ success: false, error: error.message });
        })
        .finally(() => {
          this.isLoading = false;
        });
      });
    },
    
    // 새로고침 시 인증 상태 복원
    initializeAuth() {
      const storedUser = localStorage.getItem('authUser');
      
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser);
          this.isAuthenticated = true;
          console.log('인증 상태 복원됨:', this.user); // (추가) 로그: 인증 상태 복원
        } catch (error) {
          console.error('저장된 인증 정보 파싱 오류:', error); // (추가) 로그: 인증 정보 파싱 오류
          localStorage.removeItem('authUser');
        }
      }
    }
  }
});