<template>
  <div class="card-container">
    <div class="storage-likemain-title">
      <p>즐겨찾기</p>
    </div>
    <div class="storage-likemain-subtitle">
      <span>전체</span>
      <p>({{ computedWorkItems.length }}개)</p>
    </div>
    <div class="storage-likemain-subtitle2">
    <span>삭제</span>
    <button 
      style="border: 0; background-color: transparent;"
      @click="openDeleteModal"
    >
      <Icon icon="cil:trash" class="trash" width="20" height="20" style="color: #303030" />
    </button>
  </div>
    <div class="storage-likemain-table">
      <div class="table-container">
        <template v-if="computedWorkItems.length > 0">
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
                <td class="work-name" @contextmenu="showEditForm(index, $event)" @click="handleWorkItemClick(item)">
                  <div v-if="editingIndex === index">
                    <input type="text" v-model="item.PAS_TITLE" @blur="finishEditing" @keyup.enter="finishEditing" ref="editInput" class="edit-input"/>
                  </div>
                  <div v-else class="clickable-title">
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
      </template>
      <template v-else>
        <span class="empty-message">즐겨찾기가 비어있습니다.</span>
      </template>
    </div>
  </div>
     <!-- 페이지네이션 -->
     <div class="pagination" v-if="totalPages > 0 && computedWorkItems.length > 0">
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
  </div>

  <!-- 컨텍스트 메뉴(우클릭시 나오는 박스) -->
  <div v-if="showContextMenu" class="context-menu" :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }">
    <div class="menu-item" @click="startEditing">
      <span>이름 변경</span>
    </div>

  </div>
  <!-- 파일 선택 모달 -->
  <FileSelectModal :isOpen="isModalOpen" :pasCode="selectedItem?.PAS_CODE" @close="closeFileModal" @confirm="handleFileSelection"/>

   <!-- 삭제 경고 모달 -->
   <WarningModalComponent 
    :isOpen="isDeleteModalOpen"
    title="선택한 자료를 삭제하시겠습니까?"
    :message="`삭제를 진행한 자료는 영구 삭제됩니다.`"
    cancelText="취소"
    confirmText="삭제"
    @close="closeDeleteModal"
    @confirm="confirmDelete"
  />
</template>
<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import WarningModalComponent from '@/components/common/modal/type/WarningModalComponent.vue';
import FileSelectModal from '../common/modal/type/FileSelectModal.vue';

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

  fetch(`${apiUrl}/pass/select/favolist`, {
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
};

// 작업명 클릭시, 해당 화면으로 이동
const handleWorkItemClick = (item) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const pasCode = item.PAS_CODE;

  // PAS_IS_GENERATED 값에 따라 API 및 페이지 분기처리
  const isGeneratedText = item.PAS_IS_GENERATED;
  const isPassage = isGeneratedText === '지문';
    // '지문'인 경우 true, '문항'인 경우 false

  // api 엔드 포인트 결정
  const endpoint = isPassage
    ? `${apiUrl}/pass/select/${pasCode}`
    : `${apiUrl}/pass/ques/select/${pasCode}`;

  // api 호출
  fetch(endpoint, {
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
        
        throw new Error('인증이 필요합니다');
      }
      return response.text().then(text => { throw new Error(text); });
    }
    return response.json();
  })
  .then(data => {
    console.log('가져온 데이터 : ', data);

    if (isPassage) {
      // 지문인 경우 - PassageContent.vue로 이동
      // 데이터 형식 변환 및 저장
      const passageData = {
        pasCode: data.pasCode,
        title: data.title,
        type: data.type,
        keyword: data.keyword,
        content: data.content,
        gist: data.gist
      };

      // 통합 키로 저장
      localStorage.setItem('genieq-passage-data', JSON.stringify(passageData));;

      // 지문 생성 페이지로 이동
      router.push('/passage/create');
    } else {
      // 문항인 경우 - GenerateQuestion.vue로 이동
      // 데이터 형식 변환 및 저장
      const questionData = {
        passage: {
          pasCode: data.pasCode,
          title: data.title,
          type: data.type,
          keyword: data.keyword,
          content: data.content,
          gist: data.gist,
          questions: data.questions.map(q => ({
            queCode: q.queCode,
            queQuery: q.queQuery,
            queOption: q.queOption,
            queAnswer: q.queAnswer
          }))
        }
      };

      // 로컬 스토리지에 저장
      localStorage.setItem('saveResponse', JSON.stringify(questionData));
      
      // 문항 생성 페이지로 이동
      router.push({
        path: '/questions/generate',
        query: {from: route.path} // 현재 경로 전달
      });
    }
  })
  .catch(error => {
    console.error('데이터 가져오기 실패:', error);
    alert('데이터를 가져오는 중 오류가 발생했습니다.');
  });
}

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

