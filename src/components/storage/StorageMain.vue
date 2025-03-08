<template>
    <div class="app-container">
       <LikeList1></LikeList1>
       <WorkList1></WorkList1>
    </div>
</template>
<script setup>
import LikeList1 from './storageContent/MainCompo/LikeList1.vue';
import WorkList1 from './storageContent/MainCompo/WorkList1.vue';
</script>
<style>
.app-container {
    width: 100%;
    padding: 20px 30px 80px 20px;
}
</style>