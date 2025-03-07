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
                        <li><b>B</b></li>
                        <li><u>U</u></li>
                        <li><s>S</s></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="passage-container">
            <p>지문</p>
            <div id="passage-count"><span style="color: #FF9500;">{{ contentText.length }}</span>/1700</div>
            <div id="passage-content-main">
                <textarea id="content-text" placeholder="본문을 입력해주세요." v-model="contentText"
                    @click="saveCurrentCursorPosition" @keyup="saveCurrentCursorPosition"></textarea>
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
            cursorPosition: 0,
            currentSymbolType: '㉠'
        }
    },
    methods: {
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

            // 현재 텍스트 영역의 커서 위치 저장
            this.saveCurrentCursorPosition();
        },
        saveCurrentCursorPosition() {
            const textarea = document.getElementById('content-text');
            if (textarea) {
                this.cursorPosition = textarea.selectionStart;
            }
        },
        insertSymbol(symbol) {
            // 선택된 심볼을 현재 커서 위치에 삽입
            const before = this.contentText.substring(0, this.cursorPosition);
            const after = this.contentText.substring(this.cursorPosition);

            // 심볼 삽입
            this.contentText = before + symbol + after;

            // 포커스를 다시 텍스트 영역으로 설정하고 커서 위치 조정
            this.$nextTick(() => {
                const textarea = document.getElementById('content-text');
                if (textarea) {
                    textarea.focus();
                    // 새 커서 위치는 삽입된 심볼 이후
                    const newPosition = this.cursorPosition + 1;
                    textarea.setSelectionRange(newPosition, newPosition);
                    this.cursorPosition = newPosition;
                }
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
    outline: none; /* 포커스 된 경우의 파란 테두리 삭제 */
    resize: none;
}
</style>