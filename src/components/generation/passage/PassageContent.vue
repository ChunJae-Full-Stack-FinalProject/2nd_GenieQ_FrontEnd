<template>
    <div class="app-container">
        <div class="main-content">
            <p id="main-title">지문 생성</p>
            <InputPassageTitle ref="passageTitleRef"/>
            <PassageContentMain ref="passageContentRef" @content-changed="handleContentChange"/>   
            <PassageSummary ref="passageSummaryRef"/>
            <BaseButton id="recreate-button" text="재생성하기" type="type2" width="248px" height="54px" @click="openPaymentUsageModal" :disabled="isContentChanged"/>
            <BaseButton id="save-button" text="저장하기" type="type2" width="248px" height="54px" @click="handleSaveButtonClick" :disabled="!isContentChanged"/>
            <BaseButton id="download-button" text="추출하기" type="type2" width="248px" height="54px" :disabled="isContentChanged || !hasManualSave" @click="checkContentLengthAndOpenFileModal()"/>
            <router-link to="/questions" custom v-slot="{ navigate }">
                <BaseButton id="connect-create-button" text="이어서 문항 생성하기" type="type4" width="520px" height="54px" @click="handleConnectCreate($event, navigate)"/>
            </router-link>
            
            <PlainTooltip id="download-message" message="추출은 저장 후 가능해요" width="205px"/>
            <PlainTooltip id="start-edit" message="필요한 부분을 클릭하고 편집을 시작하세요" width="316px"/>
        </div>

        <!-- 파일 선택 모달 -->
        <FileSelectModal :isOpen="isFileModalOpen" @close="closeFileModal" @confirm="handleFileSelect"/>

        <!-- 글자 수 확인 모달 -->
        <ConfirmModalComponent
            :isOpen="isConfirmModalOpen"
            title="글자 수를 확인해 주세요."
            message="500자 이하의 지문으로 정상적인 문항을 생성하기 어렵습니다. 충분한 지문을 입력해 주세요."
            @close="closeConfirmModal"
            @confirm="closeConfirmModal"
        />

        <!-- 저장하지 않고 페이지 이동 시 경고 모달 -->
        <WarningModalComponent 
            :isOpen="isWarningModalOpen" 
            title="작업을 중단하시겠습니까?" 
            message="마지막 편집 내용은 저장되지 않습니다." 
            cancelText="취소하기"
            confirmText="작업 중단하기"
            @close="cancelNavigation" 
            @confirm="confirmNavigation"
        />
        
        <!-- 결제 사용 모달 -->
        <PaymentUsageModal 
            :isOpen="isPaymentUsageModalOpen"
            @close="closePaymentUsageModal"
            @generate="handleGenerate"
        />
    </div>
</template>
<script setup>
import InputPassageTitle from '@/components/generation/passage/PassageContent/InputPassageTitle.vue';
import PassageContentMain from '@/components/generation/passage/PassageContent/PassageContentMain.vue';
import PassageSummary from '@/components/generation/passage/PassageContent/PassageSummary.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import PlainTooltip from '@/components/common/PlainTooltip.vue';
import FileSelectModal from '@/components/common/modal/type/FileSelectModal.vue';
import ConfirmModalComponent from '@/components/common/modal/type/ConfirmModalComponent.vue';
import WarningModalComponent from '@/components/common/modal/type/WarningModalComponent.vue';
import PaymentUsageModal from '@/components/common/modal/type/generation/PaymentUsageModal.vue';

