<template>
    <div class="app-container">
        <!-- <Sidebar/> 컴포넌트 추가 -->
        <div class="main-content">
            <p id="main-title">지문 생성</p>
            <InputPassageTitle/>
            <PassageContentMain/>   
            <PassageSummary/>
        </div>
    </div>
</template>
<script setup>
import InputPassageTitle from '@/components/generation/passage/PassageContent/InputPassageTitle.vue';
import PassageContentMain from '@/components/generation/passage/PassageContent/PassageContentMain.vue';
import PassageSummary from '@/components/generation/passage/PassageContent/PassageSummary.vue';
</script>
<style scoped>
#main-title {
    position: absolute;
    width: 87px;
    height: 36px;
    left: 292px;
    top: 70px;
    margin: 0px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;
}
</style>