// 편집 완료 및 서버 업데이트
const finishEditing = () => {
  if (editingIndex.value >= 0) {
    const item = computedWorkItems.value[editingIndex.value];
    const apiUrl = import.meta.env.VITE_API_URL;
    
    // API 호출하여 제목 업데이트 (PATCH 메서드 사용)
    fetch(`${apiUrl}/pass/update/each`, {
      method: 'PATCH', // PUT에서 PATCH로 변경
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        pasCode: item.PAS_CODE,
        title: item.PAS_TITLE,
        content: item.PAS_KEYWORD || "" // content 필드가 필요한 경우 기존 값 유지
      })
    })
    .then(response => {
      if (!response.ok) {
        console.error('이름 변경 응답 오류:', response.status);
        throw new Error('이름 변경 실패');
      }
      
      // 응답 형식 확인
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        return { success: true };
      }
    })
    .then(data => {
      console.log('이름 변경 성공:', data);
      
      // 원본 workItems 배열에서 해당 항목 찾아 업데이트
      const originalItem = workItems.value.find(i => i.PAS_CODE === item.PAS_CODE);
      if (originalItem) {
        originalItem.PAS_TITLE = item.PAS_TITLE;
      }
    })
    .catch(error => {
      console.error('이름 변경 실패:', error);
      // 실패해도 UI는 업데이트 (사용자 경험을 위해)
      const originalItem = workItems.value.find(i => i.PAS_CODE === item.PAS_CODE);
      if (originalItem) {
        originalItem.PAS_TITLE = item.PAS_TITLE;
      }
    })
    .finally(() => {
      // 편집 모드 종료
      editingIndex.value = -1;
    });
  } else {
    editingIndex.value = -1;
  }
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

// 총 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(workItems.value.length / itemsPerPage);
});

// 페이지네이션된 작업 아이템 계산
const computedWorkItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return workItems.value.slice(start, end);
});

