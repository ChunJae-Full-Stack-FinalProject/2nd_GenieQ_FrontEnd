<template>
  <div class="search-list">
    <div
      v-for="item in items"
      :key="item.id"
      class="list-item"
      :class="{ active: activeItem === item.id }"
      @click="toggleActive(item.id)"
    >
      <div class="passage-title" :class="{ active: activeItem === item.id }">
        {{ item.title }}
      </div>
      <BaseButton
        class="preview-button"
        text="미리보기"
        type="type3"
        width="87px"
        height="56px"
        :class="{ active: activeItem === item.id }"
        :disabled="activeItem !== item.id"     />
    </div>
  </div>
</template>

   
<script setup>
import { ref, onMounted } from 'vue';
import BaseButton from '@/components/common/button/BaseButton.vue';

const props = defineProps({ items: Array });

const activeItem = ref(null);

// ✅ 첫 번째 항목을 기본 활성화
onMounted(() => {
  if (props.items.length > 0) {
    activeItem.value = props.items[0].id;
  }
});

const toggleActive = (id) => {
  if (activeItem.value !== id) {
    activeItem.value = id;
  }
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
  