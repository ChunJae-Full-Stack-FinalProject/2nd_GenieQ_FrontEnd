<template>
    <div class="edit-passage">
        <EditTitle
            ref="editTitleRef"
            :initialTitle="title"
            @title-changed="handleTitleChange"
        />
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
                        <li @click="handleButtonClick($event, 'bold')"><b>B</b></li>
                        <li @click="handleButtonClick($event, 'underline')"><u>U</u></li>
                        <li @click="handleButtonClick($event, 'strikethrough')"><s>S</s></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="passage-container">
            <p>지문</p>
            <div id="passage-count"><span style="color: #FF9500;">{{ textLength }}</span>/1700</div>
            <div id="passage-content-main">
                <!-- 기본 텍스트 입력 영역 -->
                <div id="content-text" 
                    contenteditable="true"
                    placeholder="본문을 입력해주세요." 
                    @select="onTextSelect"
                    @click="onTextSelect"
                    @keyup="onTextSelect"
                    @input="onContentChange">
                </div>
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
import { ref, watch, nextTick, computed, onMounted, defineProps, defineEmits } from 'vue';
import SymbolTooltip from './SymbolTooltip.vue';
import ConfirmModalComponent from '@/components/common/modal/type/ConfirmModalComponent.vue';
import EditTitle from './EditTitle.vue';

const props = defineProps({
  initialTitle: {
    type: String,
    default: ''
  },
  initialContent: {
    type: String,
    default: ''
  }
});

// 상수 정의
const MIN_LENGTH = 500;
const MAX_LENGTH = 1700;

// 상태 관리
const title = ref(props.initialTitle || '');
const content = ref(props.initialContent || '');
const symbolList = ref([]);
const showTooltip = ref(false);
const contentText = ref('');
const currentSymbolType = ref('㉠');
const selectionStart = ref(0);
const selectionEnd = ref(0);
const isConfirmModalOpen = ref(false);
const textLength = ref(0);

// 글로벌 선택 상태 변수 추가
let savedRange = null;

// 사용자 정의 이벤트 발생
const emit = defineEmits(['content-changed']);

// 내용이 변경될 때마다 텍스트 길이 업데이트
const updateTextLength = () => {
  const contentDiv = document.getElementById('content-text');
  textLength.value = contentDiv ? contentDiv.textContent.length : 0;
};

// 최대 글자 수 제한
const checkMaxLength = () => {
    const contentDiv = document.getElementById('content-text');
    if (contentDiv && contentDiv.textContent.length > MAX_LENGTH) {
        // 현재 내용 가져오기
        const html = contentDiv.innerHTML;

        // HTML을 지정한 텍스트 길이로 자르기
        contentDiv.innerHTML = truncateHtmlToTextLength(html, MAX_LENGTH);
    };
}

const emitChange = () => {
  emit('content-changed', {
    title: title.value || '',
    content: content.value || ''
  });
};

// 제목 수정 처리
const handleTitleChange = (newTitle) => {
  title.value = newTitle || '';

  emit('content-changed', {
    title: title.value || '',
    content: content.value || ''
  });
};

// 내용이 변경될 때 이벤트 발생
// 내용 수정 처리
const onContentChange = (skipSaveSelection = false) => {
  const contentDiv = document.getElementById('content-text');
  if (contentDiv) {
    content.value = contentDiv.innerHTML || '';
  }

  updateTextLength(); // 텍스트 길이 업데이트

  // 최대 글자 수 검사
  checkMaxLength();

  // skipSaveSelection이 true가 아닐 때만 선택 영역 저장
  if (!skipSaveSelection) {
    saveSelection();
  }

    // 내용 변경을 localStorage에 저장하여 부모 컴포넌트에 알림
    localStorage.setItem('editPassageChanged', 'true');
};

// 텍스트 길이 계산 함수
const getTextLength = () => {
    const contentDiv = document.getElementById('content-text');
    if (!contentDiv) return 0;

    // HTML 태그를 제외한 순수 텍스트 길이만 반환
    return contentDiv.textContent.length;
};

// 모달 닫기
const closeConfirmModal = () => {
    isConfirmModalOpen.value = false;
};

// 텍스트 선택 처리
const onTextSelect = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return ;

    const range = selection.getRangeAt(0);
    const contentDiv = document.getElementById('content-text');

    // 선택 범위가 content-text 내부에 있는지 확인
    if (contentDiv && contentDiv.contains(range.commonAncestorContainer)) {
        // 나중에 선택 범위를 복원할 수 있도록 관련 정보 저장
        selectionStart.value = range.startOffset;
        selectionEnd.value = range.endOffset;
    }

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

// 심볼 삽입 함수
const insertSymbol = (symbol) => {
    // 저장된 선택 영역 복원
    restoreSelection();
    
    // 컨텐츠 영역에 포커스 설정
    const contentDiv = document.getElementById('content-text');
    if (contentDiv) {
        contentDiv.focus();
    }
    
    // 선택된 텍스트 대신 심볼 삽입
    document.execCommand('insertText', false, symbol);

    // 현재 선택 영역 가져오기
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        // 현재 위치 저장
        savedRange = selection.getRangeAt(0).cloneRange();
    }
        
    // 내용 변경 이벤트 발생
    onContentChange(true);
};