import { ref, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 모달 상태 관리
const isFileModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const hasManualSave = ref(true); // 초기값을 true로 설정 (초기 상태에서 추출하기 버튼 활성화)
const isContentChanged = ref(false); // 내용 변경 여부 추적 (초기 상태는 변경되지 않음)
const isWarningModalOpen = ref(false); // 경고 모달 상태
const isPaymentUsageModalOpen = ref(false); // 결제 사용 모달 상태

// 네비게이션 관련 변수
const pendingRoute = ref(null); // 대기 중인 라우트 정보 저장

// 컴포넌트 참조
const passageTitleRef = ref(null);
const passageContentRef = ref(null);
const passageSummaryRef = ref(null);

// 라우터 관련 정보 가져오기
const route = useRoute();
const router = useRouter();

// 글자 수 체크 함수
const checkContentLength = (event) => {
    // 내용 길이 검증
    if (passageContentRef.value && !passageContentRef.value.validateContent()) {
        event.preventDefault(); // 라우터 링크 이벤트 방지
        isConfirmModalOpen.value = true;
        return false;
    }
    return true;
};

// 결제 사용 모달 관련 함수
const openPaymentUsageModal = () => {
    if (checkContentLength(new Event('click'))) {
        // 저장된 지문 데이터를 로컬 스토리지에 임시 저장
        const passageData = {
            title: passageTitleRef.value?.getTitle?.() || '',
            content: passageContentRef.value?.getContent?.() || '',
            summary: passageSummaryRef.value?.getSummary?.() || ''
        };
        localStorage.setItem('generateQuestionPassageData', JSON.stringify(passageData));
        
        // 결제 사용 모달 열기
        isPaymentUsageModalOpen.value = true;
    }
};

const closePaymentUsageModal = () => {
    isPaymentUsageModalOpen.value = false;
};

const handleGenerate = () => {
    console.log('지문 재생성 시작');
    // 여기에 지문 재생성 관련 로직 추가
};

// 저장 버튼 클릭 핸들러 추가
const handleSaveButtonClick = (event) => {
    if (checkContentLength(event)) {
        // 지문 데이터 저장 로직
        savePassageData();
        // 저장 버튼 클릭 플래그 설정 (추출하기 버튼 활성화)
        hasManualSave.value = true;
        isContentChanged.value = false; // 저장 후 변경사항 초기화
        return true;
    }
    return false;
};

// 지문 데이터 저장 함수
const savePassageData = () => {
    // 지문 정보 수집
    const passageData = {
        title: passageTitleRef.value?.getTitle?.() || '',
        content: passageContentRef.value?.getContent?.() || '',
        summary: passageSummaryRef.value?.getSummary?.() || ''
    };
    
    // 로컬 스토리지에 저장
    localStorage.setItem('savedPassageData', JSON.stringify(passageData));
    console.log('지문 데이터 저장 완료:', passageData);
    
    // 여기에 API 호출 등 다른 저장 로직 추가 가능
};

// 이어서 문항 생성하기 버튼 클릭 시 데이터 저장
const handleConnectCreate = (event, navigate) => {
    // 내용 길이 확인
    if (checkContentLength(event)) {
        // 내용에 변경사항이 있고 저장되지 않은 상태라면 경고 모달 표시
        if (hasUnsavedChanges()) {
            // 지문 정보 수집 - 저장은 하지 않음
            const passageData = {
                title: passageTitleRef.value?.getTitle?.() || '',
                content: passageContentRef.value?.getContent?.() || '',
                summary: passageSummaryRef.value?.getSummary?.() || ''
            };
            
            // 대기 중인 네비게이션 설정
            isWarningModalOpen.value = true;
            pendingRoute.value = '/questions';
            event.preventDefault();
            return;
        }
        
        // 저장된 상태라면 그냥 이동
        // 지문 정보 수집
        const passageData = {
            title: passageTitleRef.value?.getTitle?.() || '',
            content: passageContentRef.value?.getContent?.() || '',
            summary: passageSummaryRef.value?.getSummary?.() || ''
        };
        
        // 로컬 스토리지에 저장
        localStorage.setItem('tempPassageData', JSON.stringify(passageData));
        navigate(event); // 네비게이션 실행
    } else {
        event.preventDefault(); // 글자 수가 충분하지 않으면 이동 방지
    }
};

// 파일 모달 열기 함수
const openFileModal = () => {
    isFileModalOpen.value = true;
};

// 내용 길이 확인 후 파일 모달 열기
const checkContentLengthAndOpenFileModal = () => {
    if (checkContentLength(new Event('click'))) {
        openFileModal();
    }
};

// 모달 닫기
const closeFileModal = () => {
    isFileModalOpen.value = false;
}

// 확인 모달 닫기
const closeConfirmModal = () => {
    isConfirmModalOpen.value = false;
};

// 파일 형식 선택 처리
const handleFileSelect = (fileType) => {
    // 컴포넌트에서 데이터 수집
    const passageData = {
        title: passageTitleRef.value?.getTitle?.() || '',
        content: passageContentRef.value?.getContent?.() || '',
        summary: passageSummaryRef.value?.getSummary?.() || '',
        fileType: fileType
    };

    console.log('파일 추출하기: ', passageData);
    // 파일 추출 로직 구현
}

// 저장되지 않은 변경사항이 있는지 확인하는 함수
const hasUnsavedChanges = () => {
    // 편집 중인지 확인하고, 내용이 변경됐는데 저장되지 않았는지 확인
    return isContentChanged.value;
};

// 이동 취소 - 현재 화면 유지
const cancelNavigation = () => {
    console.log('네비게이션 취소됨');
    isWarningModalOpen.value = false;
    pendingRoute.value = null;
};

// 이동 확인 - 타겟 페이지로 이동
const confirmNavigation = () => {
    console.log('네비게이션 승인됨, 이동 실행');
    isWarningModalOpen.value = false;

    // 변경 사항이 있었지만, 사용자가 이동을 확인했으므로 관련 상태 초기화
    isContentChanged.value = false;
    hasManualSave.value = true; // 사용자가 명시적으로 저장하지 않기로 함
    
    // 네비게이션 수행
    if (pendingRoute.value) {
        const targetPath = pendingRoute.value;
        pendingRoute.value = null;
        
        // 저장했던 경로로 직접 이동 실행
        router.push(targetPath);
    }
};

// 페이지 이탈 시, 경고 (브라우저 새로고침, 닫기 등)
const handleBeforeUnload = (e) => {
    if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
};

// Vue 인스턴스 참조
const instance = getCurrentInstance();
let routerGuard = null;

onMounted(() => {
    // 브라우저 새로고침, 닫기 등에 대한 이벤트 리스너 추가
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // 전역 네비게이션 가드 설정
    routerGuard = router.beforeEach((to, from, next) => {
        console.log('라우터 가드 호출됨', { from: from.path, to: to.path, current: route.path });
        
        // 현재 라우트에서 다른 라우트로 이동하는 경우에만 확인
        if (from.path === route.path && hasUnsavedChanges()) {
            console.log('저장되지 않은 변경사항 감지됨, 네비게이션 중단 및 모달 표시');
            
            // 저장되지 않은 변경사항이 있다면 모달 표시하고 대기
            isWarningModalOpen.value = true;
            pendingRoute.value = to.fullPath; // 이동하려는 전체 경로 저장
            
            return false; // 네비게이션 중단
        }
        
        console.log('네비게이션 계속 진행');
        return next(); // 네비게이션 계속
    });

    // 로컬 스토리지에서 PassageMain에서 입력한 제목 데이터 로드
    const savedTitle = localStorage.getItem('passageTitle');
    if (savedTitle && passageTitleRef.value) {
        // InputPassageTitle 컴포넌트에 저장된 제목 설정
        passageTitleRef.value.setTitle(savedTitle);
    }
    
    // 필요시 다른 데이터도 로드할 수 있음
    // const savedPassageData = localStorage.getItem('passageInputText');
    // if (savedPassageData && passageContentRef.value) {
    //    passageContentRef.value.setContent(savedPassageData);
    // }
});

onBeforeUnmount(() => {
    // 컴포넌트 해제 시 이벤트 리스너 제거
    window.removeEventListener('beforeunload', handleBeforeUnload);

    // 라우터 가드 제거
    if (routerGuard) {
        routerGuard();
    }
});

// 데이터가 변경될 때마다 호출될 콜백 함수
// 이 함수를 자식 컴포넌트에서 호출하도록 구현하여 내용 변경 감지
const handleContentChange = () => {
    // 내용이 변경되면 저장 플래그 초기화 (추출하기 버튼 비활성화)
    hasManualSave.value = false;
    isContentChanged.value = true;
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
    margin: 0px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;
}

#recreate-button {
    position: absolute;
    top: 854px;
    left: 428px;
}
#save-button {
    position: absolute;
    top: 854px;
    left: 700px;
}
#download-button {
    position: absolute;
    top: 854px;
    left: 972px;
}
#connect-create-button {
    position: absolute;
    top: 854px;
    left: 1244px;
}
#download-message {
    position: absolute;
    top: 803px;
    left: 1059px;
}
#start-edit {
    position: absolute;
    top: 185px;
    left: 800px;
}
</style>