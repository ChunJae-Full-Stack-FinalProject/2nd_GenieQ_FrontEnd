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
  font-size: 20px;
  font-weight: bold;
}
  
/* 공지사항 필터 버튼 */
.sub-tabs {
    display: flex;
    gap: 16px;
    padding-bottom: 10px;
    border-bottom: 2px solid #eee;
    margin-top: 30px; 
    margin-left: 160px; 
}

/* 기본 버튼 스타일 */
.sub-tabs button {
    background: none;
    border: none;
    font-size: 16px;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 20px; /* 🔹 모서리 둥글게 */
    transition: all 0.3s ease; /* 🔹 부드러운 애니메이션 효과 */
}

/* 선택된 필터 버튼 (검은색 배경 + 흰색 글씨) */
.sub-tabs .active-tab {
    background-color: #303030; /* 🔹 검정색 배경 */
    color: #FFFFFF; /* 🔹 흰색 글씨 */
    font-weight: bold;
}
  
  /* ✅ 공지사항 테이블 */
  .table-wrapper {
    width: 1472px; /* ✅ 표 크기 맞춤 */
    height: 480px; /* ✅ 표 높이 맞춤 */
    margin: 0 auto; /* 기본 중앙 정렬 */
    margin-left: 150px; /* ✅ 오른쪽으로 200px 이동 */
    background: #FFFFFF;
    border: 1px solid #ddd; /* ✅ 테두리 추가 */
    overflow: hidden; /* ✅ 테두리 안에서 스크롤 발생 방지 */
}
  
  /* ✅ 테이블 기본 스타일 */
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }
  
  th {
    background-color: #f8f8f8;
    font-weight: bold;
    border-bottom: none !important;
  }
  
  /* ✅ tbody 내부 스크롤 */
  tbody {
    display: block;
    overflow-y: auto;
    max-height: 420px; /* ✅ 표 높이에서 헤더 제외한 크기 설정 */
  }
  
  thead, tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
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
  