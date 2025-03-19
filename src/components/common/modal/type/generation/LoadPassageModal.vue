<template>
  <BaseModal :isOpen="isOpen" width="1232px" height="968px" @close="closeModal">
    <div class="search-modal">
      <!-- 제목 및 설명 -->
      <div class="header">
        <h2 class="modal-title">지문 불러오기</h2>
        <p class="modal-description">기존에 생성했던 문제의 지문을 불러옵니다.</p>
      </div>

      <!-- 탭 메뉴 -->
      <div class="tab-menu">
        <button :class="{ active: activeTab === 'recent' }" @click="activeTab = 'recent'">
          최근 작업 내역
        </button>
        <button :class="{ active: activeTab === 'favorites' }" @click="activeTab = 'favorites'">
          즐겨찾기
        </button>
      </div>

      <!-- 검색 입력창 -->
      <div v-if="!selectedPassage" class="search-container">
        <input
          type="text"
          :value="searchQuery"
          @input="handleSearch"
          placeholder="검색어를 입력하세요"
          class="search-input"
        />
        <button class="search-button"><Icon icon="iconamoon:search" width="24" height="24"  style="color: #757575" /></button>
      </div>

      <div :class="contentAreaClass">
        <!-- ✅ 지문 미리보기 -->
        <div v-if="selectedPassage" class="passage-detail">
          <div class="preview-title">{{ selectedPassage.PAS_TITLE }}</div>
          <div class="preview-content">{{ selectedPassage.PAS_CONTENT }}</div>
        </div>

        <!-- ✅ 검색 결과가 없을 때 -->
        <div v-else-if="filteredPassages.length === 0" class="no-results">
          ‘{{ searchQuery }}’에 대한 검색 결과가 존재하지 않습니다.
        </div>

        <!-- ✅ 검색 결과가 있을 때 리스트 표시 -->
        <SearchList v-else :items="filteredPassages" :activeItemId="selectedPassageId" @preview="selectPassage" />
      </div>


      <!-- 버튼 영역 -->
      <div class="modal-footer">
        <!-- 미리보기 화면일 때는 "이전으로" 버튼 표시 -->
        <template v-if="selectedPassage">
          <BaseButton text="이전으로" type="type3" width="140px" height="54px" @click="handleBack"/>
        </template>
        <!-- 리스트 화면일 때는 "닫기" 버튼 표시 -->
        <template v-else>
          <BaseButton text="닫기" type="type3" width="140px" height="54px" @click="closeModal"/>
        </template>
        <BaseButton text="불러오기" type="type1" width="182px" height="54px" @click.stop="handleLoadPassage"/>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BaseModal from "../../BaseModal.vue";
import BaseButton from "@/components/common/button/BaseButton.vue";
import SearchList from "./SearchList.vue";
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';


// 라우터와 스토어 초기화
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const props = defineProps({
  isOpen: Boolean,
});

// 불러오기, 닫기 이벤트 정의
const emit = defineEmits(["close", "loadPassage"]);

const searchQuery = ref("");
const activeTab = ref("recent");
const passages = ref([]);
const selectedPassage = ref(null); // 선택된 지문 저장
const selectedPassageId = ref(null); // 선택된 지문의 ID 저장 (활성화 상태 유지를 위해)

onMounted(() => {
  loadPreviews ();
});

const loadPreviews  = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  fetch(`${apiUrl}/pass/select/prevlist`, {
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
    passages.value = data.map(item => ({
      PAS_CODE: item.passageCode,
      PAS_TITLE: item.passageTitle,
      PAS_KEYWORD: item.subjectKeyword,
      PAS_GIST: item.gist,
      PAS_DATE: item.date,
      PAS_CONTENT: item.content,
      PAS_FAVORITE: item.favorite
    }));
  })
  .catch(error => {

  })
};

// 불러오기 버튼 클릭 시 처리
const handleLoadPassage = () => {
  if (selectedPassage.value) {
    // 부모 컴포넌트에 선택한 지문 전달
    emit("loadPassage", selectedPassage.value);
  } 
  // 미리보기는 아니지만 활성화된 아이템 ID가 있는 경우
  else if (selectedPassageId.value) {
    const activePassage = filteredPassages.value.find(
      p => p.PAS_CODE === selectedPassageId.value
    );
    if (activePassage) {
      emit("loadPassage", activePassage);
    }
  }
  // 위 두 경우가 모두 아니고 필터링된 목록에 지문이 있는 경우
  else if (filteredPassages.value.length > 0) {
    emit("loadPassage", filteredPassages.value[0]);
  }
};

