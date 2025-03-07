<template>
    <div class="insert-passage">
        <p id="insert-head">지문 입력</p>
        <p id="insert-subhead">입력한 지문을 바탕으로 문항을 생성합니다.</p>
        <div class="select-insert-type">
            <p id="user-passage" :class="{ active: activeTab === 'user'}" @click="setActiveTab('user')">
                사용자 입력
            </p>
            <p id="stores-passage" :class="{ active: activeTab === 'stores'}" @click="setActiveTab('stores')">
                자료실 지문
            </p>
        </div>
        <div id="passage-count"><span style="color: #FF9500;">1234</span>/1700</div>

        <div>
            <div v-if="activeTab === 'user'" class="insert-passage-main">
                <UserInsertPassage/>
            </div>
            <div v-else class="insert-passage-main">
                <StoresInsertPassage/>
            </div>
        </div>
    </div>
</template>
<script setup>
import StoresInsertPassage from './StoresInsertPassage.vue';
import UserInsertPassage from './UserInsertPassage.vue';

import { ref } from 'vue';

// 현재 활성화된 탭 상태 관리
const activeTab = ref('user');

const setActiveTab = (tab) => {
    activeTab.value = tab;
};

</script>
<style scoped>
.insert-passage {
    box-sizing: border-box;

    position: absolute;
    width: 928px;
    height: 584px;
    left: 292px;
    top: 118px;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;
}
#insert-head {
    position: absolute;
    height: 30px;
    left: 40px;
    top: 26px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #16252D;
}
#insert-subhead {
    position: absolute;
    height: 24px;
    left: 40px;
    top: 60px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #9D9D9D;
}
.select-insert-type {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 36px;

    position: absolute;
    width: 220px;
    height: 24px;
    left: 40px;
    top: 96px;
}
.select-insert-type > p {
    width: 92px;
    height: 24px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;

    color: #424242;

    flex: none;
    order: 1;
    flex-grow: 0;
}
/* 활성화된 탭 스타일 */
.select-insert-type > p.active {
    color: #FF9F40;
}
#passage-count {
    position: absolute;
    width: 76px;
    height: 24px;
    left: 812px;
    top: 104px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;

    text-align: right;
    letter-spacing: -0.02em;

    color: #BDBDBD;
}
.insert-passage-main {
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 32px;
    gap: 8px;

    position: absolute;
    width: 848px;
    height: 422px;
    left: calc(50% - 848px/2);
    top: 140px;

    background: #FFFFFF;
    border: 1px solid #FF9F40;
    border-radius: 12px;
}

</style>