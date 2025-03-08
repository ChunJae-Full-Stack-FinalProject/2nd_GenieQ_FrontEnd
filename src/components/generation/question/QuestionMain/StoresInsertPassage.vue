<template>
    <div>
        <div v-if="!currentPassage.content" class="stores-passage-empty">
            <button class="stores-passage" @click="openLoadPassageModal">
                <Icon icon="material-symbols:bookmark" id="bookmark-icon" style="color: #424242" />
                <p id="text">자료실에서 지문 불러오기</p>
            </button>
        </div>
        <div v-else class="stores-passage-content">
            <div class="passage-textarea-container">
                <textarea id="stores-passage-text" v-model="passageContent" readonly placeholder="지문을 불러와주세요"></textarea>
            </div>
        </div>

        <!-- 지문 불러오기 모달 -->
        <LoadPassageModal :isOpen="showLoadPassageModal" @close="showLoadPassageModal = false"/>
    </div>
</template>
<script setup>
import { ref, inject, computed, watch } from "vue";
import LoadPassageModal from '@/components/common/modal/type/generation/LoadPassageModal.vue';

// 부모 컴포넌트에서 제공하는 데이터 주입
const { currentPassage, openLoadPassageModal } = inject('passageData');

// 지문 내용을 위한 반응형 변수
const passageContent = computed({
    get: () => currentPassage.value.content || '',
    set: (newValue) => {
        currentPassage.value.content = newValue;
    }
});
</script>
<style scoped>
.stores-passage {
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 8px;
    gap: 4px;

    position: absolute;
    width: 280px;
    height: 120px;
    top: 151px;
    left: 284px;

    border: 1px solid #424242;
    border-radius: 12px;

    background-color: #FFFFFF;
    cursor: pointer;
}
#bookmark-icon {
    position: absolute;
    top: 10px;
    left: 125px;

    width: 39px;
    height: 52px;
}
#text {
    position: absolute;
    top: 67px;
    left: 42px;

    width: 196px;
    height: 30px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;

    text-align: center;
    letter-spacing: -0.02em;
    color: #424242;

    flex: none;
    order: 0;
    flex-grow: 0;
}
#user-passage-text {
    width: 756px;
    height: 358px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;

    letter-spacing: -0.02em;
    color: #303030;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 1;

    border: none;
    outline: none; /* 포커스 된 경우의 파란 테두리 삭제 */
    resize: none;
}
#stores-passage-text {
    width: 756px;
    height: 358px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;

    letter-spacing: -0.02em;
    color: #303030;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 1;

    border: none;
    outline: none; /* 포커스 된 경우의 파란 테두리 삭제 */
    resize: none;
}
</style>