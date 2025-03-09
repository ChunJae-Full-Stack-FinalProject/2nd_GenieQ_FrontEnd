<template>
    <div class="app-container">
        <p id="main-head">문항 생성</p>
        <div class="main-content">
            <PassageTitle/>
            <EditPassageQuestion ref="editPassageQuestionRef" @edit-mode-changed="updateEditingMode"/>
            <PassageSummary/>
            <QuestionDescription :isEditing="isEditingGlobal" :questionData="questionData"/>
            <div class="button-container">
                <BaseButton text="문항 추가하기" type="type2" id="add-button" width="248px" height="54px" @click="handleButtonClick"/>
                <BaseButton text="저장하기" type="type2" id="save-button" width="248px" height="54px" @click="handleButtonClick"/>
                <BaseButton text="추출하기" type="type2" id="download-button" width="248px" height="54px" disabled @click="handleButtonClick"/>
            </div>
            <PlainTooltip id="download-tooltip" message="추출은 저장 후 가능해요" width="203px" />
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EditPassageQuestion from './GenerateQuestion/EditPassageQuestion/EditPassageQuestion.vue';
import PassageTitle from './GenerateQuestion/PassageTitle.vue';
import PassageSummary from '../passage/PassageContent/PassageSummary.vue';
import QuestionDescription from './GenerateQuestion/QuestionDescription.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import PlainTooltip from '@/components/common/PlainTooltip.vue';

const isEditingGlobal = ref(false);
const pattern = ref(null);
const type = ref(null);
const questionData = ref(null);

// EditPassageQuestion 컴포넌트 참조
const editPassageQuestionRef = ref(null);

// 버튼 클릭 핸들러
const handleButtonClick = () => {
  // EditPassage의 글자 수 검증
  if (editPassageQuestionRef.value) {
    return editPassageQuestionRef.value.validatePassageLength();
  }
  return true;
};

const updateEditingMode = (value) => {
  isEditingGlobal.value = value;
};

// 라우터 관련 정보 가져오기
const route = useRoute();
const router = useRouter();

onMounted(() => {
  // URL 쿼리 파라미터에서 문항 유형과 서술 방식 가져오기
  if (route.query) {
    pattern.value = route.query.pattern || null;
    type.value = route.query.type || null;
  }

  // 라우터 state에서 선택된 문항 데이터 가져오기
  if (route.state && route.state.questionData) {
    questionData.value = route.state.questionData;
    console.log('전달받은 문항 데이터 : ', questionData.value);
  }
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
.button-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 154px 0px 272px;
    gap: 24px;

    position: absolute;
    width: 1762px;
    height: 54px;
    left: 160px;
    top: 1326px;
}
#add-button {
    flex: none;
    order: 0;
    flex-grow: 0;
}
#save-button {
    flex: none;
    order: 1;
    flex-grow: 0;
}
#download-button {
    flex: none;
    order: 2;
    flex-grow: 0;
}
#download-tooltip {
    position: absolute;
    top: 1277px;
    left: 1070px;
}
</style>