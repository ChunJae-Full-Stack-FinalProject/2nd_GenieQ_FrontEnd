<template>
  <div class="ticket-container">
    <h2 class="ticket-title">이용권님의 이용권 정보</h2>
    

    <div class="info-section">
      <div class="info-card">
        <div class="info-item">
          <span class="info-label">나의 잔여 이용권</span>
          <span class="info-value">{{ ticketCount }}</span>
          <span class="info-label">회</span>
        </div>
      </div>
      
      <div class="info-card2">
        <div class="info-item" @click="showUsageHistoryModal = true">
          <span class="info-label">이용 내역 조회</span>
            <span class="arrow-icon">›</span>
          </div>
        </div>
      </div>
    
    <!-- 탭 영역 -->
    <div class="purchase-wrapper">
        <div class="tab-section">
          <div class="tab-container">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'usage' }" 
              @click="activeTab = 'usage'"
            >
              이용권 구매
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'history' }" 
              @click="activeTab = 'history'"
            >
              결제 내역 조회
            </button>
          </div>
        </div>
      
         <!-- 콘텐츠 영역 -->
      <div class="purchase-container">
        <!-- 이용권 패키지 영역 -->
        <div v-if="activeTab === 'usage'">
          <div class="packages-section">
            <h3 class="section-title">이용권 패키지</h3>
            
            <div class="package-list">
              <!-- 10회 이용권 -->
              <div class="package-card">
                <div class="package-info">
                  <span class="package-title">지문/문항 생성 10회 이용권</span>
                  <span class="package-price">10,000원</span>
                </div>
                <button class="purchase-btn" @click="openPurchaseWarningModal(10)">구매하기</button>
              </div>
              
              <!-- 50회 이용권 -->
              <div class="package-card">
                <div class="package-info">
                  <span class="package-title">지문/문항 생성 50회 이용권</span>
                  <div class="price-section">
                    <span class="original-price">50,000원</span>
                    <span class="discount-rate">20% 할인</span>
                    <span class="package-price">40,000원</span>
                  </div>
                </div>
                <button class="purchase-btn" @click="openPurchaseWarningModal(50)">구매하기</button>
              </div>
              
              <!-- 100회 이용권 -->
              <div class="package-card">
                <div class="package-info">
                  <span class="package-title">지문/문항 생성 100회 이용권</span>
                  <div class="price-section">
                    <span class="original-price">100,000원</span>
                    <span class="discount-rate">30% 할인</span>
                    <span class="package-price">70,000원</span>
                  </div>
                </div>
                <button class="purchase-btn" @click="openPurchaseWarningModal(100)">구매하기</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 결제 내역 영역 -->
        <div v-else-if="activeTab === 'history'">
          <div class="history-section">
            <div class="history-filter">
              <div class="filter-group">
                <div class="select-container">
                  <select class="filter-select" v-model="selectedPeriod" @change="updateDateRange">
                    <option value="">기간 선택</option>
                    <option value="1">최근 1개월</option>
                    <option value="3">최근 3개월</option>
                    <option value="6">최근 6개월</option>
                    <option value="12">최근 12개월</option>
                  </select>
                </div>
                <div class="date-range">
                  <input type="date" class="date-input" v-model="startDate">
                    <span class="date-separator">-</span>
                  <input type="date" class="date-input" v-model="endDate">
                </div>
                <button class="search-btn" @click="fetchPaymentHistory">검색</button>
              </div>
              <div class="download-group">
                <button class="download-btn">
                  <span>거래내역 다운로드</span>
                  <Icon class="download-icon" icon="ic:baseline-download" width="24" height="24"  style="color: #757575" />
                </button>
              </div>
            </div>
            
            <div class="history-table">
              <table class="data-table">
                <thead>
                  <tr>
                    <th class="column-num">순번</th>
                    <th class="column-title">결제 내역</th>
                    <th class="column-price">금액</th>
                    <th class="column-date">결제 날짜</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in paginatedHistory" :key="item.payCode">
                    <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                    <td>{{ item.payName }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.date }}</td>
                  </tr>
                  <!-- 데이터가 없는 경우 표시할 행 -->
                  <tr v-if="paginatedHistory.length === 0">
                    <td colspan="4" style="text-align: center; padding: 20px;">결제 내역이 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="pagination" v-if="totalPages > 0">
              <button v-if="totalPages > 5" @click="prevPage" :disabled="currentPage === 1">&lt;</button>
              
              <span
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                :class="{ 'active-page': currentPage === page }">
                {{ page }}
              </span>
              
              <button v-if="totalPages > 5" @click="nextPage" :disabled="currentPage === totalPages">&gt;</button>
              <button @click="lastPage" :disabled="currentPage === totalPages">&raquo;</button>
            </div>

          </div>
        </div>
      </div>
    </div>
    <!-- 이용 내역 모달 -->
    <UsageHistoryModal :isOpen="showUsageHistoryModal" @close="showUsageHistoryModal = false" />

    <!-- 구매 경고 모달 -->
    <WarningModalComponent :isOpen="isPurchaseWarningModal" 
      title="이용권을 구매하시겠습니까?" :message="`${purchaseCount}회의 이용권이 충전됩니다.`" 
      cancelText="취소하기" confirmText="구매하기" 
      @close="closeWarningModal" @confirm="purchaseModal"
    />
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import UsageHistoryModal from '@/components/common/modal/type/mypage/UsageHistoryModal.vue';
import WarningModalComponent from '../common/modal/type/WarningModalComponent.vue';

