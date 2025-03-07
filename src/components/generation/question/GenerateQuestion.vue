<template>
    <div class="app-container">
        <p id="main-head">문항 생성</p>
        <div class="main-content">
            <PassageTitle/>
            <EditPassageQuestion @edit-mode-changed="updateEditingMode"/>
            <PassageSummary/>
            <QuestionDescription :isEditing="isEditingGlobal"/>
        </div>
    </div>
</template>
<script>
import EditPassageQuestion from './GenerateQuestion/EditPassageQuestion/EditPassageQuestion.vue';
import PassageTitle from './GenerateQuestion/PassageTitle.vue';
import PassageSummary from '../passage/PassageContent/PassageSummary.vue';
import QuestionDescription from './GenerateQuestion/QuestionDescription.vue';

export default {
    name: 'GenerateQuestion',
    components: {
        EditPassageQuestion,
        PassageTitle,
        PassageSummary,
        QuestionDescription
    },
    data() {
        return {
            isEditingGlobal: false
        }
    },
    methods: {
        updateEditingMode(value) {
            this.isEditingGlobal = value;
        }
    }
}
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