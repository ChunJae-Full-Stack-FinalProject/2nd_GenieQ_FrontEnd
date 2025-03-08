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
          <span class="arrow-icon">›</span>
        </div>
      </div>
    </div>
    
    <!-- 탭 영역 -->
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
    
    <!-- 이용권 패키지 영역 -->
     <div class="purchase-container">
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
</div>
  </template>
  
  <script setup>
import { ref } from 'vue';

// 활성화된 탭 상태 관리
const activeTab = ref('usage');

</script>
  
  <style scoped>

  .ticket-container {
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

/* 탭 섹션 */
.tab-section {
  margin-bottom: 25px;
}

.tab-container {
  display: flex;
  margin-bottom: 20px;
  background-color: #f8f8f8;
  border-radius: 4px;
  padding: 2px;
}

.tab-btn {
  padding: 8px 16px;
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
  margin: 2px;
}

.tab-btn.active {
  font-weight: 500;
  color: #000;
  background-color: #fff2e6; /* 연한 주황색 배경 */
}

/* 구매 컨테이너 (하얀색 배경) */
.purchase-container {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
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
  border: 1px solid #e5e5e5;
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
  color: #333;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.original-price {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
}

.discount-rate {
  font-size: 13px;
  color: #ff9f40; /* 주황색으로 변경 */
  font-weight: 500;
}

.package-price {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.purchase-btn {
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
</style>