<template>
    <div class="edit-passage">
        <EditTitle/>
        <div class="edit-tool-bar">
            <p>편집 도구</p>
            <div class="edit-tool-bar-content">
                <p id="symbol-head">단어·문장 기호</p>
                <div id="symbol-tool">
                    <ul class="symbol-list">
                        <li @click="showSymbolTooltip('㉠')">㉠</li>
                        <li @click="showSymbolTooltip('ⓐ')">ⓐ</li>
                        <li @click="showSymbolTooltip('㉮')">㉮</li>
                        <li @click="showSymbolTooltip('①')">①</li>
                    </ul>
                </div>

                <SymbolTooltip :message="symbolList.join('')" :symbolType="currentSymbolType" 
                    class="symbol-tooltip" v-if="showTooltip" @symbol-click="insertSymbol"/>

                <p id="edit-head">에디터</p>
                <div id="editor-tool">
                    <ul class="editor-list">
                        <li @click="formatText('bold')"><b>B</b></li>
                        <li @click="formatText('underline')"><u>U</u></li>
                        <li @click="formatText('strikethrough')"><s>S</s></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="passage-container">
            <p>지문</p>
            <div id="passage-count"><span style="color: #FF9500;">{{ getTextLength() }}</span>/1700</div>
            <div id="passage-content-main">
                <!-- 기본 텍스트 입력 영역 -->
                <textarea id="content-text" 
                    placeholder="본문을 입력해주세요." 
                    v-model="contentText"
                    @select="onTextSelect"
                    @click="onTextSelect"
                    @keyup="onTextSelect">
                </textarea>
            </div>
        </div>
    </div>
    <ConfirmModalComponent
        :isOpen="isConfirmModalOpen"
        title="글자 수를 확인해 주세요."
        message="500자 이하의 지문으로 정상적인 문항을 생성하기 어렵습니다. 충분한 지문을 입력해 주세요."
        @close="isConfirmModalOpen = false"
        @confirm="isConfirmModalOpen = false"
    />
</template>
<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import SymbolTooltip from './SymbolTooltip.vue';
import ConfirmModalComponent from '@/components/common/modal/type/ConfirmModalComponent.vue';
import EditTitle from './EditTitle.vue';

// 상수 정의
const MIN_LENGTH = 500;
const MAX_LENGTH = 1700;

// 상태 관리
const symbolList = ref([]);
const showTooltip = ref(false);
const contentText = ref('');
const currentSymbolType = ref('㉠');
const selectionStart = ref(0);
const selectionEnd = ref(0);
const isConfirmModalOpen = ref(false);

// 텍스트 길이 계산 함수
const getTextLength = () => {
    // HTML 태그를 제외한 순수 텍스트 길이 계산
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contentText.value;
    return tempDiv.textContent.length;
};

// 텍스트 길이 계산된 값
const textLength = computed(() => getTextLength());

// 모달 닫기
const closeConfirmModal = () => {
    isConfirmModalOpen.value = false;
};

// 텍스트 선택 처리
const onTextSelect = () => {
    const textarea = document.getElementById('content-text');
    selectionStart.value = textarea.selectionStart;
    selectionEnd.value = textarea.selectionEnd;
};

// 심볼 툴팁 표시
const showSymbolTooltip = (symbol) => {
    // 이미 열려있는 같은 심볼 툴팁이면 닫기
    if (showTooltip.value && currentSymbolType.value === symbol) {
        showTooltip.value = false;
        return;
    }

    currentSymbolType.value = symbol;
    
    // 각 심볼에 따른 목록 정의
    const symbolSeries = {
        '㉠': ['㉠', '㉡', '㉢', '㉣', '㉤'],
        '㉮': ['㉮', '㉯', '㉰', '㉱', '㉲'],
        'ⓐ': ['ⓐ', 'ⓑ', 'ⓒ', 'ⓓ', 'ⓔ'],
        '①': ['①', '②', '③', '④', '⑤']
    };

    // 선택된 심볼에 해당하는 시리즈 설정
    symbolList.value = symbolSeries[symbol] || [];

    // 툴팁 표시
    showTooltip.value = true;
};

// HTML을 지정된 텍스트 길이로 자르는 함수
const truncateHtmlToTextLength = (html, maxLength) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    function truncateNode(node, length) {
        if (length <= 0) return 0;
        
        if (node.nodeType === 3) { // 텍스트 노드
            if (node.length > length) {
                node.textContent = node.textContent.substr(0, length);
                return 0;
            }
            return length - node.length;
        }
        
        let remainingLength = length;
        const childNodes = Array.from(node.childNodes);
        
        for (let i = 0; i < childNodes.length; i++) {
            remainingLength = truncateNode(childNodes[i], remainingLength);
            if (remainingLength <= 0) {
                // 남은 노드 제거
                while (i + 1 < node.childNodes.length) {
                    node.removeChild(node.childNodes[i + 1]);
                }
                break;
            }
        }
        
        return remainingLength;
    }
    
    truncateNode(tempDiv, maxLength);
    return tempDiv.innerHTML;
};