// 라우터와 스토어 초기화
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 모달 상태 관리
const showUsageHistoryModal = ref(false);
const isPurchaseWarningModal = ref(false);

// 활성화된 탭 상태 관리
const activeTab = ref('usage');

// 날짜 관련 상태 관리
const selectedPeriod = ref('');
const startDate = ref('');
const endDate = ref('');

// 페이지네이션 관련 상태 추가
const currentPage = ref(1);
const itemsPerPage = 5;
const maxVisiblePages = 5;

// 임시 결제 내역 데이터 (실제로는 API 요청으로 대체)
const paymentHistory = ref([]);

const fetchPaymentHistory = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
 
  // 날짜가 비어있으면 기본값 설정
  const startDateEncoded = encodeURIComponent(startDate.value || '1970-01-01');
  const endDateEncoded = encodeURIComponent(endDate.value || getTodayFormatted());
  
  fetch(`${apiUrl}/paym/select/list?startDate=${startDateEncoded}&endDate=${endDateEncoded}&page=${currentPage.value}&size=${itemsPerPage}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401) {
        console.error('인증 오류(401): 로그인이 필요합니다');
        router.push({ path: '/login' });
        throw new Error('인증이 필요합니다');
      }
      return response.json().then(text => { throw new Error(text) });
    }
    return response.json();
  })
  .then(data => {
    console.log('결제 내역 데이터:', data);
    paymentHistory.value = data.map(item => ({
    payCode: item.payCode,
    payName: item.payName,
    price: item.price,
    date: item.date
  }));
   
  })
  .catch(error => {
    console.error("결제 내역 조회 오류:", error);
  });
};



// 데이터 초기화 함수
const initializeData = () => {
  for (let i = 1; i <= 60; i++) {
    paymentHistory.value.push({
      id: i,
      title: `지문/문항 생성 ${i % 3 === 0 ? 100 : i % 2 === 0 ? 50 : 10}회 이용권`,
      price: i % 3 === 0 ? '70,000원' : i % 2 === 0 ? '40,000원' : '10,000원',
      date: `2024-03-${String(31 - (i % 30)).padStart(2, '0')}`
    });
  }
};

// 필터링된 내역 계산
const filteredHistory = computed(() => {
  return paymentHistory.value;
});

// 총 페이지 수 계산
const totalPages = computed(() => {
  if (!filteredHistory.value || filteredHistory.value.length === 0) return 1;
  return Math.ceil(filteredHistory.value.length / itemsPerPage);
});

// 페이지네이션된 내역 계산
const paginatedHistory = computed(() => {
  if (!filteredHistory.value || filteredHistory.value.length === 0) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredHistory.value.slice(start, start + itemsPerPage);
});

// 표시할 페이지 배열 계산
const visiblePages = computed(() => {
  const total = totalPages.value;
  if (total <= 1) return [1];
  
  const startPage = Math.max(1, Math.floor((currentPage.value - 1) / maxVisiblePages) * maxVisiblePages + 1);
  const endPage = Math.min(startPage + maxVisiblePages - 1, total);
  
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

// 페이지 변경 함수
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchPaymentHistory();
  }
};

// 이전 페이지 이동
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// 다음 페이지 이동
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 마지막 페이지 이동
const lastPage = () => {
  currentPage.value = totalPages.value;
};

const changeTab = (tab) => {
  selectedTab.value = tab;
  currentPage.value = 1; 
};

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
const getTodayFormatted = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// n개월 전 날짜를 YYYY-MM-DD 형식으로 반환
const getMonthsAgoFormatted = (months) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 선택한 기간에 따라 날짜 범위 업데이트
const updateDateRange = () => {
  if (selectedPeriod.value) {
    const months = parseInt(selectedPeriod.value);
    endDate.value = getTodayFormatted();
    startDate.value = getMonthsAgoFormatted(months);
  }
};

// 구매하기 경고모달 관련 
const purchaseTicket = ref(0);

// ticCode에 따른 이용권 횟수 매핑
const ticketMapping = {
  1: 10,
  2: 50,
  3: 100
};

const openPurchaseWarningModal = (count) => {
   // ticCode로 매핑되도록 수정
  if (count === 10) purchaseTicket.value = 1;
  if (count === 50) purchaseTicket.value = 2;
  if (count === 100) purchaseTicket.value = 3;
  isPurchaseWarningModal.value = true;
};

const purchaseCount = computed(() => {
  return ticketMapping[purchaseTicket.value] || 0;
});

  // 구매확인 함수
  const purchaseModal = () => {
     // 구매 로직 구현할 부분

    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/paym/insert/each`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        ticCode: purchaseTicket.value
      })
    })
    .then(response => {
      console.log("서버 응답 상태 코드:", response.status);
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
      return response.text();
    })
    .then(data => {
      console.log('결제 성공', data);

      // 결제 성공 시 티켓 수 갱신
      getTicketCount(); // 최신 티켓 수 다시 조회
      closeWarningModal(); // 모달 닫기

    })
    .catch(error => {
      console.error('결제 실패:', error);
    });
  };

