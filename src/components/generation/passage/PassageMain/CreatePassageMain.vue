<template>
    <div id="create-passage-main">
        <div class="input-container">
            <div class="edit-title">
                <p id="passage-head">작업이름</p>
                <input type="text" id="passage-title"
                    placeholder="작업 이름을 입력해주세요. (최대 50자)" v-model="title"/>
            </div>
            <div class="select-category-container">
                <p id="select-category-head">지문 분야 선택</p>
                <div class="select-category">
                    <div class="category-option">
                        <input type="radio" id="human" name="category" checked @change="onCategoryChange('인문')">
                        <label for="human">인문</label>
                    </div>
                    <div class="category-option">
                        <input type="radio" id="art" name="category" @change="onCategoryChange('예술')">
                        <label for="art">예술</label>
                    </div>
                    <div class="category-option">
                        <input type="radio" id="social" name="category" @change="onCategoryChange('사회')">
                        <label for="social">사회</label>
                    </div>
                    <div class="category-option">
                        <input type="radio" id="culture" name="category" @change="onCategoryChange('문화')">
                        <label for="culture">문화</label>
                    </div>
                    <div class="category-option">
                        <input type="radio" id="science" name="category" @change="onCategoryChange('과학')">
                        <label for="science">과학</label>
                    </div>
                    <div class="category-option">
                        <input type="radio" id="other" name="category" @change="onCategoryChange('기술')">
                        <label for="other">기술</label>
                    </div>
                </div>
            </div>

            <div class="text-container">
                <h2 id="text-head">지문 제재 입력</h2>
                <textarea placeholder="20자 이내의 원하는 지문의 제재, 필수 포함 키워드를 작성해 주세요. (ex : 인공지능과 기계학습)" 
                    id="input-text" v-model="inputText" maxlength="20" @input="onInputChange"></textarea>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch, defineExpose } from 'vue';
const savePassageData = JSON.parse(localStorage.getItem('saveResponse'));

const emit = defineEmits(['input-change', 'category-change','title-change']);
const title = ref(savePassageData.passage?.title||'');
const inputText = ref('');
const selectedCategory = ref('human');

const MAX_LENGTH = 50;

// 카테고리 변경 함수 추가
const onCategoryChange = (category) => {
    selectedCategory.value = category;
    emit('category-change', category);
};

const onTitleChange = () => {
    emit('title-change', title.value);
};

const checkTextLength = () => {
    if (inputText.value.length > 20) {
        inputText.value = inputText.value.slice(0,20);
    }
};

const onInputChange = () => {
    checkTextLength();
    emit('input-change', inputText.value);
};

// 초기값 설정을 위한 emit
watch(inputText, (newValue) => {
    emit('input-change', newValue);
}, { immediate: true });

watch(title, (newValue) => {
    emit('title-change', newValue);
}, { immediate: true });

watch(title, (newValue) => {
    // 최대 작업 이름 글자 수 제한 
    if (newValue.length > MAX_LENGTH) {
        // 최대 길이로 잘라서 다시 설정
        title.value = newValue.substring(0, MAX_LENGTH);
    }
});

defineExpose({
    resetForm() {
        inputText.value = '';
        selectedCategory.value = 'human';
        title.value = '';
        // DOM에 직접 접근하여 라디오 버튼 상태 변경
        document.getElementById('human').checked = true;
    }
})
</script>
<style scoped>
.input-container {
    box-sizing: border-box;

    position: absolute;
    width: 928px;
    height: 660px;
    left: 292px;
    top: 118px;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;
}
#passage-head {
    width: 610px;
    height: 30px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #303030;
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
}
.edit-title {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 12px;

    position: absolute;
    width: 848px;
    height: 88px;
    left: 40px;
    top: 24px;
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
    margin-top: 30px;

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
    height: 360px;
    left: 40px;
    top: 221px;
}
#text-head {
    width: 848px;
    height: 30px;
    margin-top: 30px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
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
    height: 330px;
    left: 0px;
    top: 62px;

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