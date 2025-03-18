// src/utils/sessionKeepAlive.js
export function initSessionKeepAlive() {
    // 테스트용 설정 (초 단위)
    const INACTIVE_THRESHOLD = 15 * 1000; // 15초 비활동 시 갱신 중단
    const CHECK_INTERVAL = 5 * 1000;      // 5초마다 확인
    
    let lastActivityTime = Date.now();
    let sessionTimer = null;
    
    // 세션 갱신 함수
    function keepSessionAlive() {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivityTime;
      
      // 마지막 활동 이후 15초 이상 지났으면 세션 갱신하지 않음
      if (inactiveTime > INACTIVE_THRESHOLD) {
        console.log('사용자 비활동 상태: 세션 갱신 중단');
        clearInterval(sessionTimer);
        sessionTimer = null;
        return;
      }
      
      // 활동 중인 경우에만 세션 갱신
      const apiUrl = import.meta.env.VITE_API_URL;
      fetch(`${apiUrl}/api/session/keep-alive`, {
        method: 'GET',
        credentials: 'include' // 쿠키 포함
      })
      .then(response => {
        if (response.ok) {
          console.log('세션 갱신됨 (마지막 활동으로부터 ' + Math.round(inactiveTime/1000) + '초)');
        }
      })
      .catch(error => {
        console.error('세션 갱신 실패:', error);
      });
    }
    
    // 사용자 활동 감지 함수
    function detectUserActivity() {
      console.log('사용자 활동 감지됨');
      lastActivityTime = Date.now();
      
      // 이미 타이머가 실행 중이 아니면 타이머 시작
      if (!sessionTimer) {
        console.log('사용자 활동 감지: 세션 갱신 타이머 시작');
        sessionTimer = setInterval(keepSessionAlive, CHECK_INTERVAL);
        
        // 즉시 첫 번째 갱신 요청
        keepSessionAlive();
      }
    }
    
    // 사용자 활동 이벤트 리스너
    window.addEventListener('click', detectUserActivity);
    window.addEventListener('keypress', detectUserActivity);
    window.addEventListener('scroll', detectUserActivity);
    window.addEventListener('mousemove', detectUserActivity);
    
    // 초기 활동 감지 (페이지 로드 시)
    detectUserActivity();
    
    // 테스트용 함수 추가 - 콘솔에서 직접 호출 가능
    window.testSessionStatus = function() {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivityTime;
      console.log('세션 상태:');
      console.log('- 마지막 활동 이후 경과 시간: ' + Math.round(inactiveTime/1000) + '초');
      console.log('- 세션 타이머 활성화 상태: ' + (sessionTimer !== null));
      console.log('- 비활동 임계값: ' + (INACTIVE_THRESHOLD/1000) + '초');
      console.log('- 확인 간격: ' + (CHECK_INTERVAL/1000) + '초');
    };
    
    // 정리 함수 반환
    return function cleanup() {
      if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
      }
      window.removeEventListener('click', detectUserActivity);
      window.removeEventListener('keypress', detectUserActivity);
      window.removeEventListener('scroll', detectUserActivity);
      window.removeEventListener('mousemove', detectUserActivity);
      delete window.testSessionStatus;
      console.log('세션 갱신 정리됨');
    };
  }