const closeWarningModal = () => {
  isPurchaseWarningModal.value = false;
}


// 보유 이용권 횟수
const ticketCount = ref("n");

  // 컴포넌트가 마운트될 때 자동으로 티켓 정보 조회
onMounted(() => {
    // 컴포넌트 로드 시 티켓 정보 조회
  getTicketCount();
  fetchPaymentHistory(); // 결제 내역 조회 
});

  // 티켓 정보 조회 함수
function getTicketCount() {
  const apiUrl = import.meta.env.VITE_API_URL;
    // fetch를 사용한 티켓 정보 조회 요청
  fetch(`${apiUrl}/api/info/select/ticket`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include' // 쿠키를 포함시켜 세션 유지
  })
  .then(response => {
    console.log("서버 응답 상태 코드:", response.status);
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
    
      return response.text().then(text => { 
      if (!text) throw new Error('빈 응답');
      return JSON.parse(text); 
    });
    }
    return response.json();
  })
  .then(data => {
    // 티켓 정보 갱신
    console.log("티켓 수량: ", data);
    ticketCount.value = data;
  })
  .catch(error => {
    console.error("티켓 조회 실패:", error);
  });
}

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  endDate.value = getTodayFormatted();
  initializeData();
});
</script>
  
<style scoped>
.ticket-container {
  /* width: 1472px;  */
  width: 100%;
  padding: 20px 30px 80px 20px;
  width: 1472px; 
  position: absolute;
  margin: 0 auto; 
  padding: 20px;
  top: 10px; 
  left: 130px; 
}
.ticket-title {
  position: relative;
  margin-bottom: 20px;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 150%;
  letter-spacing: -0.02em;

  color: #000000;
}
/* 정보 섹션 */
.info-section {
  display: flex;
  width: 1472px; 
  gap: 20px;
  margin-bottom: 20px;
}

