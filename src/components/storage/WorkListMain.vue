<template>
  <div class="card-container">
    <div class="storage-worklistmain-title">
      <p>최근 작업 내역</p>
    </div>
    <div class="storage-worklistmain-subtitle">
      <span>전체</span>
      <P>(N개)</P>
    </div>

    <div class="storage-worklistmain-search">
      <div class="search-container">
        <input type="text" placeholder="검색어를 입력하세요." class="search-input">
      </div>
      <div class="search-icon">
        <Icon icon="iconamoon:search-light" width="20" height="20"  style="color: #757575" />
      </div>
    </div>

    <div class="storage-worklistmain-subtitle2">
      <span>삭제</span>
      <button style="border: 0; background-color: transparent;">
        <Icon icon="cil:trash" class="trash" width="20" height="20"  style="color: #303030" />
      </button>
    </div>
    <div class="storage-worklist-table">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>선택</th>
              <th>작업명</th>
              <th>제재</th>
              <th>유형</th>
              <th>최종 작업일</th>
              <th>추출하기</th>
              <th>즐겨찾기</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in workItems" :key="index" :class="{ 'row-checked': item.checked }">
              <td @contextmenu="showEditForm(index, $event)">
                <label class="custom-checkbox">
                  <input type="checkbox" class="checkbox-input" v-model="item.checked">
                  <span class="checkbox-custom"></span>
                </label>
              </td>
              <td class="work-name" @contextmenu="showEditForm(index, $event)">
                <div v-if="editingIndex === index">
                  <input type="text" v-model="item.name" @blur="finishEditing" @keyup.enter="finishEditing" ref="editInput" class="edit-input"/>
                </div>
                <div v-else>
                  {{ item.name }}
                </div>
              </td>
              <td class="work-title" @contextmenu="showEditForm(index, $event)">{{ item.title }}</td>
              <td class="work-type" @contextmenu="showEditForm(index, $event)">
                <span class="type-tag">{{ item.type }}</span>
              </td>
              <td class="work-date" @contextmenu="showEditForm(index, $event)">{{ item.date }}</td>
              <td class="work-action">
                <button class="extract-btn" @click="openFileModal(item)">
                  <p id="btn-text">추출 </p>
                  <Icon icon="lucide:upload" id="btn-icon" style="color: #FFFFFF" />
                </button>
              </td>
              <td class="work-favorite" @contextmenu="showEditForm(index, $event)">
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

    <!-- 컨텍스트 메뉴(우클릭시 나오는 박스) -->
  <div v-if="showContextMenu" class="context-menu" :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }">
    <div class="menu-item" @click="startEditing">
      <span>이름 변경</span>
    </div>

  </div>
  <!-- 파일 선택 모달 -->
  <FileSelectModal :isOpen="isModalOpen" @close="closeFileModal" @confirm="handleFileSelection"/>
</template>
<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import FileSelectModal from '@/components/common/modal/type/FileSelectModal.vue';

// 데이터 정의 - ref로 감싸서 반응형으로 만듭니다
const workItems = ref([
  // 기존 데이터 유지
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false,
    checked: false 
  },
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false,
    checked: false,
  },
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false,
    checked: false
  },
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false,
    checked: false
  },
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false,
    checked: false
  },
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false,
    checked: false
  },
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false,
    checked: false
  },
  {
    name: '수능특강 기반 문제생성saasasdsadasdsadads',
    title: '메이드투메이드의 건배',
    type: '지문',
    date: '2025-02-28',
    favorite: false,
    checked: false
  },

]);

// 컨텍스트 메뉴 상태 관리
const showContextMenu = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuIndex = ref(-1);

// 편집 중인 항목의 인덱스 (-1이면 편집 중이 아님)
const editingIndex = ref(-1);
const editInput = ref(null);

// 컨텍스트 메뉴 표시
const showEditForm = (index, event) => {
  if (!event) return;
  
  // 기존의 컨텍스트 메뉴 닫기
  showContextMenu.value = false;
  
  // 새 컨텍스트 메뉴 위치 설정
  contextMenuPosition.value = {
    x: event.clientX,
    y: event.clientY
  };
  
  // 클릭된 항목 인덱스 저장
  contextMenuIndex.value = index;
  
  // 컨텍스트 메뉴 표시
  showContextMenu.value = true;
  
  // 브라우저 기본 컨텍스트 메뉴 방지
  event.preventDefault();
};

// 이름 변경 시작
const startEditing = () => {
  // 컨텍스트 메뉴 숨기기
  showContextMenu.value = false;
  
  // 편집 모드 활성화
  editingIndex.value = contextMenuIndex.value;
  
  // 입력 필드 포커스
  nextTick(() => {
    const inputs = document.querySelectorAll('.edit-input');
    if (inputs && inputs.length > 0) {
      inputs[0].focus();
    }
  });
};

// 컨텍스트 메뉴 닫기 함수
const closeContextMenu = (event) => {
  if (showContextMenu.value && !event.target.closest('.context-menu')) {
    showContextMenu.value = false;
  }
};

