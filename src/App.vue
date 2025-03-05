<template>
  <header>

    <div class="wrapper">

      <nav>
        <Icon icon="ic:baseline-content-paste" width="24" height="24" />
        <RouterLink to="/home">Home</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
<style scoped>

@media (min-width: 1024px) {

}
</style>
