<template>
    <div class="app-container">
        <div class="main-content">
            <p id="main-title">지문 생성</p>
            <InputPassageTitle/>
            <PassageContentMain/>   
            <PassageSummary/>
            <BaseButton id="recreate-button" text="재생성하기(1회 차감)" type="type2" width="248px" height="54px" />
            <BaseButton id="save-button" text="저장하기" type="type2" width="248px" height="54px" />
            <BaseButton id="download-button" text="추출하기" type="type2" width="248px" height="54px" disabled/>
            <BaseButton id="connect-create-button" text="이어서 문항 추출하기" type="type4" width="520px" height="54px" />

        </div>
    </div>
</template>
<script setup>
import InputPassageTitle from '@/components/generation/passage/PassageContent/InputPassageTitle.vue';
import PassageContentMain from '@/components/generation/passage/PassageContent/PassageContentMain.vue';
import PassageSummary from '@/components/generation/passage/PassageContent/PassageSummary.vue';
import BaseButton from '../common/button/BaseButton.vue';
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

#recreate-button {
    position: absolute;
    top: 854px;
    left: 428px;
}
#save-button {
    position: absolute;
    top: 854px;
    left: 700px;
}
#download-button {
    position: absolute;
    top: 854px;
    left: 972px;
}
#connect-create-button {
    position: absolute;
    top: 854px;
    left: 1244px;
}
</style>