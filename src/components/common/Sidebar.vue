<template>
    <div class="sidebar">
        <router-link to="/team" class="nav-logo">
          <div class="logo">Genie<span class="highlight-q">Q</span></div>
        </router-link>
        <nav>
            <router-link to="/" class="nav-item" :class="{ 'active-box': isActive('/') }">
                <img src="@/assets/icons/icon_home.png" alt="홈페이지" class="home-icon" /> 
                홈
            </router-link>
            <router-link to="/passage" class="nav-item" :class="{ 'active-box': isActive('/passage') }">
                <img src="@/assets/icons/icon_passage.png" alt="지문생성" class="passage-icon" /> 
                 지문 생성
            </router-link>
            <router-link to="/questions" class="nav-item" :class="{ 'active-box': isActive('/questions') }" @click="clearPassageData">
                <img src="@/assets/icons/icon_question.png" alt="문항생성" class="question-icon" /> 
                문항 생성
            </router-link>
            <router-link to="/storage" class="nav-item" :class="{ 'active-box': isActive('/storage') }">
                <img src="@/assets/icons/icon_file.png" alt="자료실" class="file-icon" /> 
                 자료실
            </router-link>
        </nav>

        <div class="bottom-menu">
            <router-link to="/mypage" class="nav-item mypage-item" :class="{ 'active-mypage': isActive('/mypage') }">
                <div class="icon-mypage"></div>
                마이페이지
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

// 현재 활성화된 경로 확인 (수정된 버전)
const isActive = (path) => {
    if (path === '/') {
        // 홈 경로인 경우, 정확히 '/'인 경우에만 활성화
        return route.path === '/home' || route.path === '';
    }
    // 다른 경로는 해당 경로로 시작하는지 확인
    return route.path.startsWith(path);
};
// 지문 데이터 제거 함수
const clearPassageData = () => {
    localStorage.removeItem('genieq-passage-data');
    localStorage.removeItem('genieq-passage-for-question');
    localStorage.removeItem('generateQuestionPassageData');
};
</script>

<style scoped>
.sidebar {
  width: 156px;
  height: 100%; /* 화면 높이에 맞춤 */
  min-height: 100%; /* 최소 높이 설정 */
  background-color: #16252D;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 100; /* 다른 요소 위에 표시 */
}

.logo {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
}

.nav-item {
  display: flex; /* flex로 설정 */
  align-items: center;
  width: 100%; /* 사이드바 전체 너비 맞춤 */
  padding: 16px 20px;
  gap: 8px;
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

.nav-item .icon {
  margin-right: 10px;
}

.nav-logo {
  color: white;
  text-decoration: none;
}

/* 현재 선택된 메뉴(홈, 지문 생성, 문항 생성, 자료실) 스타일 */
.active-box {
  display: flex; /* 블록 요소처럼 확장 */
  align-items: center;
  background: #FF9F40 !important;
  color: #FFFFFF !important;
  width: 100%; /*  사이드바 전체 너비 맞춤 */
  border-radius: 0; /*  둥근 모서리 제거 */
}

.icon-mypage {
    width: 20px;
    height: 20px;
    background-image: url('@/assets/icons/icon_mypage.png');
    background-size: contain;
    background-repeat: no-repeat;
    transition: background-image 0.3s ease;
}

.active-mypage {
    color: #FF9F40 !important;
}

.active-mypage .icon-mypage {
    background-image: url('@/assets/icons/icon_mypageactive.png');
}

/* 마이페이지를 하단에 정렬 */
.bottom-menu {
  margin-top: auto;
  padding-bottom: 20px;
}

.highlight-q {
  color: #FF9F40;
  font-weight: 600;
  font-size: 25px;
}
</style>
