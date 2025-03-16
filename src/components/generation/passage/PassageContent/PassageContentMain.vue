<!-- 사용자가 작업 이름과 지문 입력 받기 => 하위컴포넌트 -->
<template>    
<div class="input-container">
    <div class="edit-title">
        <p id="passage-head">작업이름</p>
        <input type="text" id="passage-title" placeholder="작업 이름을 입력해주세요. (최대 50자)" v-model="title"/>
    </div>

    <div class="select-category-container">
        <p id="sub-title">생성 결과</p>
        <div id="text-count"><span style="color: #FF9500;">{{ content.length }}</span>/1700</div>
        <div id="passage-content-main">
            <textarea id="content-text" placeholder="본문을 입력해주세요." v-model="content" @input="handleInput"></textarea>
        </div>
    </div>
</div>
</template>
<script setup>
import { ref, defineExpose, defineEmits, watch, onMounted } from 'vue';

const savePassageData = JSON.parse(localStorage.getItem('saveResponse'));
// 본문 내용 ref로 관리
const content = ref('');
const title = ref(savePassageData.passage?.title||'');
const MAX_TITLE_LENGTH = 50;
const summary = ref({
    subject: '',
    keyword: '',
    items: []
});

// 이벤트 발신 정의
const emit = defineEmits(['content-changed']);

// 초기 텍스트 길이 설정
const MIN_LENGTH = 300;
const MAX_LENGTH = 1700;

// 입력 처리 함수
const handleInput = (event) => {
    // 최대 글자 수 제한
    if (content.value.length > MAX_LENGTH) {
        content.value = content.value.slice(0, MAX_LENGTH);
    }
        
    // 상위 컴포넌트에 변경 알림
    emitContentChange();
};
    
// 변경사항 상위 컴포넌트로 전달
const emitContentChange = () => {
    // 현재 요약 정보 설정 (PassageSummary 컴포넌트와 동기화)
    const summaryValue = {
        subject: summary.value.subject || '',
        keyword: summary.value.keyword || '',
        gist: summary.value.gist || ''
    };
    
    // 상위 컴포넌트에 변경 내용 전달
    emit('content-changed', {
        title: title.value,
        content: content.value,
        summary: summaryValue
    });
    console.log('[31] PassageContentMain: 내용 변경 이벤트 발생', {titleLength: title.value?.length || 0,contentLength: content.value?.length || 0,summary: summaryValue});
};
    
// 본문 길이 검증
const validateContent = () => {
    return content.value.length >= MIN_LENGTH;
};
    
// 외부에서 접근할 수 있도록 함수 노출
const getContent = () => content.value;
const getTitle = () => title.value;
const getSummary = () => summary.value;

const setContent = (newContent) => {
    console.log('[29] PassageContentMain: 내용 설정', newContent?.length || 0);
    if (newContent !== undefined) {
        content.value = newContent || '';
        emitContentChange();
    }
};

const setTitle = (newTitle) => {
    console.log('[30] PassageContentMain: 제목 설정', newTitle);
    if (newTitle !== undefined) {
        title.value = newTitle || '';
        emitContentChange();
    }
};
    
const setSummary = (newSummary) => {
    console.log('PassageContentMain: 요약 설정', newSummary);
    if (newSummary) {
        summary.value = {
            subject: newSummary.subject || '',
            keyword: newSummary.keyword || '',
            gist: Array.isArray(newSummary.gist) ? [...newSummary.gist] : []
        };
    }
    emitContentChange();
};
    
// 외부에서 접근 가능한 메서드 노출
defineExpose({
    getContent, 
    getTitle,
    getSummary,
    setContent,
    setTitle,
    setSummary,
    validateContent
});

// 컴포넌트 마운트 시 실행
onMounted(() => {
    console.log('PassageContentMain 컴포넌트 마운트');
    // 초기 데이터 변경 이벤트 발생
    emitContentChange();
});

watch(title, (newValue) => {
    // 최대 제목 글자 수 제한 
    if (newValue.length > MAX_TITLE_LENGTH) {
        // 최대 길이로 잘라서 다시 설정
        title.value = newValue.substring(0, MAX_TITLE_LENGTH);
    }
});

// title이나 content가 변경될 때 이벤트 발생
watch([title, content], () => {
    emitContentChange();
});
</script>    
<style scoped>
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

.input-container {
    box-sizing: border-box;

    position: absolute;
    width: 928px;
    height: 660px;
    left: 292px;
    top: 118px;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;
}

.edit-title {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 12px;

    position: absolute;
    width: 848px;
    height: 88px;
    left: 40px;
    top: 24px;
}

#passage-head {
    width: 610px;
    height: 30px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;
}

#passage-title {
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 848px;
    height: 46px;

    background: #FFFFFF;
    border: 1px solid #FF9F40;
    border-radius: 8px;
    
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
}

.content-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 12px;

    position: absolute;
    width: 848px;
    height: 450px;
    left: 40px;
    top: 132px;
}

#sub-title {
    position: absolute;
    width: 848px;
    height: 450px;
    left: 40px;
    top: 132px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;
}

#text-count {
    position: absolute;
    width: 76px;
    height: 24px;
    right: 0px;
    left: 810px;
    top: 150px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;

    text-align: right;
    letter-spacing: -0.02em;
    color: #BDBDBD;
}

#passage-content-main {
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 32.5px 32px;
    gap: 8px;
    isolation: isolate;

    position: absolute;
    width: 848px;
    height: 422px;
    left: 40px;
    top: 174px;

    background: #FFFFFF;
    border: 1px solid #FF9F40;
    border-radius: 12px;
}

#content-text {
    width: 780px;
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
    flex-grow: 0;
    z-index: 0;

    border: none;
    outline: none; /* 포커스 된 경우의 파란 테두리 삭제 */
    resize: none;
}

#content-text::placeholder {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #757575;
}
</style>