// 문서 클릭 시 컨텍스트 메뉴 닫기
onMounted(() => {
  document.addEventListener('click', closeContextMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu);
});

// 편집 완료
const finishEditing = () => {
  editingIndex.value = -1;
};

// 메소드 정의 - 화살표 함수로 작성합니다
const extractItem = (item) => {
  // 추출 버튼 클릭 시 실행될 로직
  console.log('추출 버튼 클릭:', item);
};

// 모달 상태 관리
const isModalOpen = ref(false);
const selectedItem = ref(null);

// 추출 버튼 클릭 시 모달 열기
const openFileModal = (item) => {
  selectedItem.value = item;
  isModalOpen.value = true;
};

// 모달 닫기
const closeFileModal = () => {
  isModalOpen.value = false;
}

// 파일 형식 선택 후 처리
const handleFileSelection = (fileType) => {
  console.log('선택된 파일 형식:', fileType);
  console.log('선택된 작업 아이템:', selectedItem.value);

  // 파일 추출 로직 구현
}

const toggleFavorite = (index) => {
  // 즐겨찾기 토글 로직
  workItems.value[index].favorite = !workItems.value[index].favorite;
};
</script>
<style scoped>
.card-container {
    width: 100%;
    padding: 20px 30px 80px 20px;
}
 .storage-worklistmain-title {
   display: flex;
   align-items: flex-start;
   gap: 12px;
   isolation: isolate;
   position: absolute;
   left: 292px;
   top: 48px;
   box-sizing: border-box;
}

.storage-worklistmain-title p {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.storage-worklistmain-subtitle {
   display: flex;
   align-items: flex-start;
   gap: 4px;
   isolation: isolate;
   position: absolute;
   left: 292px;
   top: 90px;
   box-sizing: border-box;
}

.storage-worklistmain-subtitle2 {
   display: flex;
   align-items: flex-start;
   gap: 3px;
   isolation: isolate;
   position: absolute;
   left: 1710px;
   top: 90px;
   box-sizing: border-box;
}

.storage-worklistmain-subtitle2 span {
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  color: #000000;
}

.storage-worklistmain-subtitle span {
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  color: #000000;
}

.storage-worklistmain-subtitle p {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #FF9F40;
}


.storage-worklist-table {
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   gap: 12px;
   isolation: isolate;
   position: absolute;
   width: 1472px;
   height: 684.5px;
   left: 292px;
   top: 130px;  
   background: #FFFFFF;
   border-radius: 12px;
   box-sizing: border-box;
   overflow: hidden; /* 내부 요소가 border-radius를 넘지 않도록 */
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
  width: 4%;
  text-align: center;
}

.data-table th:nth-child(2), .data-table td:nth-child(2) {
  width: 20%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.data-table th:nth-child(3), .data-table td:nth-child(3) {
  width: 10%;
  
}

.data-table th:nth-child(4), .data-table td:nth-child(4) {
  width: 7%;
  text-align: center;
}

.data-table th:nth-child(5), .data-table td:nth-child(5) {
  width: 7%;
  text-align: center;
}

.data-table th:nth-child(6), .data-table td:nth-child(6) {
  width: 7%;
  text-align: center;
}
.data-table th:nth-child(7), .data-table td:nth-child(7) {
  width: 7%;
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
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 8px;
  gap: 8px;

  width: 72px;
  height: 34px;

  background: #303030;
  border-radius: 8px;
}
#btn-text {
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;

  letter-spacing: -0.02em;
  color: #FFFFFF;
}
#btn-icon {
  width: 20px;
  height: 20px;

  flex: none;
  order: 1;
  flex-grow: 0;
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


/* 체크박스 컨테이너 스타일 */
.custom-checkbox {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

/* 원래 체크박스는 숨김 */
.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* 커스텀 체크박스 스타일 */
.checkbox-custom {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: white;
  border: 1px solid #303030;
  vertical-align: middle;
}

/* 체크된 상태의 커스텀 체크박스 */
.checkbox-input:checked + .checkbox-custom::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid #303030;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* 체크시 td 전체 색변경 */
.row-checked {
  background-color: #FFEDDC !important;
}


/* 검색인풋창 디자인. */
.storage-worklistmain-search {
   display: flex;
   align-items: flex-start;
   gap: 3px;
   isolation: isolate;
   position: absolute;
   left: 1420px;
   top: 80px;
   box-sizing: border-box;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 0 10px 0 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 18px;
  color: #333;
  outline: none;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: #757575;
}

.search-icon {
  position: absolute;
  top: 20px;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
}


/* 편집 입력 필드 스타일 */
.edit-input {
  width: 100%;
  padding: 10px 10px;
  border: 1px solid #000000;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

/* 오른쪽 클릭 표시 (커서 변경) */
.data-table td {
  cursor: context-menu;
}


/* 컨텍스트 메뉴 스타일 */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 120px;
}

.menu-item {
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
}

.menu-item:hover {
  background-color: #f5f5f5;
}
</style>

