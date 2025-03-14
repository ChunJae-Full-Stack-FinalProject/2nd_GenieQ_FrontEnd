<template>
<BaseModal :isOpen="isOpen" width="795.67px" height="625.17px" @close="closeModal">
  <div class="history-modaltitle" style="text-align: start;">
      <p class="history-title">이용권님의 이용권 정보</p>
      <p class="history-subtitle">이용권 충전후 사용가능한 내역입니다.</p>
  </div>
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
          <button class="search-btn" @click="loadUsageList">검색</button>
        </div>
      </div>

      <div class="history-table">
        <table class="data-table">
          <thead>
            <tr>
              <th class="column-title">활동</th>
              <th class="column-history">내역</th>
              <th class="column-lastcount">남은 횟수</th>
              <th class="column-date">사용 날짜</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedUsageHistory" :key="item.USA_CODE">
              <td>{{ item.USA_TYPE }}</td>
              <td>{{ item.USA_COUNT }}</td>
              <td>{{ item.USA_BALANCE }}</td>
              <td>{{ item.USA_DATE }}</td>
            </tr>
            <!-- 데이터가 없는 경우 표시할 행 -->
            <tr v-if="paginatedUsageHistory.length === 0">
              <td colspan="4" style="text-align: center; padding: 20px;">사용 내역이 없습니다.</td>
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
  <div class="close-btn-container">
    <BaseButton class="close-btn" text="닫기" type="type3" width="90.42px" height="34.5px" @click="closeModal" />
  </div>
</BaseModal>
</template> 
<script setup>
import { ref, computed, defineEmits, onMounted, watch } from 'vue';
import BaseModal from "../../BaseModal.vue";
import BaseButton from "@/components/common/button/BaseButton.vue";
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits(['close']);

// 라우터와 스토어 초기화
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 날짜 관련 상태 관리
const selectedPeriod = ref('');
const startDate = ref('');
const endDate = ref('');

// 페이지네이션 관련 상태
const currentPage = ref(1);
const itemsPerPage = 6;
const maxVisiblePages = 5;

// 임시 사용 내역 데이터
const usageHistory = ref([]);

// 데이터 초기화 함수
// const initializeData = () => {
//   for (let i = 1; i <= 60; i++) {
//     usageHistory.value.push({
//       USA_CODE: i,
//       USA_TYPE: `지문 생성 ${i}`,
//       USA_COUNT: i % 3 === 0 ? "+10" : i % 2 === 0 ? "-1" : "+1",
//       USA_BALANCE: 10 - (i % 10),
//       USA_DATE: `2024-03-${String(31 - (i % 30)).padStart(2, '0')}`
//     });
//   }
// };

const props = defineProps({
        isOpen: Boolean
    });

// 총 페이지 수 계산
const totalPages = computed(() => {
  if (!usageHistory.value || usageHistory.value.length === 0) return 1;
  return Math.ceil(usageHistory.value.length / itemsPerPage);
});

// 페이지네이션된 내역 계산
const paginatedUsageHistory = computed(() => {
  if (!usageHistory.value || usageHistory.value.length === 0) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  return usageHistory.value.slice(start, start + itemsPerPage);
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


// 🔥 모달이 열릴 때 실행되도록 watch 추가
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    console.log('모달 열림 상태 감지');
    initialState(); // 상태 초기화
    loadUsageList(); // 데이터 로드
  }
});
// 컴포넌트 마운트 시 초기화
// onMounted(() => {
//   endDate.value = getTodayFormatted();
//   //initializeData();
//   loadUsageList();
// });

const closeModal = () => {
  //initialState();
  emit("close");
};

const initialState = () => {
  selectedPeriod.value = '';
  startDate.value = '';
  endDate.value = getTodayFormatted();
  currentPage.value = 1;
  usageHistory.value = [];
};

// 컴포넌트 마운트 시 초기화
// onMounted(() => {
//   //initializeData();
//   loadUsageList();
// });

const loadUsageList = () =>{
  const start = startDate.value || '1970-01-01';
  const end = endDate.value || getTodayFormatted();

  const apiUrl = import.meta.env.VITE_API_URL;

  fetch(`${apiUrl}/api/usag/select/list?startDate=${start}&endDate=${end}`,{
    method: "GET",
    headers: { 'Content-Type': 'application/json' },
    credentials: "include"
  })
  .then(response => {
    // 인증 오류 처리 (401)
    if (!response.ok) {
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
    console.log('이용내역 데이터 불러오기 성공:', data);

    // 응답 데이터 구조에 맞게 매핑
    usageHistory.value = data.map(item => ({
      USA_CODE: item.usaCode,
      USA_TYPE: item.usaType,
      USA_COUNT: item.usaCount,
      USA_BALANCE: item.usaBalance,
      USA_DATE: item.usaDate
    }));
  })
  .catch(error => {
    console.error('이용내역 데이터 불러오기 실패:', error);
  })
};

</script>
    
<style scoped>
/* 모달 컨테이너 */
.modal-content{
  text-align:start !important;
}
.question-modal {
  width: 795.67px;
  height: 625.17px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 40px;
}

.history-modaltitle{
  display: flex;
  flex-direction: column;
  align-self: flex-start;
}

.history-title {
  margin-top: 20px;
  position: relative;
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 24px;
  line-height: 150%;
  letter-spacing: -0.02em;
  color: #303030;
}

.history-subtitle {
  color: #424242;
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


/* 결제 내역 테이블 */
.history-table {
  height: 286px;
  margin-bottom: 20px;
  /* border: 1px solid #e0e0e0; */
  border-radius: 4px;
  overflow: hidden;
}

.history-section{
  width: 100%;
  height: 100%;
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



.column-title {
  width: 50px;
}

.column-history {
  width: 70px;
}

.column-lastcount {
  width: 70px;
}

.column-date {
  width: 70px;
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


.close-btn-container{
  width:100%;
  height: 100%;
  display: flex;
  justify-content: end;
}
.close-btn{
  font-size:12.92px;
  font-weight: 700;
}

</style>