<template>
    <BaseModal :isOpen="isOpen" width="435px" height="600px" @close="closeModal">
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
                    
                    <div v-if="creditcount>0" class="credit-row accent-bg">
                        <div class="credit-type">잔여 이용권</div>
                        <div class="credit-count">{{creditcount-1}}회</div>
                    </div>
                    <div v-else="creditcount=0" class="credit-row accent-bg">
                        <div class="credit-type">※ 보유하신 잔여 이용권이 모두 소진되었습니다.</div>
                    </div>
                </div>
            </div>
            <p id="note">※ 생성이 시작된 중단 및 취소가 불가능합니다.</p>

            <div v-if="creditcount>0"class="btn-container">
                <BaseButton text="닫기" type="type3" width="140px" height="54px" @click="closeModal"></BaseButton>
                <BaseButton :text="createText" width="300px" height="54px" @click="generateQuestion"></BaseButton>
            </div>
    
            <div v-else="creditcount=0"class="btn-container">
                <BaseButton text="닫기" type="type3" width="140px" height="54px" @click="closeModal"></BaseButton>
                <BaseButton text="이용권 구매하기" width="300px" height="54px" @click="goToTicketPage"></BaseButton>
            </div>
        </div>
    </BaseModal>
</template> 
<script setup>
import { ref, watch, onMounted } from "vue";
import BaseModal from "../../BaseModal.vue";
import BaseButton from "@/components/common/button/BaseButton.vue";
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const emit = defineEmits(["close", "generate", 'credit-update']);

const props = defineProps({
  isOpen: Boolean,
  createText: {type: String, default: "생성하기"}
});

const creditcount = ref(0); // 초기값 0
const authStore = useAuthStore();

// creditcount 변경 감지
watch(creditcount, (newValue) => {
    emit('credit-update', newValue);
});

// creditcount를 외부에 노출
const updateCreditCount = (count) => {
    creditcount.value = count || authStore.userTicketCount;
    emit('credit-update', creditcount.value);
};

// 컴포넌트 마운트 시 이벤트 발생
onMounted(() => {
    // authStore의 updateTicketCount 메서드 호출
    authStore.updateTicketCount()
        .then(count => {
            console.log("[PaymentUsage] 티켓 정보 로드 완료:", count);
            creditcount.value = count; // 반환된 값으로 creditcount 업데이트
            emit('credit-update', creditcount.value);
        })
        .catch(error => {
            console.error("[PaymentUsage] 티켓 정보 로드 실패:", error);
            // 에러 발생 시 기본값 혹은 현재 authStore에 있는 값 사용
            creditcount.value = authStore.userTicketCount;
            emit('credit-update', creditcount.value);
        });
});

const closeModal = () => {
  emit("close");
}

// 생성하기 버튼 클릭시 호출
const generateQuestion = () => {
  // 이전 로직 유지
  const savedPassageData = localStorage.getItem('generateQuestionPassageData');
  const selectedQuestionData = localStorage.getItem('selectedQuestionData');

  try {
    // 생성 이벤트 발생 - 부모 컴포넌트에 알림
    emit("generate");
    
    // 모달 닫기
    emit("close");
  } catch (error) {
    console.error('문항 생성 중 오류:', error);
  }
}

// 이용권 구매하기 버튼 클릭시 호출 - 변경된 부분
const goToTicketPage = () => {
  try {
    // 마이페이지로 이동하면서 이용권 탭 선택
    router.push({
      path: '/mypage',
      query: { tab: '이용권' }
    });
    
    // 모달 닫기
    emit("close");
  } catch (error) {
    console.error('페이지 이동 중 오류:', error);
  }
};

// 외부에서 사용할 수 있도록 defineExpose 사용
defineExpose({
  creditcount,
  updateCreditCount
});
</script>
<style scoped>
.credit-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 20px;

    position: absolute;
    left: 19px;
    top: 52px;
}
#credit-head {
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;
}
.credit-container-main {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;

    width: 397px;
    height: 192px;

    border: 1px solid #FF9F40;
    border-radius: 8px;
}
.credit-row {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 13px;
    gap: 225px;

    width: 397px;
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
    top: 308px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #E84739;
}
.btn-container{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 20px;

    position: absolute;
    width: 395px;
    height: 54px;
    left: 20px;
    top: 519px;
}
</style>