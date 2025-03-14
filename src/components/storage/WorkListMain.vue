<template>
  <div class="card-container">
    <div class="storage-worklistmain-title">
      <p>최근 작업 내역</p>
    </div>
    <div class="storage-worklistmain-subtitle">
      <span>전체</span>
      <P>({{ filteredWorkItems.length }}개)</P>
    </div>

    <div class="storage-worklistmain-search">
      <div class="search-container">
        <input 
          type="text" 
          placeholder="작업명, 제목, 유형 검색" 
          class="search-input"
          v-model="searchQuery"
          @input="handleSearch"
        >
      </div>
      <div class="search-icon">
        <Icon icon="iconamoon:search-light" width="20" height="20" style="color: #757575" />
      </div>
    </div>

    <div class="storage-worklistmain-subtitle2">
    <span>삭제</span>
    <button 
      style="border: 0; background-color: transparent;"
      @click="openDeleteModal"
    >
      <Icon icon="cil:trash" class="trash" width="20" height="20" style="color: #303030" />
    </button>
  </div>

    <!-- 검색 결과가 없을 때 표시할 중앙 메시지 -->
    <div v-if="filteredWorkItems.length === 0 && searchQuery" class="no-results-container">
      <div class="no-results-message">
        "{{ searchQuery }}"에 대한 검색결과가 없습니다.
      </div>
    </div>

    <!-- 데이터가 있을 때만 테이블 표시 -->
    <div v-else class="storage-worklist-table">
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
            <tr v-for="(item, index) in computedWorkItems" :key="index" :class="{ 'row-checked': item.checked }">
              <td @contextmenu="showEditForm(index, $event)">
                <label class="custom-checkbox">
                  <input type="checkbox" class="checkbox-input" v-model="item.checked">
                  <span class="checkbox-custom"></span>
                </label>
              </td>
              <td class="work-name" @contextmenu="showEditForm(index, $event)">
                <div v-if="editingIndex === index">
                  <input type="text" v-model="item.PAS_TITLE" @blur="finishEditing" @keyup.enter="finishEditing" ref="editInput" class="edit-input"/>
                </div>
                <div v-else>
                  {{ item.PAS_TITLE }}
                </div>
              </td>
              <td class="work-title" @contextmenu="showEditForm(index, $event)">{{ item.PAS_KEYWORD }}</td>
              <td class="work-type" @contextmenu="showEditForm(index, $event)">
                <span class="type-tag">{{ item.PAS_IS_GENERATED }}</span>
              </td>
              <td class="work-date" @contextmenu="showEditForm(index, $event)">{{ item.PAS_DATE }}</td>
              <td class="work-action">
                <button class="extract-btn" @click="openFileModal(item)">
                  <p id="btn-text">추출 </p>
                  <Icon icon="lucide:upload" id="btn-icon" style="color: #FFFFFF" />
                </button>
              </td>
              <td class="work-favorite" @contextmenu="showEditForm(index, $event)">
                <span class="star-container" @click="toggleFavorite(index)">
                  <Icon v-if="item.PAS_IS_FAVORITE" icon="mynaui:star-solid" width="24" height="24" style="color: #FF9F40" />
                  <Icon v-else icon="mynaui:star" width="24" height="24" style="color: #FF9F40" />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination" v-if="totalPages > 0 && filteredWorkItems.length > 0">
      <button @click="prevPage" :disabled="currentPage === 1">&lt;</button>
      
      <span
        v-for="page in visiblePages"
        :key="page"
        @click="changePage(page)"
        :class="{ 'active-page': currentPage === page }">
        {{ page }}
      </span>
      
      <button @click="nextPage" :disabled="currentPage === totalPages">&gt;</button>
      <button @click="lastPage" :disabled="currentPage === totalPages">&raquo;</button>
    </div>

    <!-- 컨텍스트 메뉴(우클릭시 나오는 박스) -->
    <div v-if="showContextMenu" class="context-menu" :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }">
      <div class="menu-item" @click="startEditing">
        <span>이름 변경</span>
      </div>
    </div>
    
    <!-- 파일 선택 모달 -->
    <FileSelectModal :isOpen="isModalOpen" @close="closeFileModal" @confirm="handleFileSelection"/>

    <!-- 삭제 경고 모달 -->
    <WarningModalComponent 
      :isOpen="isDeleteModalOpen"
      title="선택하 자료를 삭제하시겠습니까?"
      :message="`삭제를 진행한 자료는 영구 삭제됩니다.`"
      cancelText="취소"
      confirmText="삭제"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import FileSelectModal from '@/components/common/modal/type/FileSelectModal.vue';
