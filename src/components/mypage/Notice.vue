<template>
    <div class="notice-container">
      <!-- 제목 -->
      <h2 class="notice-title">공지사항</h2>
  
      <!-- 상단 필터 -->
      <div class="sub-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          @click="changeTab(tab.value)"
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
        <button v-if="totalPages > 5" @click="prevPage" :disabled="currentPage === 1"><</button>
        
        <span
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="{ 'active-page': currentPage === page }">
            {{ page }}
        </span>
        
        <button v-if="totalPages > 5" @click="nextPage" :disabled="currentPage === totalPages">></button>
        <button @click="lastPage" :disabled="currentPage === totalPages">»</button>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  
  /* 공지사항 필터 */
  const tabs = [
    { label: "전체", value: "all" },
    { label: "서비스", value: "service" },
    { label: "작업", value: "job" }
  ];
  
  /* 현재 선택된 탭 */
  const selectedTab = ref("all");
  
  /* 공지사항 데이터 */
  const notices = ref([]);
for (let i = 1; i <= 60; i++) {
  notices.value.push({
    NOT_CODE: i,
    NOT_TYPE: i % 2 === 0 ? "서비스" : "작업",
    NOT_TITLE: `공지사항 제목 ${i}`,  
    NOT_DATE: `2024-03-${String(31 - i).padStart(2, '0')}` 
  });
}

  
/* 필터링된 공지사항 목록 */
const filteredNotices = computed(() => {
    if (selectedTab.value === "all") return notices.value;
    return notices.value.filter(n => n.NOT_TYPE === (selectedTab.value === "service" ? "서비스" : "작업"));
});


/* 페이지네이션 */
const currentPage = ref(1);
const itemsPerPage = 10; 
const maxVisiblePages = 5; 

/* 총 페이지 수 */
const totalPages = computed(() => Math.ceil(filteredNotices.value.length / itemsPerPage));

/* 현재 페이지에 맞는 데이터 */
const paginatedNotices = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredNotices.value.slice(start, start + itemsPerPage);
});


/*  표시할 페이지 목록 */
const visiblePages = computed(() => {
    const total = totalPages.value;
    const startPage = Math.floor((currentPage.value - 1) / maxVisiblePages) * maxVisiblePages + 1;
    const endPage = Math.min(startPage + maxVisiblePages - 1, total);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

/* 페이지 변경 함수 */
const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

/* 이전 페이지 이동 (한 칸 이동) */
const prevPage = () => {
    let page = currentPage.value - 1;  

    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page; 
    } else {
        currentPage.value = Math.min(1, totalPages.value); 
    }
};


/* 다음 페이지 이동 (한 칸 이동) */
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

/* 마지막 페이지 이동 */
const lastPage = () => {
    currentPage.value = totalPages.value;
};

const changeTab = (tab) => {
    selectedTab.value = tab;
    currentPage.value = 1; 
};

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
  left: 130px; 
 
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
    margin-left: 130px; 
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
    transition: all 0.3s ease;
    
}

/* 선택된 필터 버튼 */
.sub-tabs .active-tab {
    background-color: #303030; 
    color: #FFFFFF; 
    font-weight: bold;
}
  
 /* 테이블 위쪽 선 스타일 */
.table-wrapper {
  width: 1472px; 
  height: 480px; 
  margin: 0 auto;
  margin-left: 130px; 
  margin-top: 4px;
  background: #FFFFFF;
  border: 1px solid #ddd;
  overflow: hidden;
  border-top: 3px solid #424242; 
}

/* 테이블 기본 스타일 */
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

/* 분류 컬럼*/
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
    text-align: center;
    padding: 8px;
    gap: 8px;

    width: 120px;
    height: 44px;
}

/* 제목컬럼*/
th:nth-child(2) {
    flex-direction: row;
    align-items: center;
    text-align: left;
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

/* 등록일컬럼 */
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

  
  /* 페이지네이션 */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center; 
    width: 100%; 
    margin-top: 20px;
    margin-left: 150px;
    gap: 8px; 
}

.pagination span {
    display: inline-block;
    min-width: 26px; 
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    user-select: none; 
    outline: none; 
}

  .pagination button {
    border: none;
    background: none;
    padding: 5px 10px;
    font-size: 14px;
  }
  
  .pagination button:hover {
    font-weight: bold;
  }

  .active-page {
    color: #FF9F40;
    text-decoration: underline;
  }

  /* 모든 요소에서 클릭 후 포커스(깜박거리는 커서) 제거 */
* {
    outline: none !important; 
    user-select: none !important; 
    -webkit-user-select: none !important; 
    -moz-user-select: none !important; 
    -ms-user-select: none !important; 
}

/* 버튼, 링크, 페이지네이션, 필터 버튼 클릭 시 포커스 제거 */
button, a, span, input, select, textarea {
    outline: none !important;
    box-shadow: none !important;
    border: none;
    background: none;
}

</style>