.info-card {
  display: flex;
  width: 706px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.info-card2 {
  width: 706px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.info-label {
  font-size: 20px;
  font-weight: 700;
  color: #303030;
}

.info-value {
  font-size: 20px;
  font-weight: 700;
  margin-left: 10px;
  color: #ff9f40;
}

.arrow-icon {
  font-size: 24px;
  color: #999;
}

/* 구매 영역 전체 래퍼 */
.purchase-wrapper {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}

.tab-section {
  padding-bottom: 0; /* 하단 패딩 제거 */
  margin-bottom: 0; /* 하단 마진 제거 */
  width: fit-content;
}

.tab-container {
  display: flex;
  background-color: #f7f7f7;
  padding: 0;
  width: fit-content; /* 콘텐츠에 맞게 너비 설정 */
}


.tab-btn {
  padding: 15px 24px;
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  background-color: #FFEDDC ;
  border-radius: 12px 12px 0 0;
  margin: 0;
  position: relative;
  transition: all 0.2s;
  z-index: 1;
}

.tab-btn.active {
  font-weight: 600;
  color: #000;
  background-color: white;
  border-radius: 12px 12px 0 0;
  z-index: 2;
  
}

/* 구매 컨테이너 */
.purchase-container {
  background-color: white;
  padding: 24px;
}

/* 패키지 섹션 */
.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.package-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.package-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #BDBDBD;
  border-radius: 4px;
  padding: 16px 20px;   
}

.package-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  margin-right: 20px;
}

.package-title {
  font-size: 14px;
  color: #303030;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.original-price {
  font-size: 13px; 
  color: #303030;
  text-decoration: line-through;
}

.discount-rate {
  font-size: 13px;
  color: #ff9f40;
  font-weight: 500;
}

.package-price {
  font-size: 14px;
  font-weight: 600;
  color: #ff9f40;
}

.purchase-btn {
  width: 15%;

  background-color: #ff9f40;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  min-width: 80px;
  text-align: center;
}

.purchase-btn:hover {
  background-color: #e88e30;
}

/* 결제 내역 영역 */
.history-empty {
  text-align: center;
  padding: 40px 0;
  color: #888;
  font-size: 14px;
}

/* 결제 내역 필터 영역 */
.history-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.select-container {
  position: relative;
  display: inline-block;
}

.filter-select {
  padding: 8px 30px 8px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  font-size: 14px;
  color: #303030;
  width: 120px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
}

/* 삼각형 아이콘 추가 */
.select-container::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 10px solid #000; /* 삼각형 색상 */
  pointer-events: none; /* 클릭 이벤트가 select에 전달되도록 */
}

/* Firefox에서 기본 화살표 제거 */
.filter-select::-ms-expand {
  display: none;
}

.date-range {
  display: flex;
  align-items: center;
}
/* 달력 아이콘 제거하고 전체 영역을 클릭 가능하게 */
.date-input::-webkit-calendar-picker-indicator {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  cursor: pointer;
  opacity: 0;
}



.date-input {
  position: relative;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 120px;
  font-size: 14px;
  cursor: pointer; /* 커서를 포인터로 변경하여 클릭 가능함을 표시 */
}

.date-separator {
  margin: 0 5px;
  color: #666;
}

.search-btn {
  background-color: #ff9f40;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.download-group {
  display: flex;
  align-items: center;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  font-size: 14px;
  color: #303030;
  cursor: pointer;
}

/* 결제 내역 테이블 */
.history-table {
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background-color: #ffffff;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #303030;
  border-bottom: 1.29px solid #757575;
}

.data-table td {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  color: #303030;
  border-bottom: 1px solid #e0e0e0;
}

.data-table tr:last-child td {
  border-bottom: none;
}


.column-num {
  width: 80px;
}
.column-title {
  width: 250px;
}

.column-price {
  width: 120px;
}

.column-date {
  width: 150px;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center; 
  width: 100%; 
  margin-top: 20px;
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
  cursor: pointer;
}

.pagination button:hover {
  font-weight: bold;
}

.active-page {
  color: #FF9F40;
  text-decoration: underline;
}
</style>