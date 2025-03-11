<template>
     <div class="card-container">
        <div class="card">
            <div>
                <p class="card-title">문제 출제를 더 쉽고, 빠르고, 정확하게 <br> 안녕하세요. 유저이름님</p>
                <p class="sub-text">현재 보유 이용권 <span class="highlight">{{ ticketCount }}</span>회</p>
            </div>
            <router-link :to="{ name: 'my-page-wrapper', query: { 'tab': '이용권' } }">
                <div class="count-badge">추가 구매</div>
            </router-link>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
// 티켓 카운트를 저장할 반응형 변수 선언
const ticketCount = ref("n");

// 컴포넌트가 마운트될 때 자동으로 티켓 정보 조회 실행
onMounted(() => {
    // 컴포넌트 로드 시 티켓 정보 조회
    getTicketCount();
});
// 티켓 정보 조회 함수
function getTicketCount() {
    // fetch를 사용한 티켓 정보 조회 요청
    fetch('http://localhost:9090/api/info/select/ticket', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include' // 쿠키를 포함시켜 세션 유지
    })
    .then(response => {
        console.log("서버 응답 상태 코드:", response.status);
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.text();
    })
    .then(data => {
        // 티켓 정보 갱신
        console.log("티켓 수량:", data);
        ticketCount.value = data;
    })
    .catch(error => {
        console.error("티켓 조회 실패:", error);
        alert("티켓 정보를 가져오는데 실패했습니다.");
    });
}
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