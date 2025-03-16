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
                <ol class="gist-content">
                    <li v-for="(item, index) in gistItems" :key="index" class="list-item">
                        {{ item }}
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, defineExpose, computed, watch } from 'vue';

// 데이터 관리
const subject = ref('');
const keyword = ref('');
const gist = ref('');

// 초기 값 설정 (값이 없으면 빈 문자열로 설정)
const savePassageData = JSON.parse(localStorage.getItem('saveResponse')) || {};
subject.value = savePassageData?.passage?.type || '';
keyword.value = savePassageData?.passage?.keyword || '';
gist.value = savePassageData?.passage?.gist || '';

// computed 속성으로 gist를 줄바꿈으로 분리해 배열로 변환
const gistItems = computed(() => {
    if (!gist.value) return [];
    if (typeof gist.value === 'string') {
        return gist.value.split(/\\n|\n/).filter(item => item.trim());
    } else if (Array.isArray(gist.value)) {
        return gist.value;
    }
    return [];
});

// 외부에서 접근할 수 있도록 요약 정보를 가져오는 함수 노출
const getSummary = () => {
    return {
        subject: subject.value,
        keyword: keyword.value,
        gist: Array.isArray(gist.value) ? gist.value : gist.value
    };
};
// 요약 정보 설정 (외부에서 호출 가능)
const setSummary = (summaryData) => {
    console.log('[27] PassageSummary: 요약 정보 설정', summaryData);
    if (summaryData) {
        // subject와 keyword 값 설정 - 명시적으로 빈 문자열 처리
        subject.value = summaryData.subject || '';
        keyword.value = summaryData.keyword || '';

        if (summaryData.gist !== undefined) {
            if (Array.isArray(summaryData.gist)) {
                gist.value = summaryData.gist;
                console.log('[27A] gist 배열로 설정:', gist.value);
            } else if (typeof summaryData.gist === 'string') {
                gist.value = summaryData.gist;
                console.log('[27B] gist 문자열로 설정:', gist.value);
            } else {
                gist.value = '';
            }
        } else {
            gist.value = '';
        }
    }
    console.log('[28] PassageSummary: 설정된 요약 정보', {
        subject: subject.value,
        keyword: keyword.value,
        gist: gist.value,
        gistItems: gistItems.value
    });
};
// (추가) subject와 keyword의 변경 감지
watch([subject, keyword, gist], () => {
    console.log('[28A] PassageSummary: 요약 정보 변경됨', {
        subject: subject.value,
        keyword: keyword.value,
        gistItems: gistItems.value
    });
});
// 외부에서 사용 가능한 메서드 노출
defineExpose({
    getSummary,
    setSummary
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

    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    border-radius: 12px;

    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}

.gist-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-left: 20px;
    gap: 20px;

    width: 482px;
    height: 208px;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;

    letter-spacing: -0.02em;
    color: #000000;
}
</style>