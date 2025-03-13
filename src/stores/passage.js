// src/stores/passage.js
import { defineStore } from "pinia";

export const usePassageStore = defineStore('passage', {
    state: () =>({
        passage: [],
        currentPassage: null,
        isLoading: false,
        error: null
    }),

    getters :{
        //현재 선택된 지문 가져오기
        getCurrentPassage: (state) => state.currentPassage,
        
        //모든 지문 목록 가져오기
        getAllPassages: (sate) => state.passages,

        //로딩 상태 확인
        isPassageLoading: (state) => state.isLoading
    },

    actions:{
        //지문 저장 기능
        savePassage(passageData){
            this.isLoading = true;
            this.error = null;

            const apiUrl = import.meta.env.VITE_API_URL;

            return fetch(`${apiUrl}/pass/insert/each`,{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(passageData)
            })
            .then(Response => {
                if(!Response.ok){
                    throw new Error('지문 저장에 실패했습니다.');
                }
                return Response.json();
            })
            .then(data => {
                //현재 지문 업데이트
                this.currentPassage = data;

                //저장된 지문을 목록에 추가/업데이트
                this.updatePassageInList(data);

                return {success: true, passage: data};
            })
            .catch(error => {
                console.error('지문 저장 오류', error);
                this.error = error.message;
                return { success: false, error: this.error };
            })
            .finally(() => {
                this.isLoading = false;
            });
        },

        // 지문 목록 업데이트 헬퍼 함수
        updatePassageInList(passage){
            const index = this.passage.findIndex(p=> p.id === passage.id);

            if (index !== -1){
                //기존 항목 업데이트
                this.passage[index] = passage;
            }else{
                //새 항목
                this.passage.push(passage);
            }
        }
    }
})