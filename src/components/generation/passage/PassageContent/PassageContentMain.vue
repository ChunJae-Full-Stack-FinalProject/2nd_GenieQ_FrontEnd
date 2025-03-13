<template>
    <div class="input-container">
        <div class="edit-title">
            <p id="passage-head">작업이름</p>
            <input type="text" id="passage-title" placeholder="작업 이름을 입력해주세요." v-model="title"/>
        </div>
    
        <div class="select-category-container">
            <p id="sub-title">생성 결과</p>
            <div id="text-count"><span style="color: #FF9500;">{{ content.length }}</span>/1700</div>
            <div id="passage-content-main">
                <textarea id="content-text" placeholder="본문을 입력해주세요." v-model="content" @input="handleInput"></textarea>
            </div>
        </div>
    </div>
    </template>
    <script setup>
    import { ref, defineExpose, defineEmits } from 'vue';
    
    // 이벤트 정의
    const emit = defineEmits(['content-changed']);
    
    // 본문 내용 ref로 관리
    const content = ref('');
    const MIN_LENGTH = 500;
    const MAX_LENGTH = 1700;
    
    // 초기 텍스트 길이 설정
    if (content.value.length === 0) {
        content.value = '인공지능과 기계학습은 현대 기술의 핵심 요소로 자리 잡고 있습니다. 이러한 기술은 데이터 처리와 분석을 통해 지속적으로 성능을 개선하며, 이는 의료, 금융, 제조업 등 다양한 분야에 걸쳐 응용되고 있습니다. 인공지능의 발전은 효율적인 데이터 이용을 통해 새로운 가능성을 제공하고 있지만, 동시에 윤리적 문제도 동반할 수 있습니다. 따라서 기술의 공정성과 투명성을 확보하기 위한 관리가 필요합니다. // 인공지능과 기계학습은 현대 기술의 핵심 요소로 자리 잡고 있습니다. 이러한 기술은 데이터 처리와 분석을 통해 지속적으로 성능을 개선하며, 이는 의료, 금융, 제조업 등 다양한 분야에 걸쳐 응용되고 있습니다. 인공지능의 발전은 효율적인 데이터 이용을 통해 새로운 가능성을 제공하고 있지만, 동시에 윤리적 문제도 동반할 수 있습니다. 따라서 기술의 공정성과 투명성을 확보하기 위한 관리가 필요합니다. // 인공지능과 기계학습은 현대 기술의 핵심 요소로 자리 잡고 있습니다. 이러한 기술은 데이터 처리와 분석을 통해 지속적으로 성능을 개선하며, 이는 의료, 금융, 제조업 등 다양한 분야에 걸쳐 응용되고 있습니다. 인공지능의 발전은 효율적인 데이터 이용을 통해 새로운 가능성을 제공하고 있지만, 동시에 윤리적 문제도 동반할 수 있습니다. 따라서 기술의 공정성과 투명성을 확보하기 위한 관리가 필요합니다.=';
    }
    
    // 입력 처리 함수
    const handleInput = (event) => {
        // 최대 글자 수 제한
        if (content.value.length > MAX_LENGTH) {
            content.value = content.value.slice(0, MAX_LENGTH);
        }
        
        // 내용 변경 이벤트 발생
        emit('content-changed');
    };
    
    // 본문 길이 검증
    const validateContent = () => {
        return content.value.length >= MIN_LENGTH;
    };
    
    // 외부에서 접근할 수 있도록 함수 노출
    const getContent = () => {
        return content.value;
    };
    
    // 노출할 메소드 정의
    defineExpose({
        getContent, validateContent
    });
    </script>
    <style scoped>
    #main-title {
        position: absolute;
        width: 87px;
        height: 36px;
        left: 292px;
        top: 70px;
        margin: 0px;
    
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
        height: 660px;
        left: 292px;
        top: 118px;
    
        background: #FFFFFF;
        border: 1px solid #BDBDBD;
        border-radius: 12px;
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
        
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
    }
    
    .content-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;
        gap: 12px;
    
        position: absolute;
        width: 848px;
        height: 450px;
        left: 40px;
        top: 132px;
    }
    
    #sub-title {
       
        position: absolute;
        width: 848px;
        height: 450px;
        left: 40px;
        top: 180px;
    
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        line-height: 150%;
    
        letter-spacing: -0.02em;
        color: #303030;
    }
    
    #text-count {
        position: absolute;
        width: 76px;
        height: 24px;
        right: 0px;
        left: 810px;
        top: 190px;
    
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
        width: 848px;
        height: 400px;
        left: 40px;
        top: 220px;
    
        background: #FFFFFF;
        border: 1px solid #FF9F40;
        border-radius: 12px;
    }
    
    #content-text {
        width: 780px;
        height: 335px;
    
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
    
    #content-text::placeholder {
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 150%;
    
        letter-spacing: -0.02em;
        color: #757575;
    }
    </style>