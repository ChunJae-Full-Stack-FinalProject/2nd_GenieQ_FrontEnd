<template>
    <div class="app-container">
        <p id="main-head">문항 생성</p>
        <div class="main-content">
            <PassageTitle/>
            <EditPassageQuestion/>
        </div>
    </div>
</template>
<script setup>
import EditPassageQuestion from './GenerateQuestion/EditPassageQuestion/EditPassageQuestion.vue';
import PassageTitle from './GenerateQuestion/PassageTitle.vue';


</script>
<style scoped>
#main-head {
    position: absolute;
    width: 90px;
    height: 36px;
    left: 292px;
    top: 70px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #16252D;
}
</style>