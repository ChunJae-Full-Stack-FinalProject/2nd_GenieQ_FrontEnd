<template>
    <div id="create-passage-main">
        <p id="main-title">지문 생성</p>
        <div class="input-container">
            <p id="input-head">사용자 입력</p>
            <div class="select-category-container">
                <p id="select-category-head">지문 분야 선택</p>
                <div class="select-category">
                    <div class="category-option">
                        <input type="radio" id="human" name="category" checked>
                        <label for="human">인문</label>
                    </div>
                    <div class="category-option">
                        <input type="radio" id="art" name="category">
                        <label for="art">예술</label>
                    </div>
                    <div class="category-option">
                        <input type="radio" id="social" name="category">
                        <label for="social">사회</label>
                    </div>
                    <div class="category-option">
                        <input type="radio" id="culture" name="category">
                        <label for="culture">문화</label>
                    </div>
                    <div class="category-option">
                        <input type="radio" id="science" name="category">
                        <label for="science">과학</label>
                    </div>
                    <div class="category-option">
                        <input type="radio" id="other" name="category">
                        <label for="other">기술</label>
                    </div>
                </div>
            </div>

            <div class="text-container">
                <h2 id="text-head">지문 제재 입력</h2>
                
                <textarea placeholder="20자 이내의 원하는 지문의 제재, 필수 포함 키워드를 작성해 주세요. (ex : 인공지능과 기계학습)" id="input-text"></textarea>
            </div>
        </div>
    </div>
</template>
<script setup>

</script>
<style scoped>
#main-title {
    position: absolute;
    width: 87px;
    height: 36px;
    left: 292px;
    top: 70px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;
}
.input-container {
    box-sizing: border-box;

    position: absolute;
    width: 928px;
    height: 584px;
    left: 292px;
    top: 118px;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;
}
#input-head {
    position: absolute;
    width: 90px;
    height: 30px;
    left: 40px;
    top: 40px;
    margin: 0px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #FF9F40;
}
.select-category-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 12px;
    position: absolute;
    width: 610px;
    height: 66px;
    left: 40px;
    top: 115px;
}
#select-category-head {
    width: 610px;
    height: 30px;
    margin: 0px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
.select-category {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 25px;
    width: 610px;
    height: 24px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
.category-option {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 4px;
    width: 48px;
    height: 24px;

    flex: none;
    order: 0;
    flex-grow: 0;
}
.category-option input {
    width: 16px;
    height: 16px;

    flex: none;
    order: 0;
    flex-grow: 0;
}
.category-option label {
    height: 24px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;

    flex: none;
    order: 1;
    flex-grow: 0;
}

/* 기존 라디오 버튼 없애고 주황색 라디오 버튼 생성 */
.category-option input[type="radio"] {
    display: none;
}
.category-option label {
    position: relative;
    padding-left: 20px;
    cursor: pointer;
    display: block;
    margin-bottom: 12px;
    font-size: 16px;
}
.category-option label::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 6px;
    width: 12px;
    height: 12px;
    border: 1.5px solid #ddd;
    border-radius: 50%;
    background: #fff;
}
.category-option input[type="radio"]:checked + label:after {
    content: '';
    position: absolute;
    left: 2px;
    top: 6px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background-color: #FF9F40;
}

.text-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 12px;

    position: absolute;
    width: 848px;
    height: 339px;
    left: 40px;
    top: 221px;
}
#text-head {
    width: 848px;
    height: 30px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 30%;

    letter-spacing: -0.02em;
    color: #303030;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
#input-text {
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;

    box-sizing: border-box;

    position: absolute;
    width: 848px;
    height: 297px;
    left: 0px;
    top: 42px;

    padding-top: 21px;
    padding-left: 20px;

    background: #FFFFFF;
    border: 1px solid #FF9F40;
    border-radius: 12px;

    resize: none;
}
#input-text::placeholder {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #757575;
}
</style>