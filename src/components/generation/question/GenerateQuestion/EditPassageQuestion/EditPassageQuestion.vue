<template>
    <div class="edit-passage-question">
        <EditPassage/>
        <EditQuestion/>
    </div>
</template>
<script setup>
import EditPassage from './EditPassage.vue';
import EditQuestion from './EditQuestion.vue';
</script>
<style scoped>
.edit-passage-question {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 20px;

    position: absolute;
    width: 928px;
    height: 1120px;
    left: 292px;
    top: 176px;
}
</style>