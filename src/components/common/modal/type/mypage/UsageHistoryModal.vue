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
                <tr v-for="n in 5" :key="n">
                  <td>{{ n }}</td>
                  <td>+1</td>
                  <td>-1</td>
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
        <div class="close-btn-container">
          <BaseButton class="close-btn" text="닫기" type="type3" width="90.42px" height="34.5px" @click="closeModal" />
      </div>
</BaseModal>
</template> 
<script setup>
import { defineEmits } from 'vue';

import BaseModal from "../../BaseModal.vue";
import BaseButton from "@/components/common/button/BaseButton.vue";

const emit = defineEmits(['close']);

const closeModal = () => {
  emit("close");
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