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
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="검색어를 입력하세요"
          class="search-input"
        />
        <button class="search-button"><Icon icon="iconamoon:search" width="24" height="24"  style="color: #757575" /></button>
      </div>

      <!-- 중간 영역 (리스트 or 상세보기) -->
      <div :class="contentAreaClass">
        <!-- ✅ 검색 결과가 없을 때 -->
        <div v-if="filteredPassages.length === 0" class="no-results">
          ‘{{ searchQuery }}’에 대한 검색 결과가 존재하지 않습니다.
        </div>
        <!-- ✅ 검색 결과가 있을 때 -->
        <SearchList v-else :items="filteredPassages" @select="selectItem" />
      </div>


      <!-- 버튼 영역 -->
      <div class="modal-footer">
        <BaseButton text="닫기" type="type3" width="140px" height="54px" @click="closeModal" />
        <BaseButton text="불러오기" type="type1" width="182px" height="54px" :disabled="filteredPassages.length === 0"/>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import BaseModal from "../../BaseModal.vue";
import BaseButton from "@/components/common/button/BaseButton.vue";
import SearchList from "./SearchList.vue";

const passages = ref([
  { id: 1, title: "인공지능과 기계 학습 작업명이 보일 예정입니다." },
  { id: 2, title: "최근 작업 내역" },
  { id: 3, title: "즐겨찾기 목록" },
  { id: 4, title: "AI 관련 작업 불러오기" },
  { id: 5, title: "인공지능과 기계 학습 작업명이 보일 예정입니다." },
  { id: 6, title: "최근 작업 내역" },
  { id: 7, title: "즐겨찾기 목록" },
  { id: 8, title: "AI 관련 작업 불러오기" },
  { id: 9, title: "인공지능과 기계 학습 작업명이 보일 예정입니다." },
  { id: 10, title: "최근 작업 내역" },
  { id: 11, title: "즐겨찾기 목록" },
  { id: 12, title: "AI 관련 작업 불러오기" },
]);

const props = defineProps({
  isOpen: Boolean,
});
const emit = defineEmits(["close"]);

const searchQuery = ref("");
const activeTab = ref("recent");

const closeModal = () => {
  emit("close");         // 모달 닫기 이벤트 발생
  searchQuery.value = ""; // 🔥 검색어 초기화
};


// ✅ 검색어에 따라 목록 필터링
const filteredPassages = computed(() => {
  if (!searchQuery.value) return passages.value;
  return passages.value.filter((passage) =>
    passage.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// ✅ 검색 결과 여부에 따라 클래스 변경
const contentAreaClass = computed(() => {
  return filteredPassages.value.length === 0 ? "content-area no-results-mode" : "content-area";
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
</style>
