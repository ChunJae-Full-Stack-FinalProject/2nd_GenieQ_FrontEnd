<template>
    <div class="notice-container">
      <!-- 제목 -->
      <h2 class="notice-title">공지사항</h2>
  
      <!-- 상단 필터 -->
      <div class="sub-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          @click="selectedTab = tab.value"
          :class="{ 'active-tab': selectedTab === tab.value }">
          {{ tab.label }}
        </button>
      </div>
  
      <!-- 공지사항 목록 -->
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>분류</th>
              <th>제목</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="notice in paginatedNotices" :key="notice.NOT_CODE">
              <td>{{ notice.NOT_TYPE }}</td>
              <td>{{ notice.NOT_TITLE }}</td>
              <td>{{ notice.NOT_DATE }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- 페이지네이션 -->
      <div class="pagination">
        <button @click="firstPage" :disabled="currentPage === 1">«</button>
        <button @click="prevPageGroup" :disabled="currentPage === 1"><</button>
        
        <span
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="{ 'active-page': currentPage === page }">
            {{ page }}
        </span>
        
        <button @click="nextPageGroup" :disabled="currentPage === totalPages">></button>
        <button @click="lastPage" :disabled="currentPage === totalPages">»</button>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  
  /* ✅ 공지사항 필터 */
  const tabs = [
    { label: "전체", value: "all" },
    { label: "서비스", value: "service" },
    { label: "작업", value: "job" }
  ];
  
  /* ✅ 현재 선택된 탭 */
  const selectedTab = ref("all");
  
  /* ✅ 공지사항 데이터 */
  const notices = ref([
  { NOT_CODE: 1, NOT_TYPE: "서비스", NOT_TITLE: "지니큐 베타서비스 런칭 안내", NOT_DATE: "2024-03-06" },
  { NOT_CODE: 2, NOT_TYPE: "작업", NOT_TITLE: "1차 서버 점검 안내", NOT_DATE: "2024-03-05" },
  { NOT_CODE: 3, NOT_TYPE: "작업", NOT_TITLE: "네트워크 점검 안내 (3/3)", NOT_DATE: "2024-03-03" },
  { NOT_CODE: 4, NOT_TYPE: "작업", NOT_TITLE: "서버 업데이트 안내", NOT_DATE: "2024-03-01" },
  { NOT_CODE: 5, NOT_TYPE: "서비스", NOT_TITLE: "새로운 기능 추가", NOT_DATE: "2024-02-28" },
  { NOT_CODE: 6, NOT_TYPE: "서비스", NOT_TITLE: "긴급 점검 안내", NOT_DATE: "2024-02-26" },
  { NOT_CODE: 7, NOT_TYPE: "작업", NOT_TITLE: "DB 최적화 작업", NOT_DATE: "2024-02-25" },
  { NOT_CODE: 8, NOT_TYPE: "서비스", NOT_TITLE: "약관 개정 안내", NOT_DATE: "2024-02-20" },
  { NOT_CODE: 9, NOT_TYPE: "서비스", NOT_TITLE: "보안 업데이트 안내", NOT_DATE: "2024-02-15" },
  { NOT_CODE: 10, NOT_TYPE: "작업", NOT_TITLE: "서버 마이그레이션 안내", NOT_DATE: "2024-02-10" },
  { NOT_CODE: 11, NOT_TYPE: "서비스", NOT_TITLE: "신규 서비스 런칭", NOT_DATE: "2024-02-05" },
  { NOT_CODE: 12, NOT_TYPE: "작업", NOT_TITLE: "API 개선 작업", NOT_DATE: "2024-02-01" },
  { NOT_CODE: 13, NOT_TYPE: "서비스", NOT_TITLE: "사용자 인터페이스 개선", NOT_DATE: "2024-01-28" },
  { NOT_CODE: 14, NOT_TYPE: "작업", NOT_TITLE: "백엔드 시스템 업그레이드", NOT_DATE: "2024-01-25" },
  { NOT_CODE: 15, NOT_TYPE: "서비스", NOT_TITLE: "고객지원 채널 확장", NOT_DATE: "2024-01-20" },
  { NOT_CODE: 16, NOT_TYPE: "작업", NOT_TITLE: "서버 유지보수 작업", NOT_DATE: "2024-01-15" },
  { NOT_CODE: 17, NOT_TYPE: "서비스", NOT_TITLE: "이메일 인증 시스템 업데이트", NOT_DATE: "2024-01-10" },
  { NOT_CODE: 18, NOT_TYPE: "작업", NOT_TITLE: "데이터 마이그레이션", NOT_DATE: "2024-01-05" },
  { NOT_CODE: 19, NOT_TYPE: "서비스", NOT_TITLE: "알림 기능 추가", NOT_DATE: "2023-12-30" },
  { NOT_CODE: 20, NOT_TYPE: "작업", NOT_TITLE: "보안 패치 적용", NOT_DATE: "2023-12-25" },
  { NOT_CODE: 21, NOT_TYPE: "서비스", NOT_TITLE: "모바일 최적화 업데이트", NOT_DATE: "2023-12-20" },
  { NOT_CODE: 22, NOT_TYPE: "작업", NOT_TITLE: "로그 시스템 개선", NOT_DATE: "2023-12-15" },
  { NOT_CODE: 23, NOT_TYPE: "서비스", NOT_TITLE: "AI 추천 시스템 도입", NOT_DATE: "2023-12-10" },
  { NOT_CODE: 24, NOT_TYPE: "작업", NOT_TITLE: "네트워크 안정화 작업", NOT_DATE: "2023-12-05" },
  { NOT_CODE: 25, NOT_TYPE: "서비스", NOT_TITLE: "UX/UI 디자인 개편", NOT_DATE: "2023-12-01" },
  { NOT_CODE: 26, NOT_TYPE: "작업", NOT_TITLE: "DB 확장 작업", NOT_DATE: "2023-11-25" },
  { NOT_CODE: 27, NOT_TYPE: "서비스", NOT_TITLE: "다크 모드 기능 추가", NOT_DATE: "2023-11-20" },
  { NOT_CODE: 28, NOT_TYPE: "작업", NOT_TITLE: "성능 최적화 작업", NOT_DATE: "2023-11-15" },
  { NOT_CODE: 29, NOT_TYPE: "서비스", NOT_TITLE: "접근성 향상 업데이트", NOT_DATE: "2023-11-10" },
  { NOT_CODE: 30, NOT_TYPE: "작업", NOT_TITLE: "백업 및 복구 시스템 강화", NOT_DATE: "2023-11-05" }
]);


  
  /* ✅ 필터링된 공지사항 목록 */
  const filteredNotices = computed(() => {
    if (selectedTab.value === "all") return notices.value;
    return notices.value.filter(n => n.NOT_TYPE.toLowerCase() === selectedTab.value);
  });
  
  /* ✅ 페이지네이션 */
const currentPage = ref(1);
const itemsPerPage = 10;

/* ✅ 총 페이지 수 */
const totalPages = computed(() => Math.ceil(filteredNotices.value.length / itemsPerPage));

/* ✅ 현재 페이지에 맞는 데이터 */
const paginatedNotices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredNotices.value.slice(start, start + itemsPerPage);
});

