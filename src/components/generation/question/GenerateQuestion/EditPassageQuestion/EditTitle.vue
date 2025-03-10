<template>
    <div class="edit-title">
        <p id="passage-head">작업이름</p>
            <input type="text" id="passage-title"
            placeholder="직접 입력한 지문을 토대로 한 문항생성작업" v-model="title"/>
    </div>
</template>
<script>
export default {
    
}
</script>
<style scoped>
.edit-title {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 12px;

    position: absolute;
    width: 848px;
    height: 88px;
    left: 39px;
    top: 24px;
}
#passage-head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 12px;

    width: 610px;
    height: 30px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;
    letter-spacing: -0.02em;

    color: #303030;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
#passage-title {
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 848px;
    height: 46px;

    background: #FFFFFF;
    border: 1px solid #FF9F40;
    border-radius: 8px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
</style>