// 표시할 페이지 배열 계산
const visiblePages = computed(() => {
  const total = totalPages.value;
  if (total <= 1) return [1];
  
  const startPage = Math.max(1, Math.min(
    currentPage.value - Math.floor(maxVisiblePages / 2),
    total - maxVisiblePages + 1
  ));
  
  const endPage = Math.min(startPage + maxVisiblePages - 1, total);
  
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

// 페이지 변경 시 currentPage 검증
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

// 선택된 아이템들 찾기 (수정된 버전)
const selectedItems = computed(() => {
  const selected = workItems.value.filter(item => item.checked);
  console.log('선택된 항목:', selected);
  return selected;
});

// 삭제 버튼 클릭 시 모달 열기
const openDeleteModal = () => {
  if (selectedItems.value.length > 0) {
    isDeleteModalOpen.value = true;
  }
};

const confirmDelete = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9090';
  const selectedPasCodes = selectedItems.value.map(item => item.PAS_CODE);
  
  // 선택된 항목이 없으면 작업 중단
  if (selectedPasCodes.length === 0) {
    console.log('삭제할 항목이 선택되지 않았습니다.');
    return;
  }
  
  console.log('삭제 요청:', selectedPasCodes);
  
  // API 호출
  fetch(`${apiUrl}/pass/remove/each`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      pasCodeList: selectedPasCodes
    })
  })
  .then(response => {
    // HTTP 응답 상태 코드만 확인하고 성공으로 처리
    if (response.status >= 200 && response.status < 300) {
      return { success: true };
    }
    
    console.error('HTTP 오류:', response.status);
    return Promise.reject(new Error('서버에서 오류가 발생했습니다: ' + response.status));
  })
  .then(data => {
    console.log('삭제 성공:', data);
    
    // UI에서 선택된 항목 제거
    workItems.value = workItems.value.filter(item => !selectedPasCodes.includes(item.PAS_CODE));
    
    // 모달 닫기
    isDeleteModalOpen.value = false;
    
    // 마지막 페이지가 비게 되면 이전 페이지로 이동
    if (totalPages.value === 0) {
      currentPage.value = 1;
    } else if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  })
  .catch(error => {
    console.error('삭제 요청 처리 오류:', error);
    
    // 모달 닫기 - 에러가 발생해도 사용자 경험을 위해 모달은 닫음
    isDeleteModalOpen.value = false;
  });
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
.storage-likemain-title {
 display: flex;
 align-items: flex-start;
 gap: 12px;
 isolation: isolate;
 position: absolute;
 left: 292px;
 top: 48px;
 box-sizing: border-box;
}

.storage-likemain-title p {
font-size: 24px;
font-weight: 700;
margin: 0;
}

.storage-likemain-subtitle {
 display: flex;
 align-items: flex-start;
 gap: 4px;
 isolation: isolate;
 position: absolute;
 left: 292px;
 top: 90px;
 box-sizing: border-box;
}

.storage-likemain-subtitle2 {
 display: flex;
 align-items: flex-start;
 gap: 3px;
 isolation: isolate;
 position: absolute;
 left: 1710px;
 top: 90px;
 box-sizing: border-box;
}

.storage-likemain-subtitle2 span {
font-size: 16px;
font-weight: 400;
margin: 0;
color: #000000;
}

.storage-likemain-subtitle span {
font-size: 16px;
font-weight: 400;
margin: 0;
color: #000000;
}

.storage-likemain-subtitle p {
font-size: 16px;
font-weight: 600;
margin: 0;
color: #FF9F40;
}

.storage-likemain-table {
 display: flex;
 flex-direction: column;
 align-items: flex-start;
 gap: 12px;
 isolation: isolate;
 position: absolute;
 left: 292px;
 top: 130px;  
 background: #FFFFFF;
 border-radius: 12px;
 box-sizing: border-box;
 overflow: hidden; /* 내부 요소가 border-radius를 넘지 않도록 */
}

.table-container {
  width: 100%;
  height: 675px;
  overflow-x: auto;
  overflow: hidden;
}

.data-table {
  width: 1472px;
  height: 46px;
  border-collapse: collapse;
  table-layout: fixed;
}

.data-table th {
text-align: left;
padding: 10px 20px;    
border-bottom: 1px solid #e1e1e1;
font-weight: 700;
font-size: 20px;
color: #424242;
}

.data-table td {
  text-align: left;
  padding: 3.5px 20px;    
  color: #424242;
  white-space: nowrap; 
  overflow: hidden;  
  text-overflow: ellipsis; 
}

.data-table tr {
  border-bottom: 1px solid #e1e1e1;
}
.data-table tr:last-child {
  border-bottom: none;
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

.clickable-title {
  cursor: pointer;
  color: #303030;
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

/* 테이블이 비어있는 경우 */
.empty-message {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 1473px;
  height: 748px;
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
background-color: #EAEAEA;
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
  background-color: #EAEAEA;
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