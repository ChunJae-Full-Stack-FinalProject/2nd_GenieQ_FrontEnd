// src/stores/passage.js
import { defineStore } from "pinia";
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export const usePassageStore = defineStore('passage', {
    state: () => ({
        passage: [],
        currentPassage: null,
        isLoading: false,
        error: null
    }),

    getters: {
        // 현재 선택된 지문 가져오기
        getCurrentPassage: (state) => state.currentPassage,
        
        // 모든 지문 목록 가져오기
        getAllPassages: (state) => state.passage,

        // 로딩 상태 확인
        isPassageLoading: (state) => state.isLoading
    },

    actions: {
        // 지문 저장 기능
        savePassage(passageData) {
            this.isLoading = true;
            this.error = null;

            const apiUrl = import.meta.env.VITE_API_URL;
            const router = useRouter();
            const route = useRoute();
            const authStore = useAuthStore();

            console.log('💾 저장할 데이터:', passageData);

            return fetch(`${apiUrl}/pass/insert/each`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(passageData)
            })
            .then(response => {
                console.log('🌐 서버 응답 상태:', response.status);
                
                if (!response.ok) {
                    // 인증 오류 처리 (401)
                    if (response.status === 401) {
                        // (추가) 로그 - 인증 오류 감지
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
        
                        // 추가 처리를 중단하기 위한 에러 발생
                        throw new Error('인증이 필요합니다');
                    }
                    return response.text().then(text => { 
                        console.error(`🚨 서버 응답 오류: ${response.status} ${response.statusText} - ${text}`);
                        throw new Error(text); 
                    });
                }

                 // 응답이 JSON인지 확인 후 파싱
                return response.json().catch(() => {
                    throw new Error('🚨 서버에서 잘못된 JSON 응답 수신');
                });
                
            })
            .then(data => {
                console.log('✅ 서버 응답 데이터:', data);

                // 데이터 유효성 검사 추가
                if (!data || !data.pasCode) {
                    console.error('🚨 서버에서 유효한 응답 없음:', data);
                    throw new Error('서버에서 유효한 데이터가 반환되지 않았습니다.');
                }
        
                // 현재 지문 상태 업데이트
                this.currentPassage = data;

                // 반응형 상태 업데이트
                this.$patch(state => {
                    const index = state.passage.findIndex(p => p.pasCode === data.pasCode);
                    if (index !== -1) {
                        state.passage[index] = data;
                    } else {
                        state.passage.push(data);
                    }
                });
                console.log('✅ 저장 성공:', data);
                return { success: true, passage: data };
            })
            .catch(error => {
                console.error('지문 저장 오류:', error);
                this.error = error.message || '지문 저장 중 오류가 발생했습니다.';
                return { success: false, error: this.error };
            })
            .finally(() => {
                this.isLoading = false;
            });
        }
    }
});
