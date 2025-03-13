<template>
    <div id="payment-usage">
        <div class="credit-container">
            <p id="credit-head">결제</p>
            <div class="credit-container-main">
                <div class="credit-row">
                    <div class="credit-type">보유 이용권</div>
                    <div class="credit-count">{{creditcount}}회</div>
                </div>
                
                <div class="credit-row">
                    <div class="credit-type">사용 예정 이용권</div>
                    <div class="credit-count"><span style="color: #FF9500;">1</span>회</div>
                </div>
                
                <div v-if="creditcount > 0" class="credit-row accent-bg">
                    <div class="credit-type">잔여 이용권</div>
                    <div class="credit-count">{{creditcount-1}}회</div>
                </div>
                <div v-else class="credit-row accent-bg">
                    <div class="credit-type">※ 보유하신 잔여 이용권이 모두 소진되었습니다.</div>
                </div>
            </div>
        </div>
        <p id="note">※ 생성이 시작된 중단 및 취소가 불가능합니다.</p>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const creditcount = ref(10);//수정하기

// 이벤트 정의
const emit = defineEmits(['credit-update']);

// creditcount 변경 감지
watch(creditcount, (newValue) => {
    emit('credit-update', newValue);
});

// creditcount를 외부에 노출
const updateCreditCount = (count) => {
  creditcount.value = count;
  emit('credit-update', count);
};

// 컴포넌트 마운트 시 이벤트 발생
onMounted(() => {
    emit('credit-update', creditcount.value);
});

// 외부에서 사용할 수 있도록 defineExpose 사용
defineExpose({
  creditcount,
  updateCreditCount
});
</script>
<style scoped>
#payment-usage {
    box-sizing: border-box;

    position: absolute;
    width: 520px;
    height: 660px;
    left: 1244px;
    top: 118px;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;
}
.credit-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 20px;

    position: absolute;
    width: 480px;
    height: 248px;
    left: calc(50% - 480px/2);
    top: 20px;
}
#credit-head {
    width: 480px;
    height: 36px;
    margin: 0px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
.credit-container-main {
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;

    width: 480px;
    height: 192px;

    border: 1px solid #FF9F40;
    border-radius: 8px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
 }
.credit-row {
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 13px;
    gap: 225px;

    width: 480px;
    height: 64px;

    border-bottom: 1px solid #FF9F40;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
.credit-type {
    height: 24px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;

    flex: none;
    order: 0;
    flex-grow: 0;
}
.credit-count {
    height: 24px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;

    flex: none;
    order: 1;
    flex-grow: 0;
}
.accent-bg {
    background: rgba(255, 159, 64, 0.2);
    border: none;
    border-radius: 0 0 8px 8px;
}
#note {
    position: absolute;
    width: 238px;
    height: 20px;
    left: 20px;
    top: 280px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #E84739;
}
</style>