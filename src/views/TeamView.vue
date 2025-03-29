<template>
  <div class="portfolio-page">
    <div class="team-container">
      <div class="team-header">
        <h1 class="team-page-title">Genie<span class="highlight-q">Q</span>를 함께 만든 사람들</h1>
        <!-- <p class="subtitle">프로젝트 팀원 소개</p> -->
      </div>
      
      <div class="team-menu">
        <router-link 
          v-for="team in teams" 
          :key="team.id" 
          :to="{name: 'portfolioTeam', params: {teamId: team.id}}"
          class="team-link"
          :class="{ 'active': isTeamActive(team.id) }"
        >
          {{ team.name }}
        </router-link>
      </div>
      
      <div class="team-view">
        <router-view></router-view>
      </div>
    </div>
    
    <!-- 새로운 페이지 소개 섹션 -->
    <div class="page-container">
      <div class="page-header">
        <h1 class="team-page-title">Genie<span class="highlight-q">Q</span> 페이지 소개</h1>
      </div>
      
      <div class="page-menu">
        <button 
          v-for="page in pages" 
          :key="page.id" 
          @click="selectPage(page.id)"
          class="page-link"
          :class="{ 'active': activePage === page.id }"
        >
          {{ page.name }}
        </button>
      </div>
      
      <div class="page-view">
        <div v-if="selectedPage" class="page-content">
          <div class="page-image-container">
            <img :src="selectedPage.image" :alt="selectedPage.name" class="page-image">
          </div>
          <div class="page-description">
            <h2 class="page-title">{{ selectedPage.name }}</h2>
            <p class="page-text">{{ selectedPage.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <GenieQShortcut />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import portfolioData from '@/assets/data/portfolio-data.json';
import GenieQShortcut from '@/components/portfolio/GenieQShortcut.vue'; 

const route = useRoute();
const router = useRouter();
const teams = ref([]);

// 페이지 데이터
const pages = ref([
  { 
    id: 'main', 
    name: '메인 페이지', 
    image: '/src/assets/images/page_main.png',
    description: '사용자가 처음 접하는 GenieQ의 메인 페이지입니다. 질문 검색과 최신 질문 목록, 인기 질문을 확인할 수 있습니다.' 
  },
  { 
    id: 'search', 
    name: '검색 페이지', 
    image: '/src/assets/images/page_search.png',
    description: '키워드 또는 태그별로 질문을 검색하고 필터링할 수 있는 검색 페이지입니다.' 
  },
  { 
    id: 'detail', 
    name: '상세 페이지', 
    image: '/src/assets/images/page_detail.png',
    description: '질문의 상세 내용과 답변을 확인하고 댓글을 작성할 수 있는 페이지입니다.' 
  },
  { 
    id: 'mypage', 
    name: '마이 페이지', 
    image: '/src/assets/images/page_mypage.png',
    description: '사용자의 프로필과 활동 내역, 북마크한 질문을 확인할 수 있는 페이지입니다.' 
  },
]);

const activePage = ref('main');
const selectedPage = computed(() => {
  return pages.value.find(page => page.id === activePage.value);
});

// 데이터 로드
onMounted(() => {
  try {
    teams.value = portfolioData.teams;
    
    // 팀 ID가 없는 경우 첫 번째 팀으로 리다이렉트
    if (!route.params.teamId && teams.value.length > 0) {
      router.replace({
        name: 'portfolioTeam',
        params: { teamId: teams.value[0].id }
      });
    }
    
    // 초기 페이지 선택
    selectPage('main');
  } catch (error) {
    teams.value = [];
  }
});

// 현재 활성화된 팀 확인
const isTeamActive = (teamId) => {
  return route.params.teamId === teamId;
};

// 페이지 선택 함수
const selectPage = (pageId) => {
  activePage.value = pageId;
};

// 경로 파라미터 변경 시 확인
watch(() => route.params.teamId, (newTeamId) => {
  if (!newTeamId && teams.value.length > 0) {
    router.replace({
      name: 'portfolioTeam',
      params: { teamId: teams.value[0].id }
    });
  }
});
</script>

<style scoped>
.portfolio-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-width: unset !important; /* body의 min-width 무시 */
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: #F6F6F6;
  padding: 20px;
  box-sizing: border-box;
  z-index: 100; /* 다른 요소보다 앞에 표시 */
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.team-container, .page-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.team-header, .page-header {
  text-align: center;
}

.team-page-title {
  white-space: nowrap; /* 줄바꿈 방지 */
  font-size: clamp(12px, 5vw, 36px);
  font-weight: 700;
  color: #303030;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 24px;
  color: #757575;
  margin: 0;
}

.highlight-q {
  color: #FF9F40;
  font-weight: 600;
  font-size: 36px;
}

.team-menu, .page-menu {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.team-view, .page-view {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.team-link, .page-link {
  display: block;
  padding: 12px 24px;
  background-color: #F6F6F6;
  color: #303030;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-align: center;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.team-link:hover, .page-link:hover {
  background-color: #FFEDDC;
  color: #FF9F40;
}

.team-link.active, .page-link.active {
  background-color: #FF9F40;
  color: white;
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}

.page-image-container {
  width: 100%;
  max-width: 800px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.page-image {
  width: 100%;
  height: auto;
  display: block;
}

.page-description {
  width: 100%;
  max-width: 800px;
  text-align: center;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303030;
  margin-bottom: 16px;
}

.page-text {
  font-size: 16px;
  line-height: 1.6;
  color: #757575;
}

/* 모바일 반응형 스타일 */
@media (max-width: 768px) {
  .team-container, .page-container {
    width: 100%;
    padding: 20px 10px;
  }
  
  .team-menu {
    gap:5px;
  }

  .team-page-title {
    white-space: nowrap; /* 줄바꿈 방지 */
    font-size: 26px;
  }
  
  .subtitle {
    font-size: 18px;
  }

  .team-container, .page-container {
    gap:10px;
  }
  
  .team-link, .page-link {
    display: block;
    padding: 10px 18px;
    font-weight: 500;
    font-size: 14px;
  }
  .team-view, .page-view {
    padding: 20px 15px;
  }
  
  .page-content {
    flex-direction: column;
  }
}
</style>