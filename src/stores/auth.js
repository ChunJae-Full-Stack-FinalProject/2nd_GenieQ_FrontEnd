// src/stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  // state는 상태(데이터) 저장 -> 반응형이기 때문에 상태가 변경되면 컴포넌트에서 즉시 반영
  state: () => ({
    // 사용자 인증 상태
    user: null,
    isAuthenticated: false, //초기 상태는 로그인 안 된 상태

    // 로그인 관련 로딩 및 에러 상태
    isLoading: false, //처음에 아무 작업을 안 하고 있으니까 false -> 작업이 시작하면 true -> 작업이 끝나고 다시 원래 상태인 false로 돌려준다.
    error: null //에러 메시지 저장
  }),
  
  // 상태 읽기 및 가공
  getters: {
    // 사용자가 로그인되어 있는지 확인
    // (state)의 값을 가져와서, 사용자가 로그인 상태와 사용자 정보가 존재하는지 확인
    isLoggedIn: (state) => state.isAuthenticated && state.user !== null,
    // 사용자 정보 반환
    userInfo: (state) => state.user,
    //티켓 수량 반환 
    userTicketCount: (state) => state.user?.ticketCount || 0,
  },
  
  //상태 수정 및 비동기 처리
  //로그인 api 호출 후 상태 업데이트는 actions에서 처리
  actions: {
    // 사용자 정보 설정 (로그인 페이지에서 직접 호출)
    setUser(userData) {
      this.user = userData; 
      this.isAuthenticated = true;//인증상태
      this.error = null;
      console.log('Auth Store: 사용자 정보 설정됨', userData); // (추가) 로그: 사용자 정보 설정
    },

    //사용자 티켓 정보만 업데이트 하는 메서드
    //티켓 업데이트 메서드 만들기 => welcomeinfo의 ticketCount 업데이트 하도록
    updateTicketCount(){
      if (!this.isAuthenticated) return;

      const apiUrl = import.meta.env.VITE_API_URL;

      return fetch(`${apiUrl}/api/info/select/ticket`,{
        method : "GET",
        headers : { "Content-Type" : "application/json"},
        credentials : 'include'
      })
      .then(respone => {
        if(!respone.ok) throw new Error('티켓 정보 가져오기 실패');
        return respone.text();
      })
      .then(data => {
        // user 객체 내부의 ticketCount만 업데이트
        if(this.user){
          this.user.ticketCount = parseInt(data) || 0;

          //로컬 스토리지의 사용자 정보도 업데이트
          localStorage.setItem('authUser', JSON.stringify(this.user));
        }
        return parseInt(data) || 0;
      })
      .catch(error =>{

        return 0;
      });
    },
    
    // 로그인 요청 (직접 사용하지 않음 - LoginView.vue에서 fetch 사용)
    login(credentials) {
      this.isLoading = true;
      this.error = null;
      
      console.log('로그인 시도:', credentials); // (추가) 로그: 로그인 시도
      
      return new Promise((resolve, reject) => {
        const apiUrl = import.meta.env.VITE_API_URL;
        //서버에 로그인 요청 보내기
        fetch(`${apiUrl}/api/auth/select/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // 쿠키를 포함시켜 세션 유지
          body: JSON.stringify(credentials)
        })
        // 성공하면 .then()에서 처리 / 실패하면 .catch()에서 처리 / 완료되면 .finally()에서 처리
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => { throw new Error(text || '로그인에 실패했습니다.'); });
          }
          return response.json(); // promise를 반환함. 반환된 값이 다음 then()의 매개변수로 자동 전달된다.
        })
        .then(userData => {
          console.log('로그인 성공:', userData); // (추가) 로그: 로그인 성공
          
          // 사용자 정보 상태 업데이트
          this.user = userData;
          this.isAuthenticated = true;
          
          // 로컬 스토리지에 사용자 상태 저장 (새로고침 시 상태 유지)
          localStorage.setItem('authUser', JSON.stringify(userData));
          
          // 성공 상태를 호출한 쪽에 반환
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