// 심볼 삽입
const insertSymbol = (symbol) => {
    const textarea = document.getElementById('content-text');
    
    // 현재 선택 위치 저장
    const start = selectionStart.value;
    const end = selectionEnd.value;
    
    // 선택 범위 앞뒤 텍스트
    const beforeSelection = contentText.value.substring(0, start);
    const afterSelection = contentText.value.substring(end);
    
    // 심볼 삽입
    contentText.value = beforeSelection + symbol + afterSelection;
    
    // 심볼 삽입 후 커서 위치 설정
    nextTick(() => {
        textarea.focus();
        const newCursorPos = start + symbol.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        selectionStart.value = newCursorPos;
        selectionEnd.value = newCursorPos;
    });
    
    // 툴팁 닫기
    showTooltip.value = false;
};

// 텍스트 서식 적용
const formatText = (type) => {
    const textarea = document.getElementById('content-text');
    
    // 선택된 텍스트가 없으면 아무것도 하지 않음
    if (selectionStart.value === selectionEnd.value) {
        return;
    }
    
    // 현재 선택 범위 가져오기
    const selectedText = contentText.value.substring(selectionStart.value, selectionEnd.value);
    const beforeText = contentText.value.substring(0, selectionStart.value);
    const afterText = contentText.value.substring(selectionEnd.value);
    
    // 태그 생성
    let formattedText;
    switch(type) {
        case 'bold':
            formattedText = `<b>${selectedText}</b>`;
            break;
        case 'underline':
            formattedText = `<u>${selectedText}</u>`;
            break;
        case 'strikethrough':
            formattedText = `<s>${selectedText}</s>`;
            break;
        default:
            formattedText = selectedText;
    }
    
    // 텍스트 업데이트
    contentText.value = beforeText + formattedText + afterText;
    
    // 새 커서 위치 계산 및 설정
    const newCursorPos = selectionStart.value + formattedText.length;
    
    nextTick(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        selectionStart.value = newCursorPos;
        selectionEnd.value = newCursorPos;
    });
};

// 글자 수 검증 함수
const validateTextLength = () => {
    if (getTextLength() < MIN_LENGTH) {
        isConfirmModalOpen.value = true;
        return false;
    }
    return true;
};

// contentText 감시하여 글자 수 제한
watch(contentText, (newValue) => {
    // 최대 글자 수 제한
    const length = getTextLength();
    if (length > MAX_LENGTH) {
        // HTML 태그를 유지하면서 텍스트만 자르는 로직
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newValue;
        const text = tempDiv.textContent;
        
        // 초과된 텍스트 계산
        const excessLength = text.length - MAX_LENGTH;
        const validText = text.substring(0, text.length - excessLength);
        
        // 유효 길이로 다시 설정
        contentText.value = truncateHtmlToTextLength(newValue, validText.length);
    }
});

// 지문 내용 설정 메서드
const setContent = (content) => {
    console.log('EditPassage - setContent 호출됨:', content);
    if (content) {
        contentText.value = content;
        console.log('EditPassage - contentText 설정 후:', contentText.value);
    }
};


// 외부에서 접근할 메서드 노출
defineExpose({
    validateTextLength,
    getContent: () => contentText.value,
    setContent
});
</script>
<style scoped>
.edit-passage {
    box-sizing: border-box;
    width: 928px;
    height: 783px;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;

    flex: none;
    order: 0;
    flex-grow: 0;
}
.edit-tool-bar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 8px;
    isolation: isolate;

    position: absolute;
    width: 849px;
    height: 111px;
    left: 39px;
    top: 132px;
}
.edit-tool-bar > p {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #16252D;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
    z-index: 0;
}
.edit-tool-bar-content {
    box-sizing: border-box;

    width: 849px;
    height: 73px;

    background: #FFFFFF;
    border: 1px solid #757575;
    border-radius: 12px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
    z-index: 1;
}
#symbol-head {
    position: absolute;
    width: 112px;
    height: 30px;
    left: 17px;
    top: 59px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;
}
#symbol-tool {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 12px;

    position: absolute;
    width: 117px;
    height: 30px;
    left: 147px;
    top: 59px;
}
.symbol-list, .editor-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 12px;
    list-style: none;
}
.editor-list > li > b {
    font-weight: 700;
}
.symbol-list > li, .editor-list > li {
    font-family: 'Pretendard';
    font-style: normal;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;
    cursor: pointer;
}
#edit-head {
    position: absolute;
    width: 52px;
    height: 30px;
    left: 399px;
    top: 59px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;
}
#editor-tool {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 12px;

    position: absolute;
    width: 69px;
    height: 30px;
    left: 483px;
    top: 59px;
}

.passage-container > p {
    position: absolute;
    width: 35px;
    height: 30px;
    left: 39px;
    top: 255px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #16252D;
}
#passage-count {
    position: absolute;
    width: 76px;
    height: 24px;
    left: 811px;
    top: 273px;

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
    padding: 32px;
    gap: 8px;

    position: absolute;
    width: 848px;
    height: 462px;
    left: calc(50% - 848px/2 - 1px);
    top: 297px;

    background: #FFFFFF;
    border: 1px solid #FF9F40;
    border-radius: 12px;
}
#content-text {
    width: 756px;
    height: 398px;

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
    outline: none;
    resize: none;
    overflow-y: auto;
    text-align: left;
    padding: 0;
}
</style>