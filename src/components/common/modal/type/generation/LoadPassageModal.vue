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
          v-model="searchQuery"
          placeholder="검색어를 입력하세요"
          class="search-input"
        />
        <button class="search-button"><Icon icon="iconamoon:search" width="24" height="24"  style="color: #757575" /></button>
      </div>

      <!-- 중간 영역 (리스트 or 상세보기) -->
      <!-- <div :class="contentAreaClass"> -->
        <!-- ✅ 검색 결과가 없을 때 -->
        <!-- <div v-if="filteredPassages.length === 0" class="no-results">
          ‘{{ searchQuery }}’에 대한 검색 결과가 존재하지 않습니다.
        </div> -->
        <!-- ✅ 검색 결과가 있을 때 -->
        <!-- <SearchList v-else :items="filteredPassages" @select="selectItem" />
      </div> -->

        <!-- 중간 영역 (리스트 or 상세보기) -->
        <div :class="contentAreaClass">
          <!-- ✅ 지문 미리보기 -->
          <div v-if="selectedPassage" class="passage-detail">
            <div class="preview-title">{{ selectedPassage.title }}</div>
            <div class="preview-content">{{ selectedPassage.content }}</div>
          </div>

          <!-- ✅ 검색 결과가 없을 때 -->
          <div v-else-if="filteredPassages.length === 0" class="no-results">
            ‘{{ searchQuery }}’에 대한 검색 결과가 존재하지 않습니다.
          </div>

          <!-- ✅ 검색 결과가 있을 때 리스트 표시 -->
          <SearchList v-else :items="filteredPassages" @preview="selectPassage" />
      </div>


      <!-- 버튼 영역 -->
      <div class="modal-footer">
        <BaseButton :text="selectedPassage ? '이전으로' : '닫기'" type="type3" width="140px" height="54px" @click="handleBackOrClose" />
        <BaseButton text="불러오기" type="type1" width="182px" height="54px" :disabled="!selectedPassage" @click="handleLoadPassage"/>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed  } from "vue";
import { Icon } from "@iconify/vue";
import BaseModal from "../../BaseModal.vue";
import BaseButton from "@/components/common/button/BaseButton.vue";
import SearchList from "./SearchList.vue";

