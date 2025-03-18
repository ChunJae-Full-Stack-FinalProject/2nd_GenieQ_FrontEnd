<template>
  <!-- 탭 이벤트 감지 및 조건부 렌더링 -->
  <div v-if="isVisible">
    <div class="mypage-header">
      <h2 class="page-title">마이페이지</h2>
      <div class="tab-menu">
        <span 
          v-for="tab in tabs" 
          :key="tab" 
          @click="handleTabClick(tab)" 
          :class="{'active-tab': selectedTab === tab}"
        >
          {{ tab }}
        </span>
      </div>
    </div>
    <MyPageContent v-if="!isNoticeDetailVisible" :selectedTab="selectedTab"/>

    <!-- 공지사항 상세 내용 -->
    <div v-if="isNoticeDetailVisible" class="notice-detail-container">
      <!-- 제목 -->
      <h2 class="notice-title">공지사항</h2>
      
      <div class="notice-header">
        <table class="notice-table">
          <tr>
            <th>{{ noticeDetails?.NOT_TYPE || '서비스' }}</th>
            <th>{{ noticeDetails?.NOT_TITLE || '제목 없음' }}</th>
            <th class="date-column">등록일 : {{ noticeDetails?.NOT_DATE || 'YYYY-MM-DD' }}</th>
          </tr>
        </table>
      </div>
      
      <div class="notice-content" v-if="noticeDetails">
        <p v-for="(line, index) in contentLines" :key="index">
          {{ line }}
        </p>
      </div>

      <div class="notice-actions">
        <a @click="backToNoticeList" class="back-button">목록으로</a>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import MyPageContent from '@/components/mypage/MyPageContent.vue';

// 라우터와 스토어 초기화
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const notCode = parseInt(route.params.id);
const noticeDetails = ref(null);

/* 현재 선택된 탭 (기본값: 공지사항) */
const selectedTab = ref("공지사항");

/* 탭 목록 */
const tabs = ["회원정보", "이용권", "공지사항", "자주 묻는 질문"];

/* 컴포넌트 표시 여부 */
const isVisible = ref(true);
const isNoticeDetailVisible = ref(true);

/* 탭 클릭 핸들러 */
const handleTabClick = (tab) => {
  selectedTab.value = tab;
  
  // 공지사항 탭이 아닌 경우 공지사항 상세 내용 숨김
  if (tab !== "공지사항") {
    isNoticeDetailVisible.value = false;
  } else {
    // 공지사항 탭이면 공지사항 목록으로 이동
    backToNoticeList();
  }
};

// 줄바꿈 기준으로 콘텐츠를 분리
const contentLines = computed(() => {
  if (!noticeDetails.value || !noticeDetails.value.NOT_CONTENT) return [];
  return noticeDetails.value.NOT_CONTENT.split('\\n');
});

/* 공지사항 목록으로 돌아가기 */
const backToNoticeList = () => {
  isNoticeDetailVisible.value = false;
  router.push("/mypage?tab=공지사항");
};

onMounted(() => {
  fetchNoticeDetails();
});

const fetchNoticeDetails = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  fetch(`${apiUrl}/noti/select/each?notCode=${notCode}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) {
      // 인증 오류 처리 (401)
      if (response.status === 401) {
        // (추가) 로그 - 인증 오류 감지
        console.error('인증 오류(401): 로그인이 필요합니다');

        // 인증 상태 초기화
        authStore.user = null;
        authStore.isAuthenticated = false;
        localStorage.removeItem('authUser');

        // 로그인 페이지로 리다이렉트
        router.push({ 
        path: '/login', 
        query: { redirect: route.fullPath }
        });

        // 추가 처리를 중단하기 위한 에러 발생
        throw new Error('인증이 필요합니다');
      }
      return response.text().then(text => { throw new Error(text); });
    }
    return response.json();
  })
  .then(data => {
    console.log('공지사항 데이터 불러오기 성공:', data);

    // 응답 데이터 구조에 맞게 매핑
    noticeDetails.value = {
      NOT_CODE: data.notCode,
      NOT_TYPE: data.type,
      NOT_TITLE: data.title,
      NOT_DATE: data.date,
      NOT_CONTENT: data.content || ''
    };
  })
  .catch(error => {
    console.error('공지사항 데이터 불러오기 실패:', error);
  })
};
</script>
<style scoped>
/* 마이페이지 상단바 전체 스타일 */
.mypage-header {
  position: absolute;
  width: 1764px;
  height: 182px;
  left: 156px;
  top: 0px;
  background: #FFFFFF;
}

/* "마이페이지" 제목 스타일 */
.page-title {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  gap: 8px;

  position: absolute;
  width: 120px;
  height: 48px;
  left: 28px;
  top: 34px;

  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;

  color: #16252D;
}

/* 상단 탭 메뉴 */
.tab-menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;

  position: absolute;
  width: 1764px;
  height: 50px;
  left: 156px;
  top: 131px;
}

/* 기본 탭 스타일 */
.tab-menu span {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  gap: 10px;
  height: 50px;

  font-size: 20px;
  font-weight: 400;
}

/* 선택된 탭 스타일 (볼드 + 밑줄) */
.active-tab {
  font-weight: bold !important;
  border-bottom: 2px solid #FF9F40
}

 /* 공지글 부분 .. */
.notice-detail-container {
    position: absolute;
    width: 1472px; /*  표 크기 맞춤 */
    display: flex;
    flex-direction: column;
    left:306.4px;
    top:212px;
}

 /* 공지사항 제목 */
.notice-title {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 150%;

  margin: 15px 0px 10px 20px;

  letter-spacing: -0.02em;
  color: #000000;
}

.notice-table {
  width: 100%;
  /* height: 150px; */
  border-collapse: collapse;
  table-layout: fixed;
  padding: 20px;
}

.notice-table th {
  padding: 10px;
  text-align: left;
  border-top: 3px solid #424242;
  border-bottom: 1px solid #ddd;
  font-weight: normal;
  background-color: #FFFFFF;
}

.notice-table th:first-child {
  width: 250px;
  padding-left: 35px;
}

.notice-table th:last-child {
  text-align: right;
  width: 200px;
  color: #424242;
  font-size: 16px;
  padding-right: 35px;
}

.notice-content {
  min-height: 50px;
  padding: 18px;
  gap: 8px;
  line-height: 1.6;
  color: #424242;
  border-bottom: 1px solid #ddd;
  background-color: #FFFFFF;
}

.notice-content p {
  padding-left: 26px;
  margin-bottom:5px;

  font-size: 16px;
  font-weight: 400;
  letter-spacing: -0.02em;
  color: #424242;
}

.notice-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px 162px;
  gap: 8px;

  width: 1472px;
  height: 46px;
  margin-bottom: 40px;
}

.back-button {
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  gap: 8px;

  width: 248px;
  height: 46px;

  border: 1px solid #757575;
  border-radius: 8px;
}

.back-button:hover {
  background-color: #eee;
}

.date-column {
  font-size: 14px;
  color: #666;
}

</style>

