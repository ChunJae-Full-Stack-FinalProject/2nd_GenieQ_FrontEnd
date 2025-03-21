<template>
    <div id="passage-summary">
        <div class="passage-type-container">
            <p id="passage-type-text">지문 유형</p>
            <div class="passage-type-main">
                <div id="subject">
                    <p id="subject-head">지문 주제</p>
                    <p id="subject-text">{{ subject }}</p>
                </div>
                <div id="keyword">
                    <p id="keyword-head">지문 제재</p>
                    <p id="keyword-text">{{ keyword }}</p>
                </div>
            </div>
        </div>
        <div class="gist-container">
            <p id="gist-text">핵심 논점</p>
            <div class="gist-main">
                <div class="gist-content">
                    {{ gistText }}
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, defineExpose, computed, watch, onMounted } from 'vue';

// 데이터 관리
const subject = ref('');
const keyword = ref('');
const gist = ref('');

// gistText computed 속성 - 문자열로 직접 출력
const gistText = computed(() => {

    
    // gist가 빈 배열이거나 없을 때 localStorage에서 다시 확인
    if (!gist.value || (Array.isArray(gist.value) && gist.value.length === 0)) {
        try {
            const storedData = localStorage.getItem('genieq-passage-data');
            if (storedData) {
                const passageData = JSON.parse(storedData);
                
                // gist 데이터가 있으면 반환
                if (passageData.gist) {

                    
                    // gist 값을 업데이트 (나중에 사용하기 위해)
                    if (typeof passageData.gist === 'string') {
                        gist.value = passageData.gist;
                        return passageData.gist;
                    } else if (Array.isArray(passageData.gist)) {
                        gist.value = passageData.gist;
                        return passageData.gist.join('\n');
                    }
                }
            }
        } catch (error) {

        }
        localStorage.removeItem('genieq-passage-data');
        return '핵심 논점이 없습니다.';
    }

    if (typeof gist.value === 'string') {
        return gist.value;
    }
    // 배열인 경우 줄바꿈으로 연결
    if (Array.isArray(gist.value)) {
      return gist.value.join('\n');
    }
    return String(gist.value); // 기타 타입은 문자열로 변환
});

// LocalStorage에서 데이터 로드하는 함수
const loadFromLocalStorage = () => {

    
    // saveResponse에서 데이터 로드 - 첫 번째 시도
    try {
        const saveResponseStr = localStorage.getItem('saveResponse');
        if (saveResponseStr) {
            const saveResponse = JSON.parse(saveResponseStr);

            
            if (saveResponse && saveResponse.passage) {
                // 데이터가 있으면 설정
                subject.value = saveResponse.passage.type || '';
                keyword.value = saveResponse.passage.keyword || '';
                
                // (수정) gist가 실제 값이 있는 경우에만 설정
                if (saveResponse.passage.gist && 
                    !(Array.isArray(saveResponse.passage.gist) && saveResponse.passage.gist.length === 0)) {
                    gist.value = saveResponse.passage.gist;
                }
                
                // console.log('[loadFromLocalStorage-1] 값 설정됨:', { 
                //     subject: subject.value, 
                //     keyword: keyword.value, 
                //     gist: gist.value 
                // });
                
                // 하나라도 데이터가 설정되었으면 성공으로 간주
                if (subject.value || keyword.value || gist.value) {
                    return true; 
                }
            }
        }
    } catch (error) {

    }
    
    // genieq-passage-data에서 데이터 로드 - 두 번째 시도
    try {
        const storedData = localStorage.getItem('genieq-passage-data');
        if (storedData) {
            const passageData = JSON.parse(storedData);

            
            // 데이터가 있으면 설정
            if (!subject.value) {
                subject.value = passageData.type || passageData.PAS_TYPE || '';
            }
            
            if (!keyword.value) {
                keyword.value = passageData.keyword || passageData.PAS_KEYWORD || '';
            }
            
            // (수정) gist가 없거나 빈 배열인 경우에만 새 값 설정
            if (!gist.value || (Array.isArray(gist.value) && gist.value.length === 0)) {
                if (passageData.gist || passageData.PAS_GIST) {
                    gist.value = passageData.gist || passageData.PAS_GIST || '';
                }
            }
            
            // console.log('[loadFromLocalStorage-2] 값 설정됨:', { 
            //     subject: subject.value, 
            //     keyword: keyword.value, 
            //     gist: gist.value 
            // });
            
            // 하나라도 데이터가 설정되었으면 성공으로 간주
            if (subject.value || keyword.value || gist.value) {
                return true;
            }
        }
    } catch (error) {

    }
    

    return false; // 데이터 로드 실패
};

// 외부에서 직접 호출할 수 있는 업데이트 메서드
const updateData = () => {

    return loadFromLocalStorage();
};

// 컴포넌트 마운트 시 초기 데이터 로드
onMounted(() => {

    loadFromLocalStorage();
});

// 외부에서 접근할 수 있도록 요약 정보를 가져오는 함수 노출
const getSummary = () => {
    return {
        subject: subject.value,
        keyword: keyword.value,
        gist: gist.value
    };
};
// 요약 정보 설정 (외부에서 호출 가능)
const setSummary = (summaryData) => {

    if (!summaryData) {

        return;
    }
        // subject와 keyword 값 설정 - 명시적으로 빈 문자열 처리
        subject.value = summaryData.subject || '';
        keyword.value = summaryData.keyword || '';

        if (summaryData.gist !== undefined) {
            // 빈 배열이 아닌 경우에만 설정
            if (!(Array.isArray(summaryData.gist) && summaryData.gist.length === 0)) {
                gist.value = summaryData.gist;

            } else {
                // 빈 배열인 경우 로컬 스토리지에서 gist 복구 시도
                try {
                    const storedData = localStorage.getItem('genieq-passage-data');
                    if (storedData) {
                        const passageData = JSON.parse(storedData);
                        if (passageData.gist || passageData.PAS_GIST) {
                            gist.value = passageData.gist || passageData.PAS_GIST;

                        }
                    }
                } catch (error) {

                }
            }
    }
    // console.log('[28] PassageSummary: 설정된 요약 정보', {
    //     subject: subject.value,
    //     keyword: keyword.value,
    //     gist: gist.value,
    //     gistText: gistText.value 
    // });
};

// 값 변경 감지
watch([subject, keyword, gist], () => {

});
// 외부에서 사용 가능한 메서드 노출
defineExpose({
    getSummary,
    setSummary,
    updateData // 로컬 스토리지 데이터 갱신 메서드
});
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
    top: 70px;
}

.passage-type-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 8px;

    width: 522px;
    height: 180px;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}

#passage-type-text {
    width: 522px;
    height: 36px;
    padding-top: 5px;
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

#subject {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 20px;

    width: 482px;
    height: 46px;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}

#subject-head {
    height: 30px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;
}

#subject-text {
    height: 30px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;

    flex: none;
    order: 0;
    flex-grow: 0;
}

#keyword {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 20px;

    width: 482px;
    height: 46px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}

#keyword-head {
    width: 73px;
    height: 30px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;

    flex: none;
    order: 0;
    flex-grow: 0;
}

#keyword-text {
    height: 30px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #000000;

    flex: none;
    order: 0;
    flex-grow: 1;
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
    height: 442px;
    line-height: 200%;

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
</style>