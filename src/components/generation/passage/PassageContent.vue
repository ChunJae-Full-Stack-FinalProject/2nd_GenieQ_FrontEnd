<template>
    <div class="app-container">
        <p id="main-title">지문 생성</p>
        <div class="main-content">
            <CreatePassageMain ref="createPassageMainRef" @input-change="updateInputText" @category-change="updateCategory"/>
            <PaymentUsage ref="paymentUsageRef" @credit-update="onCreditUpdate"/>
            <BaseButton id="reset_button" text="초기화" type="type2" width="248px" height="54px" :disabled="!hasContent" @click="resetText"/>
            <BaseButton 
                id="create_button" 
                text="지문 생성하기" 
                type="type2" 
                width="248px" 
                height="54px"
                :disabled="!isButtonEnabled"
                @click="handleCreatePassage"
            />
            
            <!-- 확인 모달 추가 -->
            <WarningModalComponent
                :isOpen="isConfirmModalOpen"
                title="지문을 생성하시겠습니다?"
                message="생성 시 이용권이 차감되며, 오타가 있을 경우 AI가 잘못된 지문을 생성할 수 있습니다."
                cancelText="취소하기"
                confirmText="생성하기"
                @close="closeConfirmModal"
                @confirm="confirmCreatePassage"
            />
            
            <!-- 경고 모달 추가 -->
            <WarningModalComponent
                :isOpen="isWarningModalOpen"
                title="작업 내역 초과"
                message="최근 작업 내역이 가득 찼습니다. 이전 작업을 삭제하고 진행하시겠습니까?"
                cancelText="취소하기"
                confirmText="삭제 후 진행하기"
                @close="closeWarningModal"
                @confirm="confirmAfterWarning"
            />
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import CreatePassageMain from '@/components/generation/passage/PassageMain/CreatePassageMain.vue';
import PaymentUsage from '@/components/generation/PaymentUsage.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import ConfirmModalComponent from '@/components/common/modal/type/ConfirmModalComponent.vue';
import WarningModalComponent from '@/components/common/modal/type/WarningModalComponent.vue';
import PaymentUsageModal from '@/components/common/modal/type/generation/PaymentUsageModal.vue';

import { ref, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePassageStore } from '@/stores/passage';

// 모달 상태 관리
const isConfirmModalOpen = ref(false);
const isWarningModalOpen = ref(false);

// 수정 필요한 코드
const isButtonEnabled = computed(() => {
    // 입력 텍스트가 있고 보유 이용권이 0보다 커야 버튼 활성화
    return inputText.value.length >= 1 && creditCountValue.value > 0;
});

// PaymentUsage 컴포넌트에서 이용권 업데이트 시 호출될 함수
const onCreditUpdate = (count) => {
    creditCountValue.value = count;
};


// 지문 제재 초기화 함수
const resetText = () => {
    inputText.value = '';

    if (createPassageMainRef.value) {
        createPassageMainRef.value.resetForm();
    }
}

const hasContent = computed(() => {
    return inputText.value && inputText.value.trim().length > 0;
})

const updateInputText = (text) => {
    inputText.value = text;
};

const updateCategory = (category) => {
    selectedCategory.value = category;
}

// 지문 생성하기 버튼 클릭 핸들러
const handleCreatePassage = () => {
    // 최근 작업 내역이 가득 찼는지 확인하는 로직
    const isWorkHistoryFull = checkWorkHistoryFull();
    
    if (isWorkHistoryFull) {
        // 작업 내역이 가득 찬 경우 경고 모달 표시
        isWarningModalOpen.value = true;
    } else {
        // 일반적인 경우 확인 모달 표시
        isConfirmModalOpen.value = true;
    }
};

// 최근 작업 내역이 가득 찼는지 확인하는 함수
const checkWorkHistoryFull = () => {
    // 여기에 작업 내역 확인 로직 구현
    // 예: 로컬 스토리지에서 작업 내역 개수 확인 등
    
    // 현재는 테스트를 위해 임의의 값 반환 (실제로는 적절한 로직으로 대체)
    // return Math.random() > 0.5; // 50% 확률로 가득 참/아님 반환
    return false; // 기본값은 가득 차지 않음
}

// 확인 모달 관련 핸들러
const closeConfirmModal = () => {
    isConfirmModalOpen.value = false;
};

const confirmCreatePassage = () => {
    saveDataAndNavigate();
};

// 경고 모달 관련 핸들러
const closeWarningModal = () => {
    isWarningModalOpen.value = false;
};

const confirmAfterWarning = () => {
    // 여기서 이전 작업 삭제 로직 추가 가능
    // 예: 로컬 스토리지에서 이전 작업 데이터 삭제
    
    saveDataAndNavigate();
};

// 데이터 저장 및 페이지 이동 함수
const saveDataAndNavigate = () => {
    // 필요한 데이터 수집
    const passageData = {
        title: passageTitleRef.value?.getTitle?.() || '',
        content: inputText.value,
        category: selectedCategory.value
    };
    
    // 로컬 스토리지에 데이터 저장
    localStorage.setItem('passageTitle', passageData.title);
    localStorage.setItem('passageContent', passageData.content);
    localStorage.setItem('passageCategory', passageData.category);
    
    // 통합 데이터도 저장 (다른 페이지에서 사용 가능)
    localStorage.setItem('passageData', JSON.stringify(passageData));
    
    // 다음 페이지로 이동
    router.push('/passage/create');

    // 컴포넌트 마운트 시 실행
    onMounted(() => {
    // paymentUsageRef가 설정된 후 creditcount 값을 가져오기 위한 코드
    setTimeout(() => {
        if (paymentUsageRef.value && paymentUsageRef.value.creditcount) {
            creditCountValue.value = paymentUsageRef.value.creditcount.value;
        }
    }, 0);
});

};
</script>
<style scoped>
.app-container {
    width: 100%;
    padding: 20px 30px 80px 20px;
}
#main-title {
    position: absolute;
    width: 87px;
    height: 36px;
    left: 292px;
    top: 70px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;
}
#reset_button {
    position: absolute;
    left: 1244px;
    top: 852px;
}
#create_button {
    position: absolute;
    left: 1516px;
    top: 852px;
}
</style>