import WarningModalComponent from '@/components/common/modal/type/WarningModalComponent.vue';

// 라우터와 스토어 초기화
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 작업 아이템 상태
const workItems = ref([]);

// 컴포넌트 마운트 시, 데이터 로드
onMounted(() => {
  fetchWorkItems();
});

// 최근 작업 내역 리스트 가져오기
const fetchWorkItems = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  fetch(`${apiUrl}/pass/select/recelist`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then(response => {
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
    return response.json();
  })
  .then(data => {
    // 응답 데이터 구조에 맞게 매핑
    workItems.value = data.map(item => ({
      PAS_CODE: item.pasCode,
      PAS_TITLE: item.title,
      PAS_KEYWORD: item.keyword,
      PAS_IS_GENERATED: item.isGenerated === 1 ? '지문' : '문항',
      PAS_DATE: item.date,
      PAS_IS_FAVORITE: item.isFavorite === 1,
      checked: false // 체크박스 상태 추가
    }));
  })
  .catch(error => {
    console.error('최근 작업 리스트 불러오기 실패: ', error);
  })
}

// 검색 관련 상태
const searchQuery = ref('');

// 컨텍스트 메뉴 상태 관리
const showContextMenu = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuIndex = ref(-1);

// 편집 중인 항목의 인덱스 (-1이면 편집 중이 아님)
const editingIndex = ref(-1);
const editInput = ref(null);

// 띄어쓰기를 제거하는 함수
const removeWhitespace = (str) => {
  return str.replace(/\s+/g, '');
};

// 검색 기능 - 띄어쓰기 무시
const handleSearch = () => {
  // 검색어가 변경될 때 첫 페이지로 돌아가기
  currentPage.value = 1;
};

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
};

// 파일 형식 선택 후 처리
const handleFileSelection = (fileType) => {
  console.log('선택된 파일 형식:', fileType);
  console.log('선택된 작업 아이템:', selectedItem.value);

  // 파일 추출 로직 구현
};

const toggleFavorite = (index) => {
  const item = workItems.value[index];
  const apiUrl = import.meta.env.VITE_API_URL;

  // 즐겨찾기 토글 로직
  const newFavoriteStatus = !item.PAS_IS_FAVORITE;

  // API 호출
   fetch(`${apiUrl}/pass/favo`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      pasCode: item.PAS_CODE
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('즐겨찾기 업데이트 실패');
    }
    return response.json();
  })
  .then(data => {
    console.log('즐겨찾기 업데이트 성공:', data);
    
    // 서버에서 반환한 업데이트된 데이터로 항목 상태 갱신
    if (data.isFavorite !== undefined) {
      item.PAS_IS_FAVORITE = data.isFavorite === 1;
    } else {
      // 서버에서 업데이트된 상태를 반환하지 않는 경우, 로컬에서 토글
      item.PAS_IS_FAVORITE = newFavoriteStatus;
    }
  })
  .catch(error => {
    console.error('즐겨찾기 업데이트 실패:', error);
    // 에러 시 사용자에게 알림을 표시할 수 있습니다
  });
};

// 페이지네이션 관련 상태
const currentPage = ref(1);
const itemsPerPage = 15; // 페이지당 표시할 아이템 수
const maxVisiblePages = 5; // 한 번에 표시할 페이지 번호 최대 개수

// 띄어쓰기를 무시하는 고급 검색 함수
const advancedSearch = (items, query) => {
  if (!query) return items;
  if (!items || !Array.isArray(items) || items.length === 0) return [];
  
  // 검색어와 검색 대상에서 모든 공백 제거
  const normalizedQuery = removeWhitespace(query.toLowerCase());
  
  return items.filter(item => {
    try {
      // 검색할 필드들에서 공백 제거 (문자열이 아닌 경우 빈 문자열로 처리)
      const titleStr = (item.PAS_TITLE || '').toString();
      const keywordStr = (item.PAS_KEYWORD || '').toString();
      const generatedStr = (item.PAS_IS_GENERATED || '').toString();
  
      const nameWithoutSpace = removeWhitespace(item.PAS_TITLE.toLowerCase());
      const titleWithoutSpace = removeWhitespace(item.PAS_KEYWORD.toLowerCase());
      const typeWithoutSpace = removeWhitespace(item.PAS_IS_GENERATED.toLowerCase());
      
      // 공백 없는 텍스트에서 검색
      return nameWithoutSpace.includes(normalizedQuery) || 
             titleWithoutSpace.includes(normalizedQuery) || 
             typeWithoutSpace.includes(normalizedQuery);
    } catch (error) {
      console.error('검색 중 오류 발생 : ', error, item)
    }
  });
};

