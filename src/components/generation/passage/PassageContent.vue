<template>
    <div class="app-container">
        <p id="main-title">지문 생성</p>
        <div class="main-content">
            <PassageContentMain ref="passageContentRef" @content-changed="handleContentChange"/>   
            <PassageSummary ref="passageSummaryRef"/>
            <BaseButton v-if="!isFromRoute" id="recreate-button" text="재생성하기" type="type2" width="248px" height="54px" @click="openPaymentUsageModal" :disabled="isContentChanged"/>
            <BaseButton id="save-button" text="저장하기" type="type2" width="248px" height="54px" @click="handleSaveButtonClick" :disabled="!isContentChanged"/>
            <BaseButton id="download-button" text="추출하기" type="type2" width="248px" height="54px" :disabled="isContentChanged || !hasManualSave" @click="checkContentLengthAndOpenFileModal()"/>
            <router-link to="/questions" custom v-slot="{ navigate }">
                <BaseButton id="connect-create-button" text="이어서 문항 생성하기" type="type4" width="520px" height="54px" @click="handleConnectCreate($event, navigate)" :disabled="isContentChanged" />
            </router-link>
            
            <PlainTooltip id="start-edit" message="필요한 부분을 클릭하고 편집을 시작하세요" width="316px"/>
        </div>
        <!-- 파일 선택 모달 -->
        <FileSelectModal :isOpen="isFileModalOpen" @close="closeFileModal" @confirm="handleFileSelect" />
        <!-- 글자 수 확인 모달 -->
        <ConfirmModalComponent :isOpen="isConfirmModalOpen" title="글자 수를 확인해 주세요." message="500자 이하의 지문으로 정상적인 문항을 생성하기 어렵습니다. 충분한 지문을 입력해 주세요." @close="closeConfirmModal"            @confirm="closeConfirmModal" />
        <!-- 저장하지 않고 페이지 이동 시 경고 모달 -->
        <WarningModalComponent :isOpen="isWarningModalOpen" title="작업을 중단하시겠습니까?" message="마지막 편집 내용은 저장되지 않습니다." cancelText="취소하기" confirmText="작업 중단하기" @close="cancelNavigation" @confirm="confirmNavigation" />
        <!-- 결제 사용 모달 -->

        <PaymentUsageModal 
            :isOpen="isPaymentUsageModalOpen"
            @close="closePaymentUsageModal"
            @generate="handleGenerate"
        />

        <!-- 저장 성공 모달 -->
        <ConfirmModalComponent
            :isOpen="isSaveSuccessModalOpen"
            title="확인"
            :message="saveSuccessMessage"
            @close="closeSaveSuccessModal"
            @confirm="closeSaveSuccessModal"
        />

        <!-- 로딩 표시 추가 -->
        <div v-if="isLoading" class="loading-overlay">
            <div class="loading-spinner"></div>
            <p>{{ loadingMessage }}</p>
        </div>
    </div>
</template>
<script setup>
import PassageContentMain from '@/components/generation/passage/PassageContent/PassageContentMain.vue';
import PassageSummary from '@/components/generation/passage/PassageContent/PassageSummary.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import PlainTooltip from '@/components/common/PlainTooltip.vue';
import FileSelectModal from '@/components/common/modal/type/FileSelectModal.vue';
import ConfirmModalComponent from '@/components/common/modal/type/ConfirmModalComponent.vue';
import WarningModalComponent from '@/components/common/modal/type/WarningModalComponent.vue';
import PaymentUsageModal from '@/components/common/modal/type/generation/PaymentUsageModal.vue';
import { ref, onMounted, onBeforeUnmount, getCurrentInstance, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePassageStore } from '@/stores/passage';
import { useAuthStore } from '@/stores/auth';
// UI 상태 관리
const isFileModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const hasManualSave = ref(true); // 초기값을 true로 설정 (초기 상태에서 추출하기 버튼 활성화)
const isContentChanged = ref(false); // 내용 변경 여부 추적 (초기 상태는 변경되지 않음)
const isWarningModalOpen = ref(false); // 경고 모달 상태
const isPaymentUsageModalOpen = ref(false); // 결제 사용 모달 상태
const isLoading = ref(false); // 로딩 상태 추가
const loadingMessage = ref('처리 중입니다...'); // 로딩 메시지
const isFromRoute = ref(false); // 이전 페이지의 루트 확인용
const isSaveSuccessModalOpen = ref(false); // 저장 확인 모달 오픈
const saveSuccessMessage = ref('지문이 저장되었습니다.'); // 저장 확인 모달 메시지

