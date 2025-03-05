<!-- @/components/main/SideNavBarComponent.vue -->
<template>
    <div class="sidebar">
      <div class="logo">
        <h2>GenieQ</h2>
      </div>
      <ul class="nav-links">
        <li>
          <router-link to="/home" :class="{ active: currentPath === '/home' }">
            <span>Home</span>
          </router-link>
        </li>
        <li>
          <router-link to="/generation" :class="{ active: currentPath === '/generation' }">
            <span>문제 생성</span>
          </router-link>
        </li>
      </ul>
    </div>
  </template>
  
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentPath = computed(() => route.path);
</script>

<style scoped>

</style>