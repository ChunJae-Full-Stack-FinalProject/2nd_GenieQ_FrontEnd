<template>
    <div class="tofaq-container">
        <div class="top-container">
            <div class="notice-title">자주 묻는 질문 확인하기</div>
            <Icon icon="weui:arrow-outlined" width="24" height="24" id="arrow-icon" style="color: #303030" />
        </div>
    </div>
</template>
<script setup>
import { Icon } from "@iconify/vue";
</script>
<style>
.tofaq-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 12px;
    isolation: isolate;
    position: absolute;
    width: 460px;
    height: 132px;
    left: 1245px;
    top: 48px;
    background: #FFFFFF;
    border-radius: 8px;
    box-sizing: border-box;
}
</style>