const passages = ref([
  {
    id: 1,
    title: "인공지능과 기계 학습 작업명이 보일 예정입니다.",
    content: `인공지능(AI)과 기계 학습(ML)은 현대 기술 발전의 핵심 분야 중 하나로 자리 잡고 있습니다. AI는 인간의 인지 능력을 모방하여 문제 해결, 의사 결정, 예측 분석을 수행할 수 있으며, 기계 학습은 데이터에서 패턴을 학습하고 자동으로 개선되는 알고리즘을 의미합니다. 이러한 기술은 의료, 금융, 제조업, 자율 주행, 자연어 처리 등 다양한 산업에 적용되면서 혁신을 이루고 있습니다.

기계 학습 모델을 구축하려면 먼저 충분한 데이터를 수집하고 전처리 과정을 거쳐야 합니다. 데이터의 품질이 모델 성능에 미치는 영향이 크므로, 데이터 정제 및 이상치 제거가 중요합니다. 그 후, 지도 학습(Supervised Learning)과 비지도 학습(Unsupervised Learning) 기법을 적용하여 모델을 학습시킬 수 있습니다. 지도 학습에서는 레이블이 있는 데이터를 사용하여 모델을 훈련시키고, 비지도 학습에서는 숨겨진 패턴을 찾아내는 방식으로 활용됩니다.

대표적인 기계 학습 알고리즘으로는 선형 회귀(Linear Regression), 로지스틱 회귀(Logistic Regression), 의사결정 나무(Decision Tree), 랜덤 포레스트(Random Forest), 서포트 벡터 머신(SVM) 등이 있습니다. 최근에는 인공 신경망(ANN)과 딥러닝(Deep Learning)이 주목받으며, 이미지 인식, 음성 인식, 자연어 처리 등의 분야에서 뛰어난 성능을 보이고 있습니다.

AI의 발전은 자연어 처리(NLP) 기술을 통해 챗봇, 자동 번역, 감성 분석, 문서 요약 등의 기능을 가능하게 했습니다. 대표적인 NLP 모델로는 OpenAI의 GPT-4, Google의 BERT 등이 있으며, 이들은 대규모 데이터셋을 활용해 문장을 이해하고 생성하는 능력을 가지고 있습니다.

또한, AI는 의료 산업에서도 활용되고 있습니다. 예를 들어, 딥러닝을 활용한 영상 분석 기술은 암 진단, 질병 예측 등의 정확도를 높이는 데 기여하고 있습니다. 금융 분야에서는 AI 기반 추천 시스템이 고객의 소비 패턴을 분석하고, 개인 맞춤형 금융 상품을 제안하는 데 사용됩니다. 자율 주행 자동차의 경우, 컴퓨터 비전과 강화 학습을 활용하여 차량이 주변 환경을 인식하고 안전하게 주행할 수 있도록 돕습니다.

AI의 발전은 윤리적 문제도 동반하고 있습니다. AI가 생성하는 콘텐츠의 신뢰성, 데이터 편향(Bias), 개인정보 보호 문제 등이 지속적으로 논의되고 있습니다. AI 시스템이 공정하고 책임감 있게 개발되기 위해서는 규제 및 정책 마련이 필요하며, 개발자와 연구자들은 AI의 투명성을 높이고 윤리적 가이드라인을 준수해야 합니다.

앞으로 AI 기술은 더욱 발전하여 인간의 일상생활과 산업 전반에 깊이 스며들 것으로 예상됩니다. 하지만 기술이 발전할수록 AI의 사회적 책임과 윤리적 활용에 대한 논의도 함께 이루어져야 합니다. AI와 기계 학습의 지속적인 연구와 혁신을 통해 보다 안전하고 유익한 기술로 발전할 수 있도록 하는 것이 중요합니다.`
  },
  {
    id: 2,
    title: "최근 작업 내역",
    content: "최근 작업한 프로젝트에는 데이터 분석, 웹 개발, 모바일 앱 개발 등이 포함됩니다. 각 작업은 특정 목표를 가지고 있으며, 지속적인 유지보수와 업데이트가 필요합니다."
  },
  {
    id: 3,
    title: "즐겨찾기 목록",
    content: "즐겨찾기 목록에는 자주 방문하는 웹사이트, 즐겨 읽는 기사, 유용한 개발 문서 등이 포함됩니다. 이를 통해 원하는 정보를 빠르게 찾아볼 수 있습니다."
  },
  {
    id: 4,
    title: "AI 관련 작업 불러오기",
    content: "AI 관련 작업을 불러오면 머신러닝 모델, 데이터셋, 학습된 결과 등을 확인할 수 있습니다. 이를 활용하여 새로운 실험을 진행하거나 기존 모델을 개선할 수 있습니다."
  },
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

// 불러오기, 닫기 이벤트 정의
const emit = defineEmits(["close", "loadPassage"]);

const searchQuery = ref("");
const activeTab = ref("recent");
const selectedPassage = ref(null); // ✅ 선택된 지문 저장

// 불러오기 버튼 클릭 시 처리
const handleLoadPassage = () => {
  if (selectedPassage.value) {
    // 부모 컴포넌트에 선택한 지문 전달
    emit("loadPassage", selectedPassage.value);
  }
};

// ✅ 미리보기 버튼을 클릭하면 지문 선택
const selectPassage = (passage) => {
  selectedPassage.value = passage;
};

// ✅ 닫기 버튼 클릭 시 초기화
const handleBackOrClose = () => {
  if (selectedPassage.value) {
    selectedPassage.value = null; // '이전으로' 클릭 시 목록 화면으로 전환
    selectedPassage = { ...selectedPassage };
  } else {
    closeModal(); // '닫기' 클릭 시 모달 닫기
  }
};

const closeModal = () => {
  emit("close");
  searchQuery.value = "";
  selectedPassage.value = null; // 선택된 지문 초기화
};

// ✅ 검색어에 따라 목록 필터링
const filteredPassages = computed(() => {
  if (!searchQuery.value) return passages.value;
  return passages.value.filter((passage) =>
    passage.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
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
