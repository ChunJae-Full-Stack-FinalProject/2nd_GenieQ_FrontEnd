<template>
  <div class="ticket-container">
    <h2 class="ticket-title">이용권님의 이용권 정보</h2>
    

    <div class="info-section">
      <div class="info-card">
        <div class="info-item">
          <span class="info-label">나의 잔여 이용권</span>
          <span class="info-value">10</span>
          <span class="info-label">회</span>
        </div>
      </div>
      
      <div class="info-card2">
        <div class="info-item">
          <span class="info-label">이용 내역 조회</span>
            <span class="arrow-icon" @click="showUsageHistoryModal = true">›</span>
            <UsageHistoryModal :isOpen="showUsageHistoryModal" @close="showUsageHistoryModal = false"/>
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
                <button class="purchase-btn">구매하기</button>
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
                <button class="purchase-btn">구매하기</button>
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
                <button class="purchase-btn">구매하기</button>
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
                  <select class="filter-select">
                    <option>기간 선택</option>
                    <option>최근 1개월</option>
                    <option>최근 3개월</option>
                    <option>최근 6개월</option>
                    <option>최근 12개월</option>
                  </select>
                </div>
                <div class="date-range">
                  <input type="date" class="date-input" value="2025-02-04">
                    <span class="date-separator">-</span>
                  <input type="date" class="date-input" value="2025-03-04">
                </div>
                <button class="search-btn">검색</button>
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
                  <tr v-for="n in 5" :key="n">
                    <td>{{ n }}</td>
                    <td>지문/문항 생성 10회 이용권</td>
                    <td>10,000원</td>
                    <td>YYYY-MM-DD</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="pagination">
              <a href="#" class="page-active">1</a>
              <a href="#">2</a>
              <a href="#">3</a>
              <a href="#">4</a>
              <a href="#">5</a>
              <a href="#" class="page-next">></a>
              <a href="#" class="page-last">>></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 이용 내역 모달 -->
    <UsageHistoryModal v-if="showUsageHistoryModal" @close="showUsageHistoryModal = false" />
  </div>
</template>
  
  <script setup>
import { ref } from 'vue';

import UsageHistoryModal from '@/components/common/modal/type/mypage/UsageHistoryModal.vue';
const showUsageHistoryModal = ref(false);

// 활성화된 탭 상태 관리
const activeTab = ref('usage');

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
  background-color: white;
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
  gap: 8px;
  margin-top: 20px;
}

.pagination a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
}

.pagination a.page-active {
  color: #ff9f40;
  font-weight: 500;
}

.pagination a.page-next, 
.pagination a.page-last {
  color: #666;
}

.pagination a:hover:not(.page-active) {
  background-color: #f0f0f0;
}
</style>