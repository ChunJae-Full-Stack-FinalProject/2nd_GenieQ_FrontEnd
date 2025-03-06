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
            <tr v-for="notice in paginatedNotices" :key="notice.id">
              <td>{{ notice.category }}</td>
              <td>{{ notice.title }}</td>
              <td>{{ notice.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- 페이지네이션 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">◀</button>
        <span 
          v-for="page in totalPages" 
          :key="page" 
          @click="changePage(page)"
          :class="{ 'active-page': currentPage === page }">
          {{ page }}
        </span>
        <button @click="nextPage" :disabled="currentPage === totalPages">▶</button>
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
    { id: 1, category: "서비스", title: "지니큐 베타서비스 런칭 안내", date: "2024-03-06" },
    { id: 2, category: "작업", title: "1차 서버 점검 안내", date: "2024-03-05" },
    { id: 3, category: "작업", title: "네트워크 점검 작업 안내 (3/3)", date: "2024-03-03" },
    { id: 4, category: "작업", title: "네트워크 점검 작업 안내 (3/3)", date: "2024-03-03" },
    { id: 5, category: "작업", title: "네트워크 점검 작업 안내 (3/3)", date: "2024-03-03" },
    { id: 6, category: "작업", title: "Global Edge 개선 작업 안내 (2/26)", date: "2024-02-26" },
    { id: 7, category: "서비스", title: "개인정보보호방침 개정 안내", date: "2024-02-25" },
    { id: 8, category: "작업", title: "네트워크 점검 작업 안내 (3/3)", date: "2024-03-03" },
    { id: 9, category: "서비스", title: "지니큐 서비스 이용약관 개정 안내", date: "2024-02-24" }
  ]);
  
  /* ✅ 필터링된 공지사항 목록 */
  const filteredNotices = computed(() => {
    if (selectedTab.value === "all") return notices.value;
    return notices.value.filter(n => n.category.toLowerCase() === selectedTab.value);
  });
  
  /* ✅ 페이지네이션 */
  const currentPage = ref(1);
  const itemsPerPage = 5;
  
  /* ✅ 총 페이지 수 */
  const totalPages = computed(() => Math.ceil(filteredNotices.value.length / itemsPerPage));
  
  /* ✅ 현재 페이지에 맞는 데이터 */
  const paginatedNotices = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredNotices.value.slice(start, start + itemsPerPage);
  });
  
  /* ✅ 페이지 변경 함수 */
  const changePage = (page) => { currentPage.value = page; };
  const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
  const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
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
  