const handleSearch = (event) => {
  searchQuery.value = event.target.value;
};

// 미리보기 버튼을 클릭하면 지문 선택
const selectPassage = (passage) => {
  selectedPassage.value = passage;
  selectedPassageId.value = passage.PAS_CODE;
};

// "이전으로" 버튼 클릭 시 처리 - 미리보기에서 리스트로 돌아가기
const handleBack = () => {
  // 현재 선택된 ID 저장
  const tempId = selectedPassageId.value;

  // 미리보기 상태 해제
  selectedPassage.value = null;

  // ID 상태 유지 (활성화 상태 유지)
  selectedPassageId.value = tempId;
};

// 닫기 버튼 클릭 시 모달 닫기 처리
const closeModal = () => {
  emit("close");
  searchQuery.value = "";
  selectedPassage.value = null; // 선택된 지문 초기화
  selectedPassageId.value = null; // 선택된 지문 ID 초기화
  activeTab.value = "recent"; // 탭 초기화
};

// ✅ 검색어에 따라 목록 필터링
const filteredPassages = computed(() => {
  // 즐겨찾기 탭 상태일 때만 즐겨찾기 필터링
  let list = activeTab.value === 'favorites'
    ? passages.value.filter(passage => passage.PAS_FAVORITE === 1)
    : passages.value;

  // 검색어 필터링 적용
  if (searchQuery.value) {
    list = list.filter(passage =>
      passage.PAS_TITLE.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return list;
});

// ✅ 검색 결과 & 지문 미리보기 상태에 따라 `content-area` 스타일 변경
const contentAreaClass = computed(() => {
  if (selectedPassage.value) {
    return "content-area passage-mode"; // 🔥 미리보기 화면
  } else if (filteredPassages.value.length === 0) {
    return "content-area no-results-mode"; // 🔥 검색 결과 없음
  }
  return "content-area"; // 🔥 기본 목록 표시
});
</script>

<style scoped>
/* 모달 컨테이너 */
.search-modal {
  width: 1232px;
  height: 968px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 40px;
}

/* 제목 및 설명 */
.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.modal-title {
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: -2%;
  color: #303030;
}

.modal-description {
  font-size: 14px;
  color: #757575;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -2%;
}

/* 탭 메뉴 */
.tab-menu {
  display: flex;
  gap: 20px;
}

.tab-menu button {
  background: none;
  border: none;
  font-size: 16px;
  padding: 0px; 
  cursor: pointer;
  color: #757575;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: -2%;
}

.tab-menu button.active {
  border-bottom: 3px solid #ff9f40;
  color: #ff9f40;
}

/* 검색 입력창 */
.search-container {
  display: flex;
  align-items: center;
  width: 500px;
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

/* 중간 내용 박스 */
.content-area{
  width: 1152px;
  height: 582px;
  border-radius: 12px;
  border: 1px solid #BDBDBD;
  background-color: #FFFFFF;
  align-self: center;
  padding: 11px 20px;
}

/* 버튼 영역 */
.modal-footer {
  display: flex;
  gap: 10px;
  align-self: flex-end;
}

/* 검색 결과 없음 메시지 */
.no-results {
  font-weight: 400;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: -2%;
  text-align: center;
}

/* ✅ 검색 결과가 없을 때 추가되는 스타일 */
.content-area.no-results-mode {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* ✅ 선택된 지문 스타일 */
.passage-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.preview-title{
  font-weight: 700;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: -2%;
  align-self: start;
  padding: 15px 0px;
}

.preview-content{
  width: 1,034px;
  height: 485px;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  letter-spacing: -2%;
  padding: 20px 0px;
  text-align: left; /* ✅ 왼쪽 정렬로 변경 */
  overflow-y: auto; /* ✅ 스크롤 가능하도록 추가 (내용이 많을 경우) */
  white-space: pre-wrap; /* ✅ 줄바꿈 유지 */
}
</style>
