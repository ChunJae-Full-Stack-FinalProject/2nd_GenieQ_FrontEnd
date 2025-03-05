<template>
  <BaseModal :isOpen="isOpen" width="1232px" height="880px" @close="closeModal">
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
        <button class="search-button">🔍</button>
      </div>

      <!-- 검색 결과 -->
      <div class="search-results">
        <p v-if="searchQuery && !hasResults">‘{{ searchQuery }}’에 대한 검색 결과가 존재하지 않습니다.</p>
      </div>

      <!-- 중간 영역 (리스트 or 상세보기) -->
      <SearchList v-if="!selectedItem" :items="items" @select="selectItem" />
      <SearchDetail v-else :item="selectedItem" @back="selectedItem = null" />

      <!-- 버튼 영역 -->
      <div class="modal-footer">
        <BaseButton text="닫기" type="type3" width="140px" height="54px" @click="closeModal" />
        <BaseButton text="불러오기" type="type1" width="182px" height="54px" />
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from "vue";
import BaseModal from "../../BaseModal.vue";
import BaseButton from "@/components/common/button/BaseButton.vue";
import SearchList from "./SearchList.vue";

const props = defineProps({
  isOpen: Boolean,
});
const emit = defineEmits(["close"]);

const searchQuery = ref("");
const activeTab = ref("recent");

const closeModal = () => {
  emit("close");
};

const hasResults = computed(() => {
  return false; // 실제 데이터 연동 시 변경
});
</script>

<style scoped>
/* 모달 컨테이너 */
.search-modal {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 왼쪽 정렬 */
  gap: 16px;
  padding: 20px;
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
  padding: 10px 20px;
  cursor: pointer;
  color: #757575;
  font-weight: bold;
}

.tab-menu button.active {
  border-bottom: 3px solid #ff9f40;
  color: #ff9f40;
}

/* 검색 입력창 */
.search-container {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
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

/* 검색 결과 */
.search-results {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
  color: #757575;
}

/* 버튼 영역 */
.modal-footer {
  display: flex;
  gap: 10px;
  align-self: flex-end;
}
</style>
