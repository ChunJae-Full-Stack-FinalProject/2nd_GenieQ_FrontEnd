<template>
     <div class="card-container">
        <div class="card">
            <div>
                <p class="card-title">문제 출제를 더 쉽고, 빠르고, 정확하게 <br> 안녕하세요. {{username}}님</p>
                <p class="sub-text">현재 보유 이용권 <span class="highlight">{{ ticketCount }}</span>회</p>
            </div>
            <router-link :to="{ name: 'my-page-wrapper', query: { 'tab': '이용권' } }">
                <div class="count-badge">추가 구매</div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
//auth.js에서 티켓 업데이트 하는 거 가져오기
import {computed, onMounted} from 'vue';
import { useAuthStore } from '@/stores/auth';


//Auth 스토어 사용
const authStore = useAuthStore();

//티켓 카운트와 사용자 이름을 스토어에서 가져오기
const ticketCount = computed(()=> authStore.userTicketCount);
const username = computed(()=> authStore.user?.name || '사용자');

//컴포넌트가 마운트될 때 자동으로 티켓 정보 조회 실행
onMounted(()=>{
    //로그인된 상태일 때만 티켓 정보 요청
    if(authStore.isAuthenticated){
        authStore.updateTicketCount();
    }
})

</script>
<style scoped>
.card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 12px;
    isolation: isolate;
    position: absolute;
    width: 460px;
    height: 280px;
    left: 292px;
    top: 48px;
    background: #FFFFFF;
    border-radius: 8px;
    box-sizing: border-box;
}

.card-title {
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #333333;
    margin: 0;
}

.highlight {
    color: #FF9F40;
    font-weight: 500;
}

.sub-text {
    font-family: 'Pretendard';
    font-size: 14px;
    line-height: 20px;
    color: #666666;
    margin-top: 5px;
}

.count-badge {
    position: absolute;
    right: 20px;
    bottom: 20px;
    background-color: #FF9500;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-size: 16px;
    font-weight: 600;
}
</style>