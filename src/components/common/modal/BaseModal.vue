<template>
    <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
      <div class="modal-content" :style="modalStyle">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from "vue";
  
  const props = defineProps({
    isOpen: Boolean, // 모달 열림 여부
    width: { type: String, default: "350px" }, // 모달 너비 (기본값: 350px)
    height: { type: String, default: "auto" } // 모달 높이 (기본값: auto)
  });
  
  const emit = defineEmits(["close"]);
  
  const closeModal = () => {
    emit("close");
  };
  
  // 동적으로 스타일 적용
  const modalStyle = computed(() => ({
    width: props.width,
    height: props.height
  }));
  </script>
  
  <style scoped>
  /* 모달 전체 배경 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 모달 박스 */
  .modal-content {
    background: white;
    padding: 22px;
    border-radius: 12px;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #757575;
    gap: 36px;
  }
  
  /* 닫기 버튼 */
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: none;
    font-size: 18px;
    cursor: pointer;
  }
  </style>
  