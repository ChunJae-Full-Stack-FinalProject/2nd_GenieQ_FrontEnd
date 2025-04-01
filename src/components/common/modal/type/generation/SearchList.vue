<template>
  <div class="search-list">
    <div
      v-for="item in items"
      :key="item.PAS_CODE"
      class="list-item"
      :class="{ active: activeItem === item.PAS_CODE }"
      :data-id="item.PAS_CODE"
      @click="toggleActive(item.PAS_CODE)"
    >
      <div class="passage-title" :class="{ active: activeItem === item.PAS_CODE }">
        {{ item.PAS_TITLE }}
      </div>
      <BaseButton
        class="preview-button"
        text="미리보기"
        type="type3"
        width="87px"
        height="56px"
        :class="{ active: activeItem === item.PAS_CODE }"
        :disabled="activeItem !== item.PAS_CODE" 
        @click.stop="previewPassage(item)" />
    </div>
  </div>
</template>

   
<script setup>
import { ref, onMounted, watch } from 'vue';
import BaseButton from '@/components/common/button/BaseButton.vue';

const props = defineProps({ 
  items: Array,
  activeItemId: Number // 부모 컴포넌트에서 전달받은 활성화 ID
});

const emit = defineEmits(["preview"]);

const activeItem = ref(null);

watch(() => props.activeItemId, (newVal) => {
  // console.log('[SearchList] activeItemId 변경됨:', newVal);
  if (newVal) {
    activeItem.value = newVal;
    // console.log('[SearchList] activeItem 설정됨:', activeItem.value);

    // 활성화된 항목으로 화면 포커싱
    setTimeout(() => {
      const activeElement = document.querySelector(`.list-item[data-id="${newVal}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior:'smooth', block: 'center' });
      }
    }, 100);
  }
}, { immediate: true });

// ✅ 탭이 변경될 때 첫 번째 항목 활성화 처리
watch(() => props.items, (newItems) => {
  // console.log('[SearchList] items 변경됨, 길이:', newItems.length);
  if (newItems.length > 0) {
    // activeItem.value = newItems[0].PAS_CODE; // 주석 처리 - 부모의 activeItemId 우선시
    
    // 부모로부터 받은 activeItemId가 없을 때만 첫 번째 항목 활성화
    if (!props.activeItemId) {
      activeItem.value = newItems[0].PAS_CODE;
      // console.log('[SearchList] 첫 번째 항목 활성화:', activeItem.value);
    }
  }
}, { immediate: true });

// ✅ 첫 번째 항목을 기본 활성화
onMounted(() => {
  // 부모에서 전달받은 activeItemId가 있다면 그 값을 사용, 없으면 첫 번째 항목 활성화
  if (props.activeItemId) {
    activeItem.value = props.activeItemId;
  } else if (props.items.length > 0) {
    activeItem.value = props.items[0].PAS_CODE;
  }
});

const toggleActive = (PAS_CODE) => {
  // console.log('[SearchList] 항목 클릭됨:', PAS_CODE);
  if (activeItem.value !== PAS_CODE) {
    activeItem.value = PAS_CODE;
    // console.log('[SearchList] 활성 항목 변경됨:', activeItem.value);
    
    // 부모에게 활성화 ID 변경 알림 추가
    emit("activeItemChange", PAS_CODE);
  }
};

const previewPassage = (item) => {
  emit("preview", item); // 부모에게 선택된 지문 전달
};
</script>
  
<style scoped>
  .search-list {
    width: 1,053px;
    max-height: 560px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    font-size: 16px;
    cursor: pointer;
  }

  /* ✅ 활성화된 passage-title 스타일 변경 */
  .passage-title {
    border: 1px solid #BDBDBD;
    width: 950px;
    height: 56px;
    border-radius: 6px;
    padding: 16px;
    font-weight: 500;
    line-height: 150%;
    letter-spacing: -2%;
    color: #BDBDBD;
    text-align: left;
  }

  /* 🔥 활성화된 passage-title 스타일 */
  .passage-title.active {
    border-color: #303030; /* 변경할 border 색 */
    color: #303030; /* 변경할 글자색 */
  }

  /* ✅ 활성화된 버튼 스타일 */
  .preview-button {
    font-weight: 600;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: -2%;
  }

  /* 🔥 활성화된 preview-button 스타일 */
  .preview-button.active {
    border-color: #303030 !important;
    color: #303030 !important;
  }
</style>
  