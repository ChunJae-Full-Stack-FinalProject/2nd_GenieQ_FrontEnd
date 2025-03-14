<template>
        <div class="noticecard-container">
            <div class="noticelist-card">
                <div>
                    <router-link :to="{ name: 'my-page-wrapper', query: { 'tab': '공지사항' } }">
                    <div class="top-container">
                        <div class="notice-title">공지사항</div>
                            <Icon icon="weui:arrow-outlined" width="24" height="24" id="arrow-icon" style="color: #303030" />
                        </div>
                    </router-link>
                </div>
                <div class="notice-main">
                    <ol class="notice-list">
                        <li v-for="item in items" :key="index" class="list-item">
                            {{ item }}
                        </li>
                    </ol>
                </div>
            </div>
        </div>
</template>
<script setup>
import { Icon } from "@iconify/vue";
import { ref } from 'vue';

const items = ref ([
    '지니큐 공식 런칭',
    '지니큐 오픈 이벤트',
    '지니큐 사용법',
    '구독 플랜 적용 기준'
]);
</script>
<style scoped>
.noticelist-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 12px;
    isolation: isolate;
    position: absolute;
    width: 460px;
    height: 280px;
    left: 768px;
    top: 48px;
    background: #FFFFFF;
    border-radius: 8px;
    box-sizing: border-box;
}

.notice-title {
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #333333;
    margin: 0;
}

.top-container{
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0px;
    gap: 83px;

    width: 420px;
    height: 46px;

    border-bottom: 1px solid #E1E1E1;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
a {
    text-decoration: none;
}
.notice-title {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    display: flex;
    align-items: center;
    letter-spacing: -0.02em;

    color: #424242;

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

.highlight {
    color: #FF9F40;
    font-weight: 500;
}

.notice-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 8px;
    width: 420px;
    height: 184px;
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
.list-item {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 0px;
    gap: 8px;

    width: 420px;
    height: 40px;

    border-bottom: 1px solid #E1E1E1;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}

</style>
