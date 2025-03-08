<template>
    <div class="app-container">
        <p id="main-head">문항 생성</p>
        <div class="main-content">
            <InsertPassage/>
            <PaymentUsage/>
            <BaseButton id="reset_button" text="초기화" type="type2" width="248px" height="54px" @click="resetPassage"/>
            <BaseButton id="select-type" text="문항 유형 선택하기" type="type1" width="248px" height="54px" @click="showGenerateQuestionModal = true"/>
            <GenerateQuestionModal :isOpen="showGenerateQuestionModal" @close="showGenerateQuestionModal = false"/>
            <LoadPassageModal :isOpen="showLoadPassageModal" @close="showLoadPassageModal = false" @loadPassage="handleLoadPassage"/>
        </div>
    </div>
</template>
<script setup>
import { ref, provide} from "vue";
import PaymentUsage from '../PaymentUsage.vue';
import InsertPassage from './QuestionMain/InsertPassage.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import GenerateQuestionModal from '@/components/common/modal/type/generation/GenerateQuestionModal.vue';
import LoadPassageModal from "@/components/common/modal/type/generation/LoadPassageModal.vue";

const showGenerateQuestionModal = ref(false);
const showLoadPassageModal = ref(false);

// 지문 상태 및 메서드
const currentPassage = ref({
    title: '',
    content: ''
});

// 지문 설정 함수
const setPassage = (passage) => {
    currentPassage.value = passage;
};

// 지문 초기화 함수
const resetPassage = () => {
    currentPassage.value = {
        title: '',
        content: ''
    };
};

// LoadPassageModal에서 지문 선택 시 호출될 함수
const handleLoadPassage = (passage) => {
    setPassage(passage);
    showLoadPassageModal.value = false;
};

// "지문 불러오기" 버튼 클릭 시 모달 열기 (InsertPassage에서 호출)
const openLoadPassageModal = () => {
    showLoadPassageModal.value = true;
};

// provide를 통해 하위 컴포넌트에 상태와 메서드 제공
provide('passageData', {
    currentPassage, setPassage, resetPassage, openLoadPassageModal
});
</script>
<style scoped>
.app-container {
    width: 100%;
    padding: 20px 30px 80px 20px;
}
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