// 네비게이션 관련 변수
const pendingRoute = ref(null); // 대기 중인 라우트 정보 저장
// 컴포넌트 참조
const passageContentRef = ref(null);
const passageSummaryRef = ref(null);
// 지문 데이터 상태 관리
const title = ref('');
const content = ref('');
const summary = ref({});
const pasCode = ref(null);
const type = ref('');
const keyword = ref('');
// 라우터 관련 정보 가져오기
const route = useRoute();
const router = useRouter();
const passageStore = usePassageStore();
const authStore = useAuthStore();

// 글자 수 체크 함수
const checkContentLength = (event) => {
    // 내용 길이 검증
    if (passageContentRef.value && !passageContentRef.value.validateContent()) {
        event?.preventDefault(); // 라우터 링크 이벤트 방지
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
            title: title.value,
            content: content.value,
            summary: summary.value,
            pasCode: pasCode.value,
            type: type.value,
            keyword: keyword.value
        };
        localStorage.setItem('generateQuestionPassageData', JSON.stringify(passageData));
        // 결제 사용 모달 열기
        isPaymentUsageModalOpen.value = true;
    }
};

// 모달 관련 함수
const closePaymentUsageModal = () => {
    isPaymentUsageModalOpen.value = false;
};

const openSaveSuccessModal = () => {
    isSaveSuccessModalOpen.value = true;
};

const closeSaveSuccessModal = () => {
    isSaveSuccessModalOpen.value = false;
};