// 텍스트 서식 적용
const formatText = (type) => {
    // 현재 선택된 텍스트 확인
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.toString() === '') return; // 선택된 텍스트가 없으면 아무것도 하지 않음

    // document.execCommand 사용하여 서식 적용
    let command;
    switch(type) {
        case 'bold':
            command = 'bold';
            break;
        case 'underline':
            command = 'underline';
            break;
        case 'strikethrough':
            command = 'strikeThrough';
            break;
        default:
            return;
    }

    // 명령어 실행
    document.execCommand(command, false, null);
    
    // 현재 선택 영역 가져오기
    if (selection.rangeCount > 0) {
        // 현재 위치 저장
        savedRange = selection.getRangeAt(0).cloneRange();
    }

    // 내용 변경 이벤트 발생
    onContentChange(true);
};

// 에디터 버튼 클릭 처리
const handleButtonClick = (event, type) => {
    // 기본 이벤트 동작 방지
    event.preventDefault();

    // contentDiv 요소 가져오기
    const contentDiv = document.getElementById('content-text');
    if (contentDiv) {
        contentDiv.focus();
    };

    // 저장된 선택 영역 복원
    restoreSelection();

    // 포커스 설정
    contentDiv.focus();
    
    // 서식 적용
    formatText(type);
};

// 글자 수 검증 함수
const validateTextLength = () => {
    if (getTextLength() < MIN_LENGTH) {
        isConfirmModalOpen.value = true;
        return false;
    }
    return true;
};

// 지문 내용 설정 메서드
const setContent = (content) => {
    //console.log('EditPassage - setContent 호출됨:', content);
    if (content) {
        const contentDiv = document.getElementById('content-text');
        if (contentDiv) {
            contentDiv.innerHTML = content;
            contentText.value = content;
            updateTextLength(); // 내용 설정 후 텍스트 길이 업데이트
        }
        //console.log('EditPassage - contentText 설정 후:', contentText.value);
    }
};

// 내용 가져오기 메서드
const getContent = () => {
    const contentDiv = document.getElementById('content-text');
    return contentDiv ? contentDiv.innerHTML : '';
};

// 선택 영역 저장 함수
const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const contentDiv = document.getElementById('content-text');
        const range = selection.getRangeAt(0);

        // 선택 영역이 contentDiv 내부에 있는지 확인
        if (contentDiv && contentDiv.contains(range.commonAncestorContainer)) {
            savedRange = range.cloneRange();
        }
    }
};

// 선택 영역 복원 함수
const restoreSelection = () => {
    if (savedRange) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedRange);
    }
};

// 컴포넌트 마운트 시 이벤트 리스너 추가
onMounted(() => {
    if (props.initialTitle) {
        title.value = props.initialTitle;
    }
    if (props.initialContent) {
        setContent(props.initialContent);
    }

    // 본문 영역에만 이벤트 리스너 추가
    const contentDiv = document.getElementById('content-text');
    if (contentDiv) {
        contentDiv.addEventListener('mouseup', saveSelection);
        contentDiv.addEventListener('keyup', saveSelection);
    }

    updateTextLength(); // 초기 텍스트 길이 설정
});

watch(() => props.initialTitle, (newValue) => {
  console.log("제목 변경 감지: ", newValue);
  if (newValue !== undefined && newValue !== null) {
    title.value = newValue;
  }
});

watch(() => props.initialContent, (newValue) => {
  console.log(" 지문 변경 감지: ", newValue);
  if (newValue !== undefined && newValue !== null) {
    saveSelection();
    content.value = newValue;
    setContent(newValue); // 값이 변경되면 자동 반영
    updateTextLength(); // 텍스트 길이 업데이트
    restoreSelection();
  }
});

// 외부에서 접근할 메서드 노출
// 수정된 상태 외부에서 접근 가능하도록 expose 설정
defineExpose({
  validateTextLength,
  getContent: () => content.value,
  setContent,
  getTitle: () => title.value
});
</script>
<style scoped>
.edit-passage {
    box-sizing: border-box;

    position: absolute;
    top: 170px;
    left: 292px;
    width: 928px;
    height: 783px;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;
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

    outline: none;
    overflow-y: auto;
    text-align: left;
    padding: 0;

    white-space: pre-wrap;
    min-height: 398px;
}

/* placeholder 스타일 */
#content-text:empty:before {
    content: attr(placeholder);
    color: #BDBDBD;
}

/* focus 상태일 때 placeholder 숨기기 */
#content-text:focus:before {
    content: '';
}

/* deep 선택자 사용 */
:deep(#content-text b) {
  font-weight: 700 !important;
}
:deep(#content-text strong) {
  font-weight: 700 !important;
  /* 브라우저에 따라 strong으로 사용할 수도 있음 */
}
:deep(#content-text u) {
  text-decoration: underline !important;
}
:deep(#content-text s) {
  text-decoration: line-through !important;
}
</style>