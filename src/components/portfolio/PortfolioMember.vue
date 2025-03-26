<template>
  <div v-if="member" class="portfolio-member">
    <div class="back-button" @click="goBack">
      <Icon icon="ep:arrow-left-bold" width="18" height="18" />
      <span>팀 목록으로 돌아가기</span>
    </div>
    
    <div class="member-profile">
      <div class="profile-header">
        <div class="member-avatar">
          <img :src="getMemberImage(member)" :alt="member.name" class="avatar-image">
        </div>
        <div class="member-header-info">
          <h2 class="member-name">{{ member.name }}</h2>
          <p class="member-role">{{ member.role }} @ {{ team?.name }}</p>
        </div>
      </div>
      
      <div class="member-details">
        <div class="detail-section">
          <h3 class="section-title">소개</h3>
          <p class="member-bio">{{ member.bio }}</p>
        </div>
        
        <div class="detail-section">
          <h3 class="section-title">담당 역할</h3>
          <div class="responsibilities-list">
            <div 
              v-for="(responsibility, index) in member.responsibilities" 
              :key="index" 
              class="responsibility-item"
            >
              <div class="responsibility-bullet">
                <Icon icon="ant-design:check-circle-filled" class="check-icon" width="16" height="16" />
              </div>
              <span>{{ responsibility }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="member.links && member.links.length > 0" class="detail-section">
          <h3 class="section-title">링크</h3>
          <div class="links-list">
            <a 
              v-for="(link, index) in member.links" 
              :key="index" 
              :href="link.url" 
              target="_blank"
              rel="noopener noreferrer"
              class="member-link"
            >
              <Icon v-if="link.type === 'github'" icon="mdi:github" class="link-icon" width="20" height="20" />
              <Icon v-else-if="link.type === 'linkedin'" icon="mdi:linkedin" class="link-icon" width="20" height="20" />
              <Icon v-else-if="link.type === 'blog'" icon="mdi:notebook" class="link-icon" width="20" height="20" />
              <Icon v-else-if="link.type === 'website'" icon="mdi:web" class="link-icon" width="20" height="20" />
              <Icon v-else icon="mdi:link-variant" class="link-icon" width="20" height="20" />
              <span>{{ getLinkText(link) }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading-container">
    <p>멤버 정보를 불러오는 중입니다...</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import portfolioData from '@/assets/data/portfolio-data.json';

const route = useRoute();
const router = useRouter();
const member = ref(null);
const team = ref(null);

// 멤버 정보 로드
const loadMemberData = () => {
  const { teamId, memberId } = route.params;
  
  try {
    // 팀 정보 찾기
    const foundTeam = portfolioData.teams.find(t => t.id === teamId);
    
    if (foundTeam) {
      team.value = foundTeam;
      
      // 멤버 정보 찾기
      const foundMember = foundTeam.members.find(m => m.id === memberId);
      
      if (foundMember) {
        member.value = foundMember;
      } else {
        member.value = null;
      }
    } else {
      team.value = null;
      member.value = null;
    }
  } catch (error) {
    member.value = null;
  }
};

// 링크 텍스트 가져오기
const getLinkText = (link) => {
  switch (link.type) {
    case 'github':
      return 'GitHub';
    case 'linkedin':
      return 'LinkedIn';
    case 'blog':
      return '블로그';
    case 'website':
      return '웹사이트';
    default:
      return link.url.replace(/^https?:\/\//, '');
  }
};

// 멤버 이미지 URL 가져오기
const getMemberImage = (member) => {
  // GitHub 이미지인 경우 그대로 사용, 기본 이미지는 로컬 경로로 변환
  if (member.image.includes('github.com')) {
    return member.image;
  }
  return `/src/assets/images/${member.image}`;
};

// 이전 페이지로 돌아가기
const goBack = () => {
  router.push({
    name: 'portfolioTeam',
    params: { teamId: route.params.teamId }
  });
};

// 경로 파라미터 변경 시 데이터 다시 로드
watch(() => route.params, () => {
  loadMemberData();
}, { deep: true });

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadMemberData();
});
</script>

<style scoped>
.portfolio-member {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #757575;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 16px;
  transition: color 0.3s ease;
  font-weight: 500;
  width: fit-content;
}

.back-button:hover {
  color: #FF9F40;
}

.member-profile {
  background-color: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 30px;
  background-color: #FFEDDC;
  gap: 24px;
}

.member-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #FFFFFF;
  box-shadow: 0 4px 12px rgba(255, 159, 64, 0.2);
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-header-info {
  flex: 1;
}

.member-name {
  font-size: 32px;
  font-weight: 700;
  color: #303030;
  margin: 0 0 8px 0;
}

.member-role {
  font-size: 18px;
  color: #FF9F40;
  font-weight: 500;
  margin: 0;
}

.member-details {
  padding: 30px;
}

.detail-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #303030;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #FFEDDC;
}

.member-bio {
  font-size: 16px;
  line-height: 1.6;
  color: #424242;
  margin: 0;
}

.responsibilities-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.responsibility-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.responsibility-bullet {
  color: #FF9F40;
  flex-shrink: 0;
  margin-top: 2px;
}

.links-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.member-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #F6F6F6;
  color: #424242;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.member-link:hover {
  background-color: #FFEDDC;
  color: #FF9F40;
  transform: translateY(-2px);
}

.link-icon {
  color: #FF9F40;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #757575;
}

/* 모바일 반응형 스타일 */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .member-avatar {
    margin-bottom: 16px;
  }
  
  .member-details {
    padding: 20px;
  }
  
  .member-name {
    font-size: 24px;
  }
  
  .member-role {
    font-size: 16px;
  }
}
</style>