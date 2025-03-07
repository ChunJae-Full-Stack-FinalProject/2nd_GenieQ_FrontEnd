<template>
    <div class="card-container">
        <div class="storage-likelist-title">
            <p>즐겨찾기</p>
            <Icon icon="weui:arrow-outlined" width="24" height="24" id="arrow-icon" style="color: #303030" />
        </div>
       <div class="storage-likelist-table">
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th>작업명</th>
          <th>제재</th>
          <th>유형</th>
          <th>최종 작업일</th>
          <th>추출하기</th>
          <th>즐겨찾기</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in workItems" :key="index">
          <td class="work-name">{{ item.name }}</td>
          <td class="work-title">{{ item.title }}</td>
          <td class="work-type"><span class="type-tag">{{ item.type }}</span></td>
          <td class="work-date">{{ item.date }}</td>
          <td class="work-action"><button class="extract-btn" @click="extractItem(item)">추출 <i class="download-icon"></i></button></td>
          <td class="work-favorite">
            <span class="star-container" @click="toggleFavorite(index)">
              <Icon v-if="item.favorite" icon="mynaui:star-solid" width="24" height="24" style="color: #FF9F40" />
              <Icon v-else icon="mynaui:star" width="24" height="24" style="color: #FF9F40" />
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</div>

</template>
<script setup>
import { ref } from 'vue';

// 데이터 정의 - ref로 감싸서 반응형으로 만듭니다
const workItems = ref([
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false
  },
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false
  },
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false
  },
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false
  },
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false
  },
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false
  },
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false
  },
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false
  },
 
]);

// 메소드 정의 - 화살표 함수로 작성합니다
const extractItem = (item) => {
  // 추출 버튼 클릭 시 실행될 로직
  console.log('추출 버튼 클릭:', item);
};

const toggleFavorite = (index) => {
  // 즐겨찾기 토글 로직
  workItems.value[index].favorite = !workItems.value[index].favorite;
};
</script>
<style scoped>
 .storage-likelist-title {
   display: flex;
   align-items: flex-start;
   gap: 12px;
   isolation: isolate;
   position: absolute;
   width: 1472px;
   height: 506px;
   left: 292px;
   top: 50px;
   box-sizing: border-box;
}

.storage-likelist-table {
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   gap: 12px;
   isolation: isolate;
   position: absolute;
   width: 1472px;
   height: 252.47px;
   left: 292px;
   top: 100px;  
   background: #FFFFFF;
   border-radius: 12px;
   box-sizing: border-box;
   overflow: hidden; /* 내부 요소가 border-radius를 넘지 않도록 */
}

.storage-likelist-title p {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

td{
  height: 29.21px;  
}

.table-container {
  width: 100%;
  overflow-x: auto;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.data-table th {
  text-align: left;
  padding: 10px 20px;    
  border-bottom: 1px solid #e1e1e1;
  font-weight: 700;
  color: #424242;
}

.data-table td {
  text-align: left;
  padding: 3.5px 20px;    
  border-bottom: 1px solid #e1e1e1;
  font-weight: 500;
  color: #424242;
  white-space: nowrap; 
  overflow: hidden;  
  text-overflow: ellipsis; 
}


/* 열 너비 조정 */
.data-table th:nth-child(1), .data-table td:nth-child(1) {
  width: 20%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.data-table th:nth-child(2), .data-table td:nth-child(2) {
  width: 30%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.data-table th:nth-child(3), .data-table td:nth-child(3) {
  width: 10%;
}

.data-table th:nth-child(4), .data-table td:nth-child(4) {
  width: 15%;
}

.data-table th:nth-child(5), .data-table td:nth-child(5) {
  width: 15%;
  text-align: center;
}

.data-table th:nth-child(6), .data-table td:nth-child(6) {
  width: 10%;
  text-align: center;
}

/* 마지막 행의 셀에 border-radius 적용 */
.data-table tbody tr:last-child td:first-child {
   border-bottom-left-radius: 12px;
}

.data-table tbody tr:last-child td:last-child {
   border-bottom-right-radius: 12px;
}

/* 마지막 빈 행은 테두리 없음 */
.empty-row:last-child td {
  border-bottom: none;
}

/* 유형 태그 스타일 */
.type-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  height: 28px;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 14px;
  color: #333;
  font-weight: 400;
}

.type-tag-combined {
  background-color: #e8f0fe;
  color: #4285f4;
}

/* 추출 버튼 */
.extract-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
}

.download-icon:after {
  content: "↑";
  font-size: 12px;
}

/* 별 아이콘 */
.star-empty {
  font-size: 20px;
  color: #ddd;
  cursor: pointer;
}

.star-filled {
  font-size: 20px;
  color: #FFC107;
  cursor: pointer;
}

/* 행 hover 효과 */
.data-table tbody tr:hover {
  background-color: #f5f5f5;
}

/* 추출하기 열(5번째 열) 스타일링 */
.data-table th:nth-child(5), 
.data-table td:nth-child(5) {
  text-align: center; /* 셀 내용 중앙 정렬 */
}

/* 추출 버튼 스타일 */
.extract-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  gap: 6px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  margin: 0 auto;
}

/* 다운로드 아이콘 정렬 */
.download-icon {
  display: inline-block;
  margin-left: 4px;
}
</style>