<template>
    <div class="app-container">
        <p id="main-head">문항 생성</p>
        <div class="main-content">
            <InsertPassage/>
            <PaymentUsage/>
            <BaseButton id="reset_button" text="초기화" type="type2" width="248px" height="54px" />
            <BaseButton id="select-type" text="문항 유형 선택하기" type="type1" width="248px" height="54px" @click="showGenerateQuestionModal = true"/>
            <GenerateQuestionModal :isOpen="showGenerateQuestionModal" @close="showGenerateQuestionModal = false"/>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import PaymentUsage from '../PaymentUsage.vue';
import InsertPassage from './QuestionMain/InsertPassage.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import GenerateQuestionModal from '@/components/common/modal/type/generation/GenerateQuestionModal.vue';

const showGenerateQuestionModal = ref(false);
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
#reset_button {
    position: absolute;
    left: 1244px;
    top: 852px;
}
#select-type {
    position: absolute;
    top: 852px;
    left: 1516px;
}
</style>