const handleGenerate = () => {

    closePaymentUsageModal();
    // 재생성 처리 로직
    isLoading.value = true;
    loadingMessage.value = '지문 재생성 중입니다...';

    // (수정) TestMemberController API 호출
    const apiUrl = import.meta.env.VITE_API_URL;
    const requestData = {
        type_passage: type.value || '인문',
        keyword: keyword.value || '키워드'
    };



    fetch(`${apiUrl}/api/test/generate-passage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API 호출 실패: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('재생성된 지문 데이터:', {
            content: data.generated_passage.substring(0, 50) + '...',
            corePoints: data.generated_core_point
        });

        // 재생성 결과 적용
        if (passageContentRef.value) {
            passageContentRef.value.setContent(data.generated_passage);
        }

        if (passageSummaryRef.value && typeof passageSummaryRef.value.setSummary === 'function') {
            const summaryData = {
                subject: type.value,
                keyword: keyword.value,
                gist: data.generated_core_point
            };
           passageSummaryRef.value.setSummary(summaryData);
        }

        // 상태 업데이트
        content.value = data.generated_passage;
        summary.value = {
            subject: type.value,
            keyword: keyword.value,
            gist: data.generated_core_point
        };

        isContentChanged.value = true;
        hasManualSave.value = false;
        alert('지문이 재생성되었습니다.');
    })
    .catch(error => {

        alert('지문 재생성 중 오류가 발생했습니다: ' + error.message);
    })
    .finally(() => {
        isLoading.value = false;
    });
};
// 저장 버튼 클릭 핸들러
const handleSaveButtonClick = () => {
    // 내용 검증
    if (!content.value || content.value.length < 300) {
        alert('300자 이상 입력해주세요.');
        return;
    }
    // 로딩 상태 활성화
    isLoading.value = true;
    loadingMessage.value = '저장 중입니다...';
    // 저장할 데이터 준비
    const saveData = {
        pasCode: pasCode.value,
        title: title.value,
        content: content.value
    };

    if (!pasCode.value) {
        alert('지문 코드가 없습니다. 저장할 수 없습니다.');
        isLoading.value = false;
        return;
    }
    const apiUrl = import.meta.env.VITE_API_URL;
    // 백엔드 API 호출 - 지문 업데이트
    fetch(`${apiUrl}/pass/update/each`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(saveData)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                // 인증 오류 처리
                authStore.user = null;
                authStore.isAuthenticated = false;
                localStorage.removeItem('authUser');
                router.push({
                    path: '/login',
                    query: { redirect: route.fullPath }
                });
                throw new Error('인증이 필요합니다');
            }
            throw new Error('업데이트 API 호출 실패: ' + response.status);
        }
        return response.json();
    })
    .then(responseData => {

            // 통합 데이터 구조로 저장
            const updatedData = {
                pasCode: pasCode.value,
                title: title.value,
                content: content.value,
                type: type.value,
                keyword: keyword.value,
                gist: summary.value?.items || []
            };
            // 로컬 스토리지 업데이트
            localStorage.setItem('genieq-passage-data', JSON.stringify(updatedData));
            alert('지문 저장에 성공했습니다.');
            isContentChanged.value = false;
            hasManualSave.value = true;
        })
        .catch(error => {

            alert('지문 저장 중 오류가 발생했습니다: ' + error.message);
        })
        .finally(() => {
            isLoading.value = false;
        });
};
// 이어서 문항 생성하기 버튼 클릭 시 데이터 저장
const handleConnectCreate = (event, navigate) => {
    // 내용 길이 확인
    if (checkContentLength(event)) {
        // 내용에 변경사항이 있고 저장되지 않은 상태라면 경고 모달 표시
        if (hasUnsavedChanges()) {
            // 대기 중인 네비게이션 설정
            isWarningModalOpen.value = true;
            pendingRoute.value = '/questions';
            event.preventDefault();
            return;
        }
        // 저장된 상태라면 이동 준비
        // 지문 정보 수집 및 전달
        prepareDataForQuestions();
        navigate(event); // 네비게이션 실행
    } else {
        event.preventDefault(); // 글자 수가 충분하지 않으면 이동 방지
    }
};
// 문항 생성 페이지로 데이터 전달 준비
const prepareDataForQuestions = () => {
    // 지문 데이터 준비
    const passageForQuestion = {
        title: title.value,
        content: content.value,
        type: type.value,
        keyword: keyword.value,
        gist: summary.value?.items || [],
        pasCode: pasCode.value
    };
    // 통합 키로 저장 (QuestionMain에서 사용)
    localStorage.setItem('genieq-passage-for-question', JSON.stringify(passageForQuestion));

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
const handleFileSelect = async (fileType) => {
    // 로딩 상태 활성화
    isLoading.value = true;
    loadingMessage.value = '파일 추출 중입니다...';
    try {
        // 컴포넌트에서 데이터 수집
        const exportData = {
            pasCode: pasCode.value,
            fileType: fileType
        };

        if (!pasCode.value) {
            throw new Error('지문 코드가 없습니다. 파일을 추출할 수 없습니다.');
        }
        const apiUrl = import.meta.env.VITE_API_URL;
        // 백엔드 API 호출 - 파일 추출
        const response = await fetch(`${apiUrl}/pass/export/each/${pasCode.value}?type=${fileType}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': getContentType(fileType)
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                // 인증 오류 처리
                authStore.user = null;
                authStore.isAuthenticated = false;
                localStorage.removeItem('authUser');
                router.push({
                    path: '/login',
                    query: { redirect: route.fullPath }
                });
                throw new Error('인증이 필요합니다');
            }
            throw new Error('파일 추출 API 호출 실패: ' + response.status);
        }
        // 파일 다운로드 처리
        const blob = await response.blob();
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${title.value || 'passage'}.${getFileExtension(fileType)}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

    } catch (error) {

        alert('파일 추출 중 오류가 발생했습니다: ' + error.message);
    } finally {
        isLoading.value = false;
    }
};
// 파일 형식에 따른 Content-Type 반환
const getContentType = (fileType) => {
    switch (fileType.toLowerCase()) {
        case 'pdf':
            return 'application/pdf';
        case 'word':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'txt':
        default:
            return 'text/plain';
    }
};
// 파일 형식에 따른 확장자 반환
const getFileExtension = (fileType) => {
    switch (fileType.toLowerCase()) {
        case 'pdf':
            return 'pdf';
        case 'word':
            return 'docx';
        case 'txt':
        default:
            return 'txt';
    }
};
// 저장되지 않은 변경사항이 있는지 확인하는 함수
const hasUnsavedChanges = () => {
    return isContentChanged.value;
};
// 이동 취소 - 현재 화면 유지
const cancelNavigation = () => {

    isWarningModalOpen.value = false;
    pendingRoute.value = null;
};
// 이동 확인 - 타겟 페이지로 이동
const confirmNavigation = () => {

    isWarningModalOpen.value = false;
    // 변경 사항이 있었지만, 사용자가 이동을 확인했으므로 관련 상태 초기화
    isContentChanged.value = false;
    hasManualSave.value = true; // 사용자가 명시적으로 저장하지 않기로 함
    // 문항 생성 페이지로의 이동인 경우, 데이터 준비
    if (pendingRoute.value === '/questions') {
        prepareDataForQuestions();
    }
    // 네비게이션 수행
    if (pendingRoute.value) {
        const targetPath = pendingRoute.value;
        pendingRoute.value = null;
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
// 로컬 스토리지에서 지문 데이터 로드
const loadPassageData = () => {
    try {

        // 통일된 키 사용
        const storedData = localStorage.getItem('genieq-passage-data');
        if (storedData) {
            let data;
            try {
                data = JSON.parse(storedData);
            } catch (parseError) {

                return null;
            }


            // 데이터 설정 - 백엔드 응답 구조(PAS_)와 프론트엔드 변수명(소문자) 모두 처리
            title.value = data.title || '';
            content.value = data.content || '';
            pasCode.value = data.pasCode || null;
            type.value = data.type || '';
            keyword.value = data.keyword || '';
            // 요약 정보 일관되게 처리
            let gistData = data.gist || '';
            // 문자열이면 배열로 변환
            if (typeof gistData === 'string') {
                gistData = gistData.split(/\\n|\n/).filter(item => item.trim());
            }
            // 배열이 아니면 빈 배열로 초기화
            else if (!Array.isArray(gistData)) {
                gistData = [];
            }
            // 요약 정보 설정
            summary.value = {
                subject: data.type || '',
                keyword: data.keyword || '',
                items: gistData
            };
            console.log('[12-2] 지문 데이터 로드 완료:', {
                title: title.value,
                contentLength: content.value?.length || 0,
                pasCode: pasCode.value,
                type: type.value,
                keyword: keyword.value,
                summary: summary.value
            });
            return data;
        }
    } catch (error) {

    }

    return null;
};
// 컴포넌트 마운트 시 실행
onMounted(async () => {


    // 이전 경로 확인 로직 추가
    const fromPath = route.query.from || '';
    isFromRoute.value = fromPath.startsWith('/home') || fromPath.startsWith('/storage');

    // 데이터 로드
    const loadedData = loadPassageData();
    // 데이터가 있으면 컴포넌트에 적용
    if (loadedData) {

        // 본문과 제목 설정 - nextTick 사용
        nextTick(() => {
            if (passageContentRef.value) {
                // 명시적으로 setContent와 setTitle 호출, 순서 변경
                if (title.value) {
                    passageContentRef.value.setTitle(title.value);

                }
                if (content.value) {
                    passageContentRef.value.setContent(content.value);

                }
            }

            // 핵심 논점 설정 - PassageSummary 컴포넌트에 데이터 전달
            if (passageSummaryRef.value && typeof passageSummaryRef.value.setSummary === 'function') {
                // (수정) 명시적으로 summary 데이터 구조 정의
                const summaryData = {
                    subject: type.value,
                    keyword: keyword.value,
                    gist: summary.value.items || []
                };

                passageSummaryRef.value.setSummary(summaryData);

            }

            // 컴포넌트 상태 초기화
            isContentChanged.value = false;
            hasManualSave.value = true;
        });
    } else {
        // (수정) 데이터가 없는 경우 이전 페이지로 리다이렉트

        alert('지문 데이터를 찾을 수 없습니다. 지문 생성 페이지로 이동합니다.');
        router.push('/passage');
        return; // 불필요한 코드 실행 방지
    }
    // 브라우저 새로고침, 닫기 등에 대한 이벤트 리스너 추가
    window.addEventListener('beforeunload', handleBeforeUnload);
    // 전역 네비게이션 가드 설정
    routerGuard = router.beforeEach((to, from, next) => {

        // 현재 라우트에서 다른 라우트로 이동하는 경우에만 확인
        if (from.path === route.path && hasUnsavedChanges()) {

            // 저장되지 않은 변경사항이 있다면 모달 표시하고 대기
            isWarningModalOpen.value = true;
            pendingRoute.value = to.fullPath; // 이동하려는 전체 경로 저장
            return false; // 네비게이션 중단
        }

        return next(); // 네비게이션 계속
    });
    // 현재 상태 로그
    console.log('[26] 현재 상태 값:', {
        title: title.value,
        contentLength: content.value?.length || 0,
        pasCode: pasCode.value,
        type: type.value,
        keyword: keyword.value,
        isContentChanged: isContentChanged.value,
        hasManualSave: hasManualSave.value
    });
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
const handleContentChange = (data) => {

    // (수정) data가 null이 아닌 경우에만 처리
    if (data) {
        // (수정) 명시적으로 제목과 내용 설정
        if (data.title !== undefined) {
            title.value = data.title;
        }
        if (data.content !== undefined) {
            content.value = data.content;
        }
        // (수정) summary 데이터 명확히 설정
        if (data.summary !== undefined) {
            summary.value = data.summary;
        }

        // 내용이 변경되면 저장 플래그 초기화 (추출하기 버튼 비활성화)
        hasManualSave.value = false;
        isContentChanged.value = true;

        console.log('내용 변경 처리 완료:', {
            titleLength: data.title?.length || 0,
            contentLength: data.content?.length || 0,
            summary: data.summary,
            hasManualSave: hasManualSave.value,
            isContentChanged: isContentChanged.value
        });
    }
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
    top: 242px;
    left: 670px;
}
</style>