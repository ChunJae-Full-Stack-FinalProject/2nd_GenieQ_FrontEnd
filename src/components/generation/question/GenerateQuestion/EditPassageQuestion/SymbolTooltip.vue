<template>
<div class="symbol-tooltip-container">
    <div class="symbol-tooltip">
    <span v-for="(symbol, index) in symbols" :key="index" class="symbol-item" 
        @click="onSymbolClick(symbol)">
        {{ symbol }}
    </span>
    </div>
    <div class="arrow" :style="arrowStyle"></div>
</div>
</template>
<script>
export default {
    name: 'SymbolTooltip',
    props: {
        message: {
            type: String,
            default: 'empty'
        },
        width: {
            type: String,
            default: 'auto'
        },
        symbolType: {
        type: String,
        default: '㉠'
        }
    },
    computed: {
        symbols() {
            // 메시지를 개별 문자로 분리
            return this.message.split('');
        },
        arrowStyle() {
            // 심볼 타입에 따라 화살표 위치 조정
            let translateX = '-230%';  // 기본값
            
            if (this.symbolType === '㉠') {
                translateX = '-230%';
            } else if (this.symbolType === 'ⓐ') {
                translateX = '-80%';
            } else if (this.symbolType === '㉮') {
                translateX = '70%';
            } else if (this.symbolType === '①') {
                translateX = '220%';
            }

            return {
                transform: `translateX(${translateX})`
            };
        },
    },
    methods: {
        onSymbolClick(symbol) {
            // 클릭된 심볼을 부모 컴포넌트로 전달
            this.$emit('symbol-click', symbol);
        }
    }
}
</script>
<style scoped>
.symbol-tooltip-container {
    position: relative;
    top: 60px;
    left: 133px;
}
.symbol-tooltip {
    padding: 2px;
    background-color: #E1E1E1;
    color: #424242;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 33px;
}
.symbol-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 35px;
    cursor: pointer;
    font-size: 25px;
    color: #424242;
}
.arrow {
    position: absolute;
    top: -15px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 15px solid #E1E1E1;
}

</style>