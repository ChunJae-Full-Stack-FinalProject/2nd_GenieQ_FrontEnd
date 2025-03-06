<template>
    <div>
        <div id="text-count"><span style="color: #FF9500;">1453</span>/1700</div>
        <div id="passage-content-main">
            <textarea id="content-text" placeholder="본문을 입력해주세요."></textarea>
        </div>
    </div>
</template>
<script setup>

</script>
<style scoped>
#text-count {
    position: absolute;
    width: 76px;
    height: 24px;
    left: 1135px;
    top: 192px;

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
    width: 928px;
    height: 547px;
    left: 292px;
    top: 220px;

    background: #FFFFFF;
    border: 1px solid #FF9F40;
    border-radius: 12px;
}
#content-text {
    width: 820px;
    height: 476px;

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