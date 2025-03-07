<template>
    <div class="edit-passage">
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
                    @keyup="onTextSelect"></textarea>
            </div>
        </div>
    </div>
</template>
<script>
import SymbolTooltip from './SymbolTooltip.vue';

export default {
    name: 'EditPassage',
    components: {
        SymbolTooltip
    },
    data() {
        return {
            symbolList: [],
            showTooltip: false,
            contentText: '',
            currentSymbolType: '㉠',
            selectionStart: 0,
            selectionEnd: 0
        }
    },
    methods: {
        getTextLength() {
            // HTML 태그를 제외한 순수 텍스트 길이 계산
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = this.contentText;
            return tempDiv.textContent.length;
        },
        onTextSelect() {
            const textarea = document.getElementById('content-text');
            this.selectionStart = textarea.selectionStart;
            this.selectionEnd = textarea.selectionEnd;
        },
        showSymbolTooltip(symbol) {
            // 이미 열려있는 같은 심볼 툴팁이면 닫기
            if (this.showTooltip && this.currentSymbolType === symbol) {
                this.showTooltip = false;
                return;
            }

            this.currentSymbolType = symbol;
            
            // 각 심볼에 따른 목록 정의
            const symbolSeries = {
                '㉠': ['㉠', '㉡', '㉢', '㉣', '㉤'],
                '㉮': ['㉮', '㉯', '㉰', '㉱', '㉲'],
                'ⓐ': ['ⓐ', 'ⓑ', 'ⓒ', 'ⓓ', 'ⓔ'],
                '①': ['①', '②', '③', '④', '⑤']
            };

            // 선택된 심볼에 해당하는 시리즈 설정
            this.symbolList = symbolSeries[symbol] || [];

            // 툴팁 표시
            this.showTooltip = true;
        },
        insertSymbol(symbol) {
            const textarea = document.getElementById('content-text');
            
            // 현재 선택 위치 저장
            const start = this.selectionStart;
            const end = this.selectionEnd;
            
            // 선택 범위 앞뒤 텍스트
            const beforeSelection = this.contentText.substring(0, start);
            const afterSelection = this.contentText.substring(end);
            
            // 심볼 삽입
            this.contentText = beforeSelection + symbol + afterSelection;
            
            // 심볼 삽입 후 커서 위치 설정
            this.$nextTick(() => {
                textarea.focus();
                const newCursorPos = start + symbol.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);
                this.selectionStart = newCursorPos;
                this.selectionEnd = newCursorPos;
            });
            
            // 툴팁 닫기
            this.showTooltip = false;
        },
        formatText(type) {
            const textarea = document.getElementById('content-text');
            
            // 선택된 텍스트가 없으면 아무것도 하지 않음
            if (this.selectionStart === this.selectionEnd) {
                return;
            }
            
            // 현재 선택 범위 가져오기
            const selectedText = this.contentText.substring(this.selectionStart, this.selectionEnd);
            const beforeText = this.contentText.substring(0, this.selectionStart);
            const afterText = this.contentText.substring(this.selectionEnd);
            
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
            this.contentText = beforeText + formattedText + afterText;
            
            // 새 커서 위치 계산 및 설정
            const newCursorPos = this.selectionStart + formattedText.length;
            
            this.$nextTick(() => {
                textarea.focus();
                textarea.setSelectionRange(newCursorPos, newCursorPos);
                this.selectionStart = newCursorPos;
                this.selectionEnd = newCursorPos;
            });
        }
    }
}
</script>
<style scoped>
.edit-passage {
    box-sizing: border-box;

    width: 928px;
    height: 735px;

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
    top: 32px;
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

    display: flex;
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
    top: 202px;

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
    top: 205px;

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
    height: 462px;
    left: 39px;
    top: 241px;

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