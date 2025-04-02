<template>
    <div class="insert-passage">
        <div class="edit-title">
            <p id="passage-head">작업이름</p>
            <input type="text" id="passage-title"
                placeholder="작업 이름을 입력해주세요. (최대 50자)" v-model="passageTitle"/>
        </div>
        <p id="insert-head">지문 입력</p>
        <div class="select-insert-type">
            <p id="user-passage" :class="{ active: activeTab === 'user'}" @click="setActiveTab('user')">
                사용자 입력
            </p>
            <p id="stores-passage" :class="{ active: activeTab === 'stores'}" @click="setActiveTab('stores')">
                자료실 지문
            </p>
        </div>
        <div id="passage-count"><span style="color: #FF9500;">{{ currentLength }}</span>/2300</div>

        <div>
            <div v-if="activeTab === 'user'" class="insert-passage-main">
                <UserInsertPassage/>
            </div>
            <div v-else class="insert-passage-main">
                <StoresInsertPassage/>
            </div>
        </div>

        <WarningModalComponent
            :isOpen="isWarningModalOpen"            title="지문 내용을 초기화하시겠습니까?"            message="현재 입력된 지문 내용이 모두 삭제됩니다."
            cancelText="취소"                       confirmText="확인"
            @close="closeWarningModal"              @confirm="confirmWarningModal"
            />
    </div>
</template>
<script setup>
import StoresInsertPassage from './StoresInsertPassage.vue';
import UserInsertPassage from './UserInsertPassage.vue';

import { ref, inject, computed, watch, defineExpose, onMounted} from 'vue';

// 현재 활성화된 탭 상태 관리
const activeTab = ref('user');

// provide로 제공된 데이터 주입
const { currentPassage, openLoadPassageModal } = inject('passageData');

const setActiveTab = (tab) => {
    // 탭이 이미 같은 경우는 아무것도 하지 않음
    if (tab === activeTab.value) return;
    
    // 이전 탭 저장 (디버깅 용)
    const prevTab = activeTab.value;
    
    // 탭 변경 전 데이터 초기화 (모달 없이 바로 초기화)
    if (tab === 'stores' || tab === 'user') {
        // 내용 초기화
        currentPassage.value.PAS_CONTENT = '';
        currentPassage.value.PAS_GIST = '';
        
        // 제목도 초기화
        currentPassage.value.PAS_TITLE = '';
        passageTitle.value = '';
        
        // 모달에서 선택된 정보도 초기화 - 전역 상태가 있다면
        localStorage.removeItem('selectedPassageData');
        
        console.log(`[InsertPassage] 탭 전환: ${prevTab} -> ${tab}, 내용 초기화 완료`);
    }
    
    // 탭 변경
    activeTab.value = tab;
};

// 제목 길이 50자 제한
// saveTitle이 존재할 때만 접근하도록 수정
const saveTitle = JSON.parse(localStorage.getItem('saveResponse')) || {};

const passageTitle = ref(
  saveTitle?.passage && saveTitle.passage.title 
    ? saveTitle.passage.title 
    : ''
);
const MAX_LENGTH = 50;

onMounted(() => {
  // genieq-passage-data에서 데이터 로드
  try {
    const storedData = localStorage.getItem('genieq-passage-data');
    if (storedData) {
      const data = JSON.parse(storedData);

      // 작업 이름 설정
      if (data.title) {
        passageTitle.value = data.title;
      }
      // 내용 설정 (currentPassage 업데이트)
      if (data.content && currentPassage.value) {
        currentPassage.value.PAS_CONTENT = data.content;
      }
      activeTab.value = 'user';
    }
  } catch (error) {

  }
});

watch(passageTitle, (newVal) => {
    // 최대 글자 수 제한
    if (newVal.length > MAX_LENGTH) {
        // 최대 길이로 잘라서 다시 설정
        passageTitle.value = newVal.substring(0, MAX_LENGTH);
    }
});

// 현재 입력된 글자 수 계산
const currentLength = computed(() => {
    return currentPassage.value?.PAS_CONTENT?.length || 0;
});

// 제목이 입력될 때 currentPassage 값 업데이트
watch(passageTitle, (newVal) => {
    currentPassage.value.PAS_TITLE = newVal;
});

// 탭 변경 시 currentLength 업데이트를 위한 감시자
watch (activeTab, () => {
    // 탭이 변경될 때 글자 수 재계산
    currentLength.value;
})

defineExpose({ passageTitle });
</script>
<style scoped>
.insert-passage {
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
}
#insert-head {
    position: absolute;
    width: 75px;
    height: 30px;
    left: 40px;
    top: 136px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #16252D;
}
#insert-subhead {
    position: absolute;
    height: 24px;
    left: 40px;
    top: 60px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #9D9D9D;
}
.select-insert-type {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 36px;

    position: absolute;
    width: 200px;
    height: 24px;
    left: 40px;
    top: 178px;
}
.select-insert-type > p {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 150%;

    letter-spacing: -0.02em;
    color: #424242;
}
/* 활성화된 탭 스타일 */
.select-insert-type > p.active {
    color: #FF9F40;
    text-decoration: underline;
}
#passage-count {
    position: absolute;
    width: 50px;
    height: 24px;
    left: 810px;
    top: 187px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;

    text-align: right;
    letter-spacing: -0.02em;
    color: #BDBDBD;
}
.insert-passage-main {
    box-sizing: border-box;
    position: absolute;
    width: 848px;
    height: 422px;
    left: 40px;
    top: 214px;

    background: #FFFFFF;
    border: 1px solid #FF9F40;
    border-radius: 12px;
}

</style>