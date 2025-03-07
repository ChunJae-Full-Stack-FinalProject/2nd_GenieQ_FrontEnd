<template>
    <div class="tofaq-container">
        <div class="top-container">
            <div class="tofaq-title">자주 묻는 질문 확인하기</div>
            <router-link :to="{ name: 'my-page-wrapper', query: { 'tab': '자주 묻는 질문' } }">
                <Icon icon="weui:arrow-outlined" width="24" height="24" id="arrow-icon" style="color: #ffffff" />
            </Router-Link>
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
    padding: 10px;
    gap: 12px;
    isolation: isolate;
    position: absolute;
    width: 520px;
    height: 132px;
    left: 1245px;
    top: 48px;
    background: #303030;
    border-radius: 8px;
    box-sizing: border-box;
}
.top-container{
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0px;
    gap: 83px;

    width: 480px;
    height: 46px;
}
.tofaq-title {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    margin-left: 10px;

    display: flex;
    align-items: center;
    letter-spacing: -0.02em;

    color: #ffffff;

    flex: none;
    order: 0;
    flex-grow: 0;
}
#arrow-icon {
    width: 12px;
    height: 24px;

    flex: none;
    order: 1;
    flex-grow: 0;
}
</style>