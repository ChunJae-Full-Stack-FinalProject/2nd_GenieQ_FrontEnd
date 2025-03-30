<template>
  <transition name="page-fade" mode="out-in">
    <div v-if="team" class="portfolio-team" :key="team.id">
      <div class="team-info">
        <h2 class="team-name">{{ team.name }}</h2>
        <p class="team-description">{{ team.description }}</p>
      </div>

      <div class="members-grid">
        <div v-for="member in team.members" :key="member.id" class="member-card" @click="goToMemberDetail(member.id)">
          <div class="member-avatar">
            <img :src="getMemberImage(member)" :alt="member.name" class="avatar-image">
          </div>
          <div class="member-info">
            <div class="name-role-container">
              <h3 class="member-name">{{ member.name }}</h3>
              <span v-if="member.role === '팀장'" class="role-badge">팀장</span>
            </div>
            <div class="member-responsibilities">
              <!-- 첫 번째 줄: 최대 2개 책임 표시 -->
              <div class="responsibility-line">
                <span v-for="(responsibility, index) in getFirstLineResponsibilities(member)" :key="'line1-' + index"
                  class="responsibility-tag">
                  {{ responsibility }}
                </span>
              </div>
              <!-- 두 번째 줄: 3~4번째 책임 표시 -->
              <div class="responsibility-line" v-if="getSecondLineResponsibilities(member).length > 0">
                <span v-for="(responsibility, index) in getSecondLineResponsibilities(member)" :key="'line2-' + index"
                  class="responsibility-tag">
                  {{ responsibility }}
                </span>
                <!-- 나머지 책임이 있으면 +n 표시 -->
                <span v-if="member.responsibilities.length > 4" class="more-tag">
                  +{{ member.responsibilities.length - 4 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading-container" :key="'loading'">
      <p>팀 정보를 불러오는 중입니다...</p>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import portfolioData from '@/assets/data/portfolio-data.json';

const route = useRoute();
const router = useRouter();
const team = ref(null);

// 로그 메시지 - 컴포넌트 마운트 시
// console.log('[1] PortfolioTeam 컴포넌트 마운트');

// 팀 정보 로드
const loadTeamData = () => {
  const teamId = route.params.teamId;
  
  // console.log(`[2] 팀 데이터 로드 시작: teamId = ${teamId}`);
  
  try {
    const foundTeam = portfolioData.teams.find(t => t.id === teamId);
    if (foundTeam) {
      // 팀 데이터 로드 성공 시 로그
      // console.log(`[3] 팀 데이터 로드 성공: ${foundTeam.name}, 멤버 수: ${foundTeam.members.length}`);
      team.value = foundTeam;
    } else {
      // 팀 데이터를 찾지 못했을 때 로그
      // console.warn(`[4] 팀 데이터를 찾을 수 없음: ${teamId}`);
      team.value = null;
    }
  } catch (error) {
    // 에러 로그
    // console.error('[5] 팀 데이터 로드 오류:', error);
    team.value = null;
  }
};

// 첫 번째 줄(1-2번째)의 책임 가져오기
const getFirstLineResponsibilities = (member) => {
  return member.responsibilities.slice(0, 2);
};

// 두 번째 줄(3-4번째)의 책임 가져오기
const getSecondLineResponsibilities = (member) => {
  return member.responsibilities.slice(2, 4);
};

// 경로 파라미터 변경 시 데이터 다시 로드
watch(() => route.params.teamId, (newTeamId, oldTeamId) => {
  // 팀 ID 변경 감지 로그
  // console.log(`[6] 팀 ID 변경 감지: ${oldTeamId} -> ${newTeamId}`);
  loadTeamData();
});

// 멤버 상세 페이지로 이동
const goToMemberDetail = (memberId) => {
  // 멤버 상세 페이지 이동 로그
  // console.log(`[7] 멤버 상세 페이지로 이동: teamId = ${route.params.teamId}, memberId = ${memberId}`);
  
  router.push({
    name: 'portfolioMember',
    params: {
      teamId: route.params.teamId,
      memberId: memberId
    }
  });
};

// 멤버 이미지 URL 가져오기
const getMemberImage = (member) => {
  // GitHub 이미지인 경우 그대로 사용, 기본 이미지는 로컬 경로로 변환
  if (member.image.includes('github.com')) {
    return member.image;
  }
  return `/src/assets/images/${member.image}`;
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadTeamData();
});
</script>

<style scoped>
.portfolio-team {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.team-info {
  margin-bottom: 10px;
  text-align: center;
}

.team-name {
  font-size: 28px;
  font-weight: 700;
  color: #303030;
  margin-bottom: 12px;
}

.team-description {
  font-size: 16px;
  color: #757575;
  line-height: 1.5;
  max-width: 800px;
  margin: 0 auto;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  justify-content: center;
}

.member-card {
  display: flex;
  background-color: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 20px;
  border: 1px solid #EEEEEE;
}

.member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #FFEDDC;
}

.member-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px;
  flex-shrink: 0;
  border: 3px solid #FFEDDC;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.name-role-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.member-name {
  font-size: 18px;
  font-weight: 600;
  color: #303030;
  margin: 0;
}

.role-badge {
  background-color: #FF9F40;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.member-responsibilities {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.responsibility-line {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.responsibility-tag {
  display: inline-block;
  background-color: #FFEDDC;
  color: #FF9F40;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
}

.more-tag {
  display: inline-block;
  background-color: #F0F0F0;
  color: #757575;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #757575;
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
  .members-grid {
    grid-template-columns: 1fr;
  }

  .member-card {
    max-width: 100%;
  }

  .team-name {
    font-size: 24px;
  }
}
</style>