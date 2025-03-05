<template>
    <div class="search-list">
      <div v-for="item in items" :key="item.id" class="list-item" @click="$emit('select', item)">
        <span>{{ item.title }}</span>
        <BaseButton text="미리보기" type="type3" width="80px" />
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({ items: Array });
  </script>
  
  <style scoped>
  .search-list {
    width: 100%;
    max-height: 250px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .list-item:hover {
    background: #f8f8f8;
  }
  </style>
  