/* ✅ 페이지네이션 로직 */
    const maxVisiblePages = 5;

/* ✅ 표시할 페이지 목록 */
    const visiblePages = computed(() => {
    const startPage = Math.floor((currentPage.value - 1) / maxVisiblePages) * maxVisiblePages + 1;
    return Array.from({ length: maxVisiblePages }, (_, i) => startPage + i).filter(page => page <= totalPages.value);
    });

/* ✅ 페이지 변경 함수 */
    const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
    };

    /* ✅ 이전 페이지 그룹 이동 */
    const prevPageGroup = () => {
    if (currentPage.value > 1) {
        const prevGroupStart = Math.max(1, currentPage.value - maxVisiblePages);
        currentPage.value = prevGroupStart;
    }
    };

    /* ✅ 다음 페이지 그룹 이동 */
    const nextPageGroup = () => {
    if (currentPage.value + maxVisiblePages <= totalPages.value) {
        const nextGroupStart = Math.min(totalPages.value, currentPage.value + maxVisiblePages);
        currentPage.value = nextGroupStart;
    }
    };

    /* ✅ 첫 페이지 이동 */
    const firstPage = () => { currentPage.value = 1; };

    /* ✅ 마지막 페이지 이동 */
    const lastPage = () => { currentPage.value = totalPages.value; };
  </script>
  
  <style scoped>
  /* 공지사항 컨테이너 */
  .notice-container {
    width: 1472px; /*  표 크기 맞춤 */
    margin: 0 auto; /*  중앙 정렬 */
    padding: 20px;
  }
  
  /* 공지사항 제목 */
  .notice-title {
  position: relative;
  top: 10px; 
  left: 150px; 
 
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 15.5px;
    line-height: 150%;
    letter-spacing: -0.02em;

    color: #000000;
}
  
