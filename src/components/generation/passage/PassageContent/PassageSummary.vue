<template>
    <div id="passage-summary">
        <div class="passage-type-container">
            <p id="passage-type-text">지문 유형</p>
            <div class="passage-type-main">

            </div>
        </div>
        <div class="gist-container">
            <p id="gist-text">핵심 논점</p>
            <div class="gist-main">

            </div>
        </div>
    </div>
</template>
<script setup>

</script>
<style scoped>
#passage-summary {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 44px;

    position: absolute;
    width: 522px;
    height: 591px;
    left: 1244px;
    top: 176px;
}

.passage-type-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;

    width: 522px;
    height: 152px;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
#passage-type-text {
    width: 522px;
    height: 36px;
    padding-top: 10px;
    margin: 0px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
.passage-type-main {
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 20px;

    width: 522px;
    height: 108px;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}

.gist-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 8px;

    width: 522px;
    height: 395px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
#gist-text {
    width: 522px;
    height: 32px;
    margin: 0px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;

    color: #000000;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
.gist-main {
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 8px;

    width: 522px;
    height: 355px;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
</style>