<template>
    <div class="app-container">
        <div class="main-content">
            <p id="main-title">지문 생성</p>
            <InputPassageTitle ref="passageTitleRef"/>
            <PassageContentMain ref="passageContentRef"/>   
            <PassageSummary ref="passageSummaryRef"/>
            <BaseButton id="recreate-button" text="재생성하기(1회 차감)" type="type2" width="248px" height="54px"  @click="checkContentLength"/>
            <BaseButton id="save-button" text="저장하기" type="type2" width="248px" height="54px" @click="checkContentLength"/>
            <BaseButton id="download-button" text="추출하기" type="type2" width="248px" height="54px" disabled @click="checkContentLengthAndOpenFileModal()"/>
            <router-link to="/questions">
                <BaseButton id="connect-create-button" text="이어서 문항 생성하기" type="type4" width="520px" height="54px" @click="handleConnectCreate"/>
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

import { ref } from 'vue';

// 모달 상태 관리
const isFileModalOpen = ref(false);
const isConfirmModalOpen = ref(false);

// 컴포넌트 참조
const passageTitleRef = ref(null);
const passageContentRef = ref(null);
const passageSummaryRef = ref(null);

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

// 이어서 문항 생성하기 버튼 클릭 시 데이터 저장
const handleConnectCreate = (event) => {
    if (checkContentLength(event)) {
        // 지문 정보 수집
        const passageData = {
            title: passageTitleRef.value?.getTitle?.() || '',
            content: passageContentRef.value?.getContent?.() || '',
            summary: passageSummaryRef.value?.getSummary?.() || ''
        };
        
        // 로컬 스토리지에 저장
        localStorage.setItem('tempPassageData', JSON.stringify(passageData));
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