<template>
    <BaseModal :isOpen="isOpen" width="1232px" height="968px" @close="closeModal">
        <div class="question-modal">
            <div class="modal-title">문항 생성하기</div>
            <div class="format-group">
                <div class="for-pattern">
                    <span class="chip-label">문항 유형</span>
                    <div class="chip-group">
                        <BaseButton
                            v-for="type in questionPattern"
                            :key="type.id"
                            class="chip"
                            :text="type.label"
                            type="type3"
                            :width="type.width"
                            height="40px"
                            :class="{ active: activePattern === type.id }"
                            @click="activePattern = type.id"
                        />
                    </div>
                </div>
                <div class="for-type">
                    <span class="chip-label">서술 방식</span>
                    <div class="chip-group">
                        <BaseButton
                            v-for="type in questionTypes"
                            :key="type.id"
                            class="chip"
                            :text="type.label"
                            type="type3"
                            :width="type.width"
                            height="40px"
                            :class="{ active: activeType === type.id }"
                            @click="activeType = type.id"
                        />
                    </div>
                </div>
                <!-- ✅ 난이도 선택 (라디오 버튼 방식) -->
                <div class="for-difficulty">
                    <span class="chip-label">난이도</span>
                    <div class="chip-group">
                        <BaseButton
                            v-for="level in difficultyLevels"
                            :key="level.id"
                            class="chip"
                            :text="level.label"
                            type="type3"
                            :width="level.width"
                            height="40px"
                            :class="{ active: activeDifficulty === level.id }"
                            @click="activeDifficulty = level.id"
                        />
                    </div>
                </div>
            </div>
            <div class="example-group">
                <div class="example-list empty">
                  <div class="empty-list">문항 유형과 서술 방식을 선택해 주세요.</div>
                </div>
                <div class="example-preview">
                    <div class="preview-title">문항 미리보기</div>
                </div>     
            </div>
             <!-- 버튼 영역 -->
            <div class="modal-footer">
                <PlainTooltip id="tooltip" message="생성 시 이용권 1회 차감" width="205px"/>
                <BaseButton text="닫기" type="type3" width="140px" height="54px" @click="closeModal" />
                <BaseButton text="문항 생성하기" type="type1" width="182px" height="54px" disabled/>
            </div>
        </div>
    </BaseModal>
</template>
<script setup>
import { ref } from "vue";
import BaseModal from "../../BaseModal.vue";
import BaseButton from "@/components/common/button/BaseButton.vue";
import PlainTooltip from '@/components/common/PlainTooltip.vue';

const emit = defineEmits(["close"]);

const activePattern = ref(null); // 문항 유형 선택값
const activeType = ref(null); // 서술 방식 선택값
const activeDifficulty = ref(null); // 난이도 선택값

const closeModal = () => {
  emit("close");
  activePattern.value = null;
  activeType.value = null;
  activeDifficulty.value = null;
};

const questionPattern = ref([
    { id: 1, label: "전체", width: "52px"},
    { id: 2, label: "사실적 읽기", width: "96px"},
    { id: 3, label: "추론적 읽기", width: "96px"},
    { id: 4, label: "비판적 읽기", width: "96px"},
    { id: 5, label: "어휘 및 문법", width: "99px"},
]);

const questionTypes = ref([
    { id: 6, label: "전체", width: "52px"},
    { id: 7, label: "정답형", width: "65px"},
    { id: 8, label: "부정형", width: "65px"},
])

const difficultyLevels = ref([
    { id: 9, label: "하", width: "38px" },
    { id: 10, label: "중", width: "38px" },
    { id: 11, label: "상", width: "38px" },
]);


</script>

<style scoped>
/* 모달 컨테이너 */
.question-modal {
  width: 1232px;
  height: 968px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 40px;
}

.modal-title{
font-weight: 700;
font-size: 24px;
line-height: 150%;
letter-spacing: -2%;
}

.format-group{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.for-pattern, .for-type, .for-difficulty  {
    display: flex;
    align-items: center;
    gap: 16px;
}

.chip-label{
font-weight: 400;
font-size: 12.92px;
line-height: 150%;
letter-spacing: -2%;
color:#424242;
width: 50px;
text-align: left;
}

.chip-group{
    display: flex;
    gap: 16px;
}

.chip{
font-weight: 600;
font-size: 16px;
line-height: 150%;
letter-spacing: -2%;
padding: 12px 8px;
border: 1px solid #BDBDBD;
color: #BDBDBD;
}

/* ✅ 활성화된 Chip 스타일 */
.chip.active {
    background-color: #FFEDDC; /* 활성화 Fill 색상 */
    border: 1px solid #FF9F40; /* 활성화 라인 색상 */
    color: #FF9F40; /* 활성화 글씨 색상 */
}

.example-group{
    display: flex;
    gap: 20px;
}

.example-list{
    width: 578px;
    height: 582px;
    border-radius: 20px;
    border: 1px solid #BDBDBD;
    padding: 20px;
    flex-wrap: wrap;
}

.empty{
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-list{
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;
    letter-spacing: -2%;
    text-align: center;
    width: 205px;
}

.example-preview{
    width: 554px;
    height: 582px;
    border-radius: 20px;
    border: 1px solid #BDBDBD;
    padding: 24px;
    display: flex;
}

.preview-title{
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;
    letter-spacing: -2%;
}

/* 버튼 영역 */
.modal-footer {
  display: flex;
  gap: 10px;
  align-self: flex-end;
}

#tooltip{
    position:absolute; top:800px; left:1010px;
}
</style>