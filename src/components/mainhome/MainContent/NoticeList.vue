<template>
        <div class="noticecard-container">
            <div class="noticelist-card">
                <div>
                    <router-link :to="{ name: 'my-page-wrapper', query: { 'tab': '공지사항' } }">
                    <div class="top-container">
                        <div class="notice-title">공지사항</div>
                            <Icon icon="weui:arrow-outlined" width="24" height="24" id="arrow-icon" style="color: #303030" />
                        </div>
                    </router-link>
                </div>
                <div class="notice-main">
                    <ol class="notice-list">
                        <li v-for="notice in notices" :key="index" class="list-item">
                            <router-link :to="`/notice/${notice.NOT_CODE}`" class="notice-link">
                                {{ notice.NOT_TITLE }}
                            </router-link>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
</template>
<script setup>
import { Icon } from "@iconify/vue";
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth";

// 라우터와 스토어 초기화
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 공지사항 데이터 (최대 4개)
const notices = ref ([]);

// 컴포넌트 마운트 시, 데이터 로드
onMounted(() => {
    fetchNotices();
});

// 공지사항 데이터 가져오기
const fetchNotices = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/noti/select/list`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            // 인증 오류 처리 (401)
            if (response.status === 401) {
                console.error('인증 오류(401): 로그인이 필요합니다');

                // 인증 상태 초기화
                authStore.user = null;
                authStore.isAuthenticated = false;
                localStorage.removeItem('authUser');

                // 로그인 페이지로 리다이렉트
                router.push({ 
                    path: '/login', 
                    query: { redirect: route.fullPath }
                });

                throw new Error('인증이 필요합니다');
            }
            return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
    })
    .then(data => {
        // 응답 데이터 구조에 맞게 매핑하고 최신 4개만 사용
        notices.value = data.map(item => ({
            NOT_CODE: item.notCode,
            NOT_TYPE: item.type,
            NOT_TITLE: item.title,
            NOT_DATE: item.date,
            NOT_CONTENT: item.content || ''
        })).slice(0, 4); // 최신 4개만 가져옴
    })
    .catch(error => {
        console.error('공지사항 데이터 불러오기 실패:', error);
    });
};
</script>
<style scoped>
.noticelist-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 12px;
    isolation: isolate;
    position: absolute;
    width: 460px;
    height: 280px;
    left: 768px;
    top: 48px;
    background: #FFFFFF;
    border-radius: 8px;
    box-sizing: border-box;
}

.notice-title {
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #333333;
    margin: 0;
}

.top-container{
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0px;
    gap: 83px;

    width: 420px;
    height: 46px;

    border-bottom: 1px solid #E1E1E1;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}
a {
    text-decoration: none;
}
.notice-title {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;

    display: flex;
    align-items: center;
    letter-spacing: -0.02em;

    color: #424242;

    flex: none;
    order: 0;
    flex-grow: 0;
}
#arrow-icon {
    width: 12px;
    height: 24px;

    flex: none;
    order: 1;
    flex-grow: 0;
}

.highlight {
    color: #FF9F40;
    font-weight: 500;
}

.notice-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 8px;
    width: 420px;
    height: 184px;
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
}
.notice-link:hover {
    font-weight: 500;
}
.notice-link {
    width: 100%;
    color:#424242;
}

.list-item {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 0px;
    gap: 8px;

    width: 420px;
    height: 40px;

    border-bottom: 1px solid #E1E1E1;

    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
}

</style>