/* 공지사항 필터 버튼 */
.sub-tabs {
    display: flex;
    gap: 16px;
    padding-bottom: 10px;
    margin-top: 30px; 
    margin-left: 160px; 
}

/* 기본 버튼 스타일 */
.sub-tabs button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 16px;
    gap: 8px;

    width: 60px; /* 버튼 크기 조정 */
    height: 40px;

    font-family: 'Pretendard'; /* 폰트 적용 */
    font-style: normal;
    font-weight: 700;
    font-size: 10.3333px;
    line-height: 150%; /* or 15px */
    color: #303030; /* 기본 폰트 색상 */
    
    background: none;
    border: none;
    border-radius: 24px; /* 버튼 둥글게 */
    cursor: pointer;
    transition: all 0.3s ease;
    
}

/* 선택된 필터 버튼 (검은색 배경 + 흰색 글씨) */
.sub-tabs .active-tab {
    background-color: #303030; /* 🔹 검정색 배경 */
    color: #FFFFFF; /* 🔹 흰색 글씨 */
    font-weight: bold;
}
  
 /* ✅ 테이블 위쪽 선 스타일 (진한 회색 + 3px 두께) */
.table-wrapper {
  width: 1472px; /* 표 크기 맞춤 */
  height: 480px; /* 표 높이 맞춤 */
  margin: 0 auto;
  margin-left: 150px; 
  margin-top: 4px;
  background: #FFFFFF;
  border: 1px solid #ddd;
  overflow: hidden;
  border-top: 3px solid #424242; /* 🔹 진한 회색 + 3px */
}

/* ✅ 테이블 기본 스타일 */
table {
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;

    width: 1472px;
    height: 480px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}

thead>tr {
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 36px;
    gap: 120px;

    width: 1472px;
    height: 40px;

    background: #E1E1E1;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}

tr {
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 36px;
    gap: 120px;

    width: 1472px;
    height: 44px;

    background: #FFFFFF;
    border-top: 1px solid #E1E1E1;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}

/* ✅ "분류" 컬럼 간격 */
th:nth-child(1) {
    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 120px;
    height: 40px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;
}
td:nth-child(1) {

    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 120px;
    height: 44px;
}

/* ✅ "제목" 컬럼 간격 */
th:nth-child(2) {
    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 800px;
    height: 40px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;
}
td:nth-child(2) {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 800px;
    height: 44px;
}

/* ✅ "등록일" 컬럼 간격 */
th:nth-child(3) {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 240px;
    height: 40px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 150%;

    text-align: right;
    letter-spacing: -0.02em;

    color: #303030;
}
td:nth-child(3) {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 240px;
    height: 44px;

    flex: none;
    order: 2;
    flex-grow: 0;
}

  
  /* ✅ 페이지네이션 */
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .pagination button {
    border: none;
    background: none;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .pagination button:hover {
    font-weight: bold;
  }
  
  .active-page {
    font-weight: bold;
    color: orange;
  }
  </style>
  