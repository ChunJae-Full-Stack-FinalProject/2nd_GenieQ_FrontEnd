<template>
    <a class="notionlink-container" href="https://learned-science-af1.notion.site/1af66d6c49e280209a8af79ece08be6d">
        <div class="top-container">
            <div class="notionlink-title">사용법 보러가기</div>
        </div>
    </a>
</template>
<script setup>

</script>
<style>
.notionlink-container {
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
    top: 196px;
    background: url("@/assets/images/guide_image.png") no-repeat;
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
.notionlink-title {
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