// 필터링된 작업 아이템 계산 (검색 기능)
const filteredWorkItems = computed(() => {
  return advancedSearch(workItems.value, searchQuery.value);
});

// 총 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(filteredWorkItems.value.length / itemsPerPage);
});

// 페이지네이션된 작업 아이템 계산
const computedWorkItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredWorkItems.value.slice(start, start + itemsPerPage);
});

// 표시할 페이지 배열 계산
const visiblePages = computed(() => {
  const total = totalPages.value;
  if (total <= 1) return [1];
  
  // 현재 페이지를 중심으로 최대 5개의 페이지 번호 표시
  const startPage = Math.max(1, Math.min(
    currentPage.value - Math.floor(maxVisiblePages / 2),
    total - maxVisiblePages + 1
  ));
  
  const endPage = Math.min(startPage + maxVisiblePages - 1, total);
  
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

// 페이지 변경 함수들
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const lastPage = () => {
  currentPage.value = totalPages.value;
};

// 삭제 모달 상태 관리
const isDeleteModalOpen = ref(false);

// 선택된 아이템들 찾기
const selectedItems = computed(() => {
  return workItems.value.filter(item => item.checked);
});

// 삭제 버튼 클릭 시 모달 열기
const openDeleteModal = () => {
  if (selectedItems.value.length > 0) {
    isDeleteModalOpen.value = true;
  }
};

// 선택된 아이템 삭제 확인 
const confirmDelete = () => {
  // 선택된 아이템 제거
  workItems.value = workItems.value.filter(item => !item.checked);
  
  // 모달 닫기
  isDeleteModalOpen.value = false;
  
  // 페이지 재계산
  currentPage.value = Math.min(currentPage.value, totalPages.value);
};

// 삭제 모달 닫기
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
};
</script>

<style scoped>

.card-container {
  width: 100%;
  padding: 20px 30px 80px 20px;
}

/* 검색 결과 없음 메시지 스타일 */
.no-results-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 1472px;
  height: 667px;
  left: 292px;
  top: 130px;
  background: #FFFFFF;
  border-radius: 12px;
}

.no-results-message {
  font-size: 16px;
  color: #757575;
  text-align: center;
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
  height: 736px;
  left: 292px;
  top: 130px;  
  background: #FFFFFF;
  border-radius: 12px;
  box-sizing: border-box;
  overflow: hidden; /* 내부 요소가 border-radius를 넘지 않도록 */
}

.table-container {
  width: 100%;
  overflow-x: auto;
  overflow: hidden;
}

.data-table {
  width: 100%;
  height: 736px;
  border-collapse: collapse;
  table-layout: fixed;
}

.data-table tbody {
  height: 690px;
}
.data-table th {
  text-align: left;
  padding: 10px 20px;    
  border-bottom: 1px solid #e1e1e1;
  font-weight: 700;
  color: #424242;
}

.data-table tr {
  height: 46px;
}

.data-table td {
  text-align: left;
  padding: 3.5px 20px;    
  border-bottom: 1px solid #e1e1e1;
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
  border-radius: 12px;
  padding: 0 10px;
  font-size: 14px;
  color: #333;
  font-weight: 400;
}

.type-tag-combined {
  background-color: #e8f0fe;
  color: #4285f4;
}

.work-action {
  padding: 0;
  text-align: center;
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
  margin-left: 28px;
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

/* 별 아이콘 */
.star-container {
  cursor: pointer;
}

/* 행 hover 효과 */
.data-table tbody tr:hover {
  background-color: #EAEAEA;
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

/* 검색인풋창 디자인 */
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
  max-width: 300px;
}

.search-input {
  /* width: 300px; */
  height: 40px;
  padding: 0 10px 0 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center; 
  position: absolute;
  left: 300px;
  top: 850px;
  width: 1471px; 
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
  padding: 5px 10px;
  border-radius: 4px;
}

.pagination button {
  border: none;
  background: none;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:hover {
  background-color: #f0f0f0;
}

.pagination button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.active-page {
  color: #FF9F40;
  font-weight: bold;
}

.pagination span:hover:not(.active-page) {
  background-color: #f0f0f0;
}
</style>