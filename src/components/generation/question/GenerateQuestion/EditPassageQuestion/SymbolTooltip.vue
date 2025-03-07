<template>
    <div class="symbol-tooltip-container">
      <div class="symbol-tooltip">
        <span v-for="(symbol, index) in symbols" :key="index" class="symbol-item" @click="onSymbolClick(symbol)">
            {{ symbol }}
        </span>
      </div>
      <div class="arrow"></div>
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
      }
    },
    computed: {
        symbols() {
            // 메시지를 개별 문자로 분리
            return this.message.split('');
        }
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
      display: inline-block;
  }
  .symbol-tooltip {
    background-color: #E1E1E1;
    color: #424242;
    padding: 10px 15px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 8px;
  }
  .symbol-item {
    display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      margin: 0 5px;
      cursor: pointer;
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 150%;
      color: #424242;
  }
  .arrow {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 15px solid #E1E1E1;
  }
  </style>