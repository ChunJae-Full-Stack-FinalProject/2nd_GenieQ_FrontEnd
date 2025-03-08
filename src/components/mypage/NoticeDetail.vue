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
            <th>서비스</th>
            <th>{{ noticeDetails ? noticeDetails.NOT_TITLE : '자나감 베리베이션 판매 안내' }}</th>
            <th class="date-column">{{ noticeDetails ? noticeDetails.NOT_DATE : '등록일: YYYY-MM-DD' }}</th>
          </tr>
        </table>
      </div>
      
      <div class="notice-content" v-if="noticeDetails">
        <p>{{ noticeDetails.NOT_CONTENT }}</p>
      </div>

      <div class="notice-actions">
        <a @click="backToNoticeList" class="back-button">목록으로</a>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MyPageContent from '@/components/mypage/MyPageContent.vue';

const route = useRoute();
const router = useRouter();
const noticeId = parseInt(route.params.id);
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

/* 공지사항 목록으로 돌아가기 */
const backToNoticeList = () => {
  isNoticeDetailVisible.value = false;
  router.push("/mypage?tab=공지사항");
};

onMounted(() => {
  fetchNoticeDetails();
});

const fetchNoticeDetails = () => {
  setTimeout(() => {
    noticeDetails.value = {
      NOT_CODE: noticeId,
      NOT_TYPE: "서비스",
      NOT_TITLE: "자나감 베리베이션 판매 안내",
      NOT_DATE: "2024-03-04",
      NOT_CONTENT: `안녕하세요, 지니큐 운영팀 감자입니다.
        지니큐을 이용해 주셔서 감사합니다. 또 봐요🥔✌️

        공지글 확인용 id(숫자) = ${noticeId} 번째 공지.` 
    };
  });
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
  position: absolute;
  font-weight: 700;
  font-size: 24px;
  line-height: 150%;
  letter-spacing: -0.02em;
  color: #303030;
  left: 40px; /* 왼쪽 간격 유지 */
  top: 40px;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 15.5px;
  line-height: 150%;

  letter-spacing: -0.02em;

  color: #303030;
}

/* 상단 탭 메뉴 */
.tab-menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 180px; 
  gap: 40px; 
  position: absolute;
  width: auto;
  height: 50px;
  top: 131px;
}

/* 기본 탭 스타일 */
.tab-menu span {
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-size: 12.9167px;
  line-height: 150%;

  letter-spacing: -0.02em;

  color: #303030;

  flex: none;
  order: 0;
  flex-grow: 0;

}

/* 선택된 탭 스타일 (볼드 + 밑줄) */
.active-tab {
  border-bottom: 2px solid #FF9F40;
  font-weight: bold !important;
}


 /* 공지글 부분 .. */
.notice-detail-container {
    position: absolute;
    width: 1472px; /*  표 크기 맞춤 */
    /* padding: 20px; */
    display: flex;
    flex-direction: column;
    left:306.4px;
    top:212px;
}

 /* 공지사항 제목 */
.notice-title {
    position: relative;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 150%;
    letter-spacing: -0.02em;
    margin-bottom: 20px;

    color: #000000;
}

.notice-table {
  width: 100%;
  /* height: 150px; */
  border-collapse: collapse;
  table-layout: fixed;
 
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
}

.notice-table th:last-child {
  text-align: right;
  width: 180px;
  color: #424242;
  font-size: 16px;
  
}

.notice-content {
  min-height: 50px;
  height: 530px;
  padding: 20px 10px;
  line-height: 1.6;
  color: #424242;
  border-bottom: 1px solid #ddd;
  white-space: pre-line;
  background-color: #FFFFFF;
}

.notice-content p {
  margin: 0 0 5px 0;
}

.notice-actions {
  text-align: center;
  margin-top: 20px;
}

.back-button {
  display: inline-block;
  background-color: #f8f8f8;
  width: 20%;
  color: #424242;
  padding: 8px 20px;
  border: 1px solid #ddd;
  text-decoration: none;
  border-radius: 8px;
  font-size: 20px;
}

.back-button:hover {
  background-color: #eee;
}

.date-column {
  font-size: 14px;
  color: #666;
}

</style>

