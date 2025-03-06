<template>
  <div v-if="isVisible" class="plain-tooltip-container" :style="{ width }">
    <div class="plain-tooltip">
      <span id="message">{{ message }}</span>
      <button class="close-button" @click="hideMessage">✕</button>
    </div>
    <div class="arrow"></div>
  </div>
</template>
<script>
export default {
  name: 'PlainTooltip',
  props: {
    message: {
      type: String,
      default: '개발자님, 메시지를 입력해주세요.'
    },
    width: {
      type: String,
      default: 'auto'
    }
  },
  data() {
    return {
      isVisible: true
    }
  },
  methods: {
    hideMessage() {
      this.isVisible = false;
      this.$emit('close');
    }
  }
}
</script>
<style scoped>
.plain-tooltip-container {
    position: relative;
    display: inline-block;
}
.plain-tooltip {
    background-color: #333;
    color: white;
    padding: 10px 40px 10px 15px;
    position: relative;
    display: flex;
    align-items: center;
}
#message {
height: 24px;

font-family: 'Pretendard';
font-style: normal;
font-weight: 300;
font-size: 16px;
line-height: 150%;

letter-spacing: -0.02em;

color: #FFFFFF;
}
.close-button {
    position: absolute;
    right: 15px;
    background: transparent;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    font-weight: lighter;
}
.arrow {
    position: absolute;
    bottom: -13px;
    left: 50px;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 15px solid #333;
}
</style>