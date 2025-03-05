<template>
    <button
      :class="buttonClass"
      :disabled="disabled"
      :style="buttonStyle"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      @click="handleClick"
    >
      {{ text }}
    </button>
  </template>
  
  <script>
  export default {
    props: {
      text: { type: String, default: "Button" }, // 버튼 텍스트
      type: { type: String, default: "type1" }, // 버튼 스타일
      width: { type: String, default: "120px" }, // 버튼 넓이
      height: { type: String, default: "40px" }, // 버튼 높이
      disabled: { type: Boolean, default: false } // 비활성화 여부
    },
    data() {
      return {
        hover: false
      };
    },
    computed: {
      buttonClass() {
        return [
          "base-button",
          `button-${this.type}`,
          { "button-hover": this.hover, "button-disabled": this.disabled }
        ];
      },
      buttonStyle() {
        return {
          width: this.width,
          height: this.height
        };
      }
    },
    methods: {
      handleClick(event) {
        if (!this.disabled) this.$emit("click", event);
      }
    }
  };
  </script>
  
  <style scoped>
  /* 기본 스타일 */
  .base-button {
    padding: 10px;
    border-radius: 6.46px;
    font-size: 20px;
    font-weight: 700;
    line-height: 30px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: -2%;

  }
  
  /* 🚀 Type별 스타일 적용 */
  
  /* Type 1 */
  .button-type1 {
    background-color: #ff9f40;
    color: white;
  }
  .button-type1.button-hover {
    background-color: #ec933b;
  }
  .button-type1.button-disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;
  }
  
  /* Type 2 */
  .button-type2 {
    background-color: #303030;
    color: white;
  }
  .button-type2.button-hover {
    background-color: #000000;
  }
  .button-type2.button-disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;
  }
  
  /* Type 3 */
  .button-type3 {
    background-color: transparent;
    color: #424242;
    border: 1px solid #757575;
  }
  .button-type3.button-hover {
    background-color: #f8f8f8;
  }
  .button-type3.button-disabled {
    border-color: #bdbdbd;
    color: #757575;
    cursor: not-allowed;
  }
  
  /* 🚀 Type 4 스타일 */
  .button-type4 {
    background-color: #ffeddc;
    color: #ff9f40;
  }
  .button-type4.button-hover {
    background-color: #ffe1c6;
    color: #ff9f40;
  }
  .button-type4.button-disabled {
    background-color: #ffffff;
    border: 1px solid #bdbdbd;
    color: #757575;
    cursor: not-allowed;
  }

  /* 🚀 Type 5 스타일 */
  .button-type5 {
    background-color: #ffffff;
    border: 1px solid #ff9f40;
    color: #303030;
  }
  .button-type5.button-hover {
    background-color: #ffe1c6;
    border: 1px solid #ff9f40;
    color: #303030;
  }
  .button-type5.button-disabled {
    background-color: #ffffff;
    border: 1px solid #bdbdbd;
    color: #757575;
    cursor: not-allowed;
  }
</style>
  