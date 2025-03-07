<template>
     <div class="card-container">
        <div class="card">
            <div>
                <p class="card-title">문제 출제를 더 쉽고, 빠르고, 정확하게 <br> 안녕하세요. 유저이름님</p>
                <p class="sub-text">현재 보유 이동권 <span class="highlight">n회</span></p>
            </div>
            <router-link :to="{ name: 'my-page-wrapper', query: { 'tab': '이용권' } }">
                <div class="count-badge">추가 구매</div>
            </router-link>
        </div>
    </div>
</template>
<script setup>

</script>
<style scoped>
.card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 12px;
    isolation: isolate;
    position: absolute;
    width: 460px;
    height: 280px;
    left: 292px;
    top: 48px;
    background: #FFFFFF;
    border-radius: 8px;
    box-sizing: border-box;
}

.card-title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #333333;
    margin: 0;
}

.highlight {
    color: #FF9F40;
    font-weight: 500;
}

.sub-text {
    font-size: 14px;
    line-height: 20px;
    color: #666666;
    margin-top: 5px;
}

.count-badge {
    position: absolute;
    right: 20px;
    bottom: 20px;
    background-color: #FF9500;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
}
</style>