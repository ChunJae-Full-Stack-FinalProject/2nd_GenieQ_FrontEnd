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
        <transition name="page-fade" mode="out-in">
          <div v-if="selectedPage" class="page-content" :key="activePage">
            <div class="media-container">
              <!-- 동영상인 경우 -->
              <video 
                v-if="selectedPage.mediaType === 'video'"
                :src="selectedPage.media" 
                :alt="selectedPage.name" 
                class="page-media"
                ref="pageMedia"
                autoplay
                loop
                muted
                playsinline
              ></video>
              <!-- 이미지인 경우 -->
              <img 
                v-else
                :src="selectedPage.media" 
                :alt="selectedPage.name" 
                class="page-media"
                ref="pageMedia"
              >
            </div>
            <div class="page-description">
              <h2 class="page-title">{{ selectedPage.name }}</h2>
              <p v-for="(paragraph, index) in descriptionParagraphs" :key="index" class="page-text">
                {{ paragraph }}
              </p>
            </div>
          </div>
        </transition>
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
const pageMedia = ref(null);

// 페이지 데이터 - 미디어 타입 추가
const pages = ref([
  { 
    id: 'main', 
    name: 'GenieQ 서비스 소개', 
    media: '/videos/genieq_info.mkv',
    mediaType: 'video', // 이미지 타입 명시
    description: 'GenieQ는 교육자를 위한 AI 기반 지문 및 문항 생성 서비스입니다. 수업 자료 준비에 소요되는 시간을 대폭 줄여주며, 맞춤형 학습 자료를 쉽고 빠르게 제작할 수 있습니다.\n\n티켓 기반 시스템으로 필요한 만큼만 이용할 수 있어 경제적이며, 생성된 모든 자료는 보관함에 저장되어 언제든지 재사용할 수 있습니다.' 
  },
  { 
    id: 'passage', 
    name: '지문 생성/관리 페이지', 
    media: '/videos/passage_generate.mkv', // 동영상 경로로 변경
    mediaType: 'video', // 동영상 타입 명시
    description: '지문 생성 페이지에서는 다양한 분야(인문, 예술, 사회, 과학, 기술)와 제재를 선택하여 AI가 맞춤형 지문을 생성합니다. 교육 목적에 맞는 지문을 몇 번의 클릭만으로 얻을 수 있어 수업 준비 시간을 획기적으로 단축할 수 있습니다.\n\n생성된 지문 페이지에서는 AI가 생성한 지문의 내용을 확인하고 편집할 수 있습니다. 지문의 핵심 논점이 자동으로 추출되어 함께 표시되며, 필요에 따라 내용을 수정하거나 다양한 포맷(PDF, Word, TXT)으로 추출할 수 있습니다.' 
  },
  { 
    id: 'question', 
    name: '문항 생성/관리 페이지', 
    media: '/videos/question_generate.mkv',
    mediaType: 'video',
    description: 'AI가 생성한 지문이나 직접 작성한 텍스트를 기반으로 문항을 자동 생성할 수 있습니다. 다양한 유형의 객관식 문제를 생성할 수 있으며, 지문의 핵심 내용을 정확히 이해하고 적절한 난이도의 문항을 제시합니다.\n\n생성된 문항 페이지에서는 AI가 만든 문항들을 확인하고 수정할 수 있습니다. 각 문항에는 정답과 해설이 함께 제공되어 교육적 가치를 높입니다. 필요한 경우 추가 문항을 생성하거나 기존 문항을 편집할 수 있습니다.' 
  },
  { 
    id: 'storage', 
    name: '보관함 페이지', 
    media: '/videos/storage.mkv', // 동영상 경로로 변경
    mediaType: 'video', // 동영상 타입 명시
    description: '보관함에서는 생성한 모든 지문과 문항을 체계적으로 저장하고 관리할 수 있습니다.\n\n최근 작업 내역과 즐겨찾기 기능을 통해 자주 사용하는 자료에 빠르게 접근할 수 있으며, 다양한 포맷으로 자료를 추출하여 수업에 활용할 수 있습니다.\n\n최대 150개까지 작업을 저장할 수 있으며, 중요한 자료는 즐겨찾기로 표시하여 별도로 관리할 수 있습니다.' 
  },
]);

const activePage = ref('main');
const selectedPage = computed(() => {
  return pages.value.find(page => page.id === activePage.value);
});

// 설명 단락을 배열로 변환하여 반환하는 computed 속성
const descriptionParagraphs = computed(() => {
  if (!selectedPage.value) return [];
  return selectedPage.value.description.split('\n\n');
});

// 미디어 프리로딩 함수 (이미지와 동영상 모두 지원)
const preloadMedia = () => {
  console.log('[1] 미디어 프리로딩 시작');
  
  pages.value.forEach(page => {
    if (page.mediaType === 'image') {
      // 이미지 프리로딩
      const img = new Image();
      img.src = page.media;
      img.onload = () => {
        console.log(`[2] 이미지 로드 완료: ${page.media}`);
      };
    } else if (page.mediaType === 'video') {
      // 동영상 프리로딩
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      video.src = page.media;
      
      video.onloadeddata = () => {
        console.log(`[3] 동영상 로드 완료: ${page.media}`);
      };
      
      video.onerror = (e) => {
        console.error(`[4] 동영상 로드 실패: ${page.media}`, e);
      };
    }
  });
};

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
    
    // 미디어 프리로딩 실행
    preloadMedia();
  } catch (error) {
    console.error('[5] 팀 데이터 로드 오류:', error);
    teams.value = [];
  }
});

// 페이지 선택 시 동영상 처리
const selectPage = (pageId) => {
  activePage.value = pageId;
  
  // nextTick을 사용하여 DOM이 업데이트된 후 비디오 요소에 접근
  setTimeout(() => {
    const selectedPageData = pages.value.find(page => page.id === pageId);
    if (selectedPageData && selectedPageData.mediaType === 'video') {
      // video 요소 찾기
      const videoElement = document.querySelector(`.media-container video[src="${selectedPageData.media}"]`);
      if (videoElement) {
        // 동영상 재생 시작
        videoElement.currentTime = 0; // 처음부터 재생
        videoElement.play().catch(err => {
          console.error('[6] 동영상 자동 재생 오류:', err);
        });
        
        console.log(`[7] 동영상 재생 시작: ${selectedPageData.media}`);
      }
    }
  }, 100); // DOM 업데이트를 위한 짧은 지연
};

// 현재 활성화된 팀 확인
const isTeamActive = (teamId) => {
  return route.params.teamId === teamId;
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
  font-size: 36px;
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
  min-height: 500px; /* 최소 높이 설정하여 크기 변화 방지 */
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

/* 이미지와 비디오를 위한 공통 컨테이너 */
.media-container {
  width: 100%;
  max-width: 800px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  aspect-ratio: 16 / 9; /* 미디어 비율 고정 */
}

/* 이미지와 비디오를 위한 공통 스타일 */
.page-media {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover; /* 비율 유지 */
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
  margin-bottom: 16px;
}

/* 페이지 전환 애니메이션 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
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
  
  .highlight-q {
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