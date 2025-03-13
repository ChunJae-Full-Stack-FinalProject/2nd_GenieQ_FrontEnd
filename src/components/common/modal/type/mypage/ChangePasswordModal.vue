<template>
    <BaseModal :isOpen="isOpen" width="435px" height="533px" @close="closeModal">
        <div class="modal-container">
        <div class="pwd-icon">
          <div class="pwd-circle">
            <div class="pwd-inner-circle">
                <Icon icon="mdi:password-outline" class="pwd-icon-symbol" width="24" height="24" />
            </div>
          </div> 
        </div>
        <div class="modal-title">비밀번호 변경</div>
        <form class="pwd-form" @submit.prevent="changePassword">
            <div class="pwd-input-group">
                <label>현재 비밀번호 *</label>
                <div class="input-container" :class="{'error-border': currentPasswordError}">
                    <input v-model="currentPassword" :type="showPassword.current ? 'text' : 'password'" placeholder="비밀번호 입력" />
                    <Icon :icon="showPassword.current ? 'basil:eye-outline' : 'basil:eye-closed-outline'" width="24px" height="24px" class="eye-icon" @click="togglePasswordVisibility('current')" />
                </div>
                <div class="error-area">
                    <span class="error-text" v-if="currentPasswordError">{{ currentPasswordError }}</span>
                </div>
            </div>
            <div class="pwd-input-group">
                <label>새로운 비밀번호 *</label>
                <div class="input-container" :class="{'error-border': newPasswordError}">
                    <input v-model="newPassword" :type="showPassword.new ? 'text' : 'password'" placeholder="새로운 비밀번호 입력" />
                    <Icon :icon="showPassword.new ? 'basil:eye-outline' : 'basil:eye-closed-outline'" width="24px" height="24px" class="eye-icon" @click="togglePasswordVisibility('new')" />
                </div>
                <div class="error-area">
                    <span class="error-text" v-if="newPasswordError">{{ newPasswordError }}</span>
                    <p class="pwd-hint" v-else>8자리 이상, 영문+숫자+특수문자(@#$%^&*) 조합</p>
                </div>
            </div>
            
            <div class="pwd-input-group">
                <label>새로운 비밀번호 확인 *</label>
                <div class="input-container" :class="{'error-border': isPasswordMismatch, 'success-border': isPasswordMatch}">
                    <input v-model="confirmPassword" :type="showPassword.confirm ? 'text' : 'password'" placeholder="새로운 비밀번호 입력" />
                    <Icon :icon="showPassword.confirm ? 'basil:eye-outline' : 'basil:eye-closed-outline'" width="24px" height="24px" class="eye-icon" @click="togglePasswordVisibility('confirm')" />
                </div>
                <div class="error-area">
                    <span class="error-text" v-if="isPasswordMismatch">비밀번호가 일치하지 않습니다.</span>
                    <span class="success-text" v-if="isPasswordMatch">비밀번호가 일치합니다.</span>
                </div>
            </div>
             <!-- 버튼 영역 -->
             <div class="modal-footer">
                <BaseButton text="닫기" type="type3" width="187.5px" height="46px" @click="closeModal" />
                <BaseButton text="비밀번호 변경" type="type1" width="187.5px" height="46px" :disabled="!isButtonEnabled || isLoading" :loading="isLoading" @click="changePassword"/>
            </div>
        </form> 
    </div>
    </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import BaseModal from '../../BaseModal.vue';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits(["close", "success-message", "error-message"]);
const props = defineProps({
  isOpen: Boolean,
});

// 라우터 및 인증 스토어 초기화
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const showPassword = ref({ current: false, new: false, confirm: false });
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const currentPasswordError = ref('');
const newPasswordError = ref('');
const error = ref(null);

const closeModal = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  currentPasswordError.value = '';
  newPasswordError.value = '';
  error.value = null;
};

const togglePasswordVisibility = (field) => {
    showPassword.value[field] = !showPassword.value[field];
};

const isPasswordMismatch = computed(() => {
    return newPassword.value !== '' && confirmPassword.value !== '' && newPassword.value !== confirmPassword.value;
});

const isPasswordMatch = computed(() => {
    return newPassword.value !== '' && confirmPassword.value !== '' && newPassword.value === confirmPassword.value;
});

const isButtonEnabled = computed(() => {
    return currentPassword.value.trim() !== '' &&
           newPassword.value.trim() !== '' &&
           confirmPassword.value.trim() !== '' &&
           isPasswordMatch.value;
});

// 비밀번호 변경 함수
const changePassword = () => {
    // 폼 제출 방지
    event?.preventDefault();
    
    // 에러 초기화
    currentPasswordError.value = '';
    newPasswordError.value = '';
    error.value = null;
    
    // 인증 상태 확인
    if (!authStore.isAuthenticated) {
        emit('error-message', '로그인이 필요합니다. 다시 로그인해주세요.');
        router.push({ path: '/login', query: { redirect: route.fullPath } });
        return;
    }
    
    // 비밀번호 정규식 검증 (8자리 이상, 영문+숫자+특수문자(@#$%^&*) 조합)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,}$/;
    if (!passwordRegex.test(newPassword.value)) {
        newPasswordError.value = '8자리 이상, 영문+숫자+특수문자(@#$%^&*) 조합이어야 합니다.';
        return;
    }
    
    // 비밀번호 변경 요청 보내기
    isLoading.value = true;
    
    // 요청 데이터
    const requestData = {
        "currentPassword": currentPassword.value,
        "newPassword": newPassword.value,
        "confirmPassword": confirmPassword.value
    };
    
    // API 엔드포인트
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9090';
    console.log("감자스타트"+JSON.stringify(requestData),)
    // API 요청
    fetch(`${apiUrl}/api/info/update/password`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 
            'Content-Type': 'application/json'
            // 쿠키 기반 인증을 사용하므로 별도의 토큰 헤더는 필요 없음
        },
        body: JSON.stringify(requestData),
       
    })
    .then(response => {
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
        return response.text().then(text => { throw new Error(text); });
    }
    
    // 응답이 JSON인지 확인하고 적절히 처리
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    } else {
        // JSON이 아닌 경우 텍스트로 처리
        return response.text();
    }
})
.then(data => {
    console.log('비밀번호 변경 성공:', data);
    emit('success-message', '비밀번호가 성공적으로 변경되었습니다.');
    closeModal();
})
    .catch(err => {
        console.error('비밀번호 변경 오류:', err);
        console.error('에러 유형:', err.name);
        console.error('에러 메시지:', err.message);
        
        if (!currentPasswordError.value) {
            error.value = err.message || '비밀번호 변경 중 오류가 발생했습니다.';
            emit('error-message', error.value);
            
            // 인증 오류인 경우 로그인 페이지로 리다이렉트
            if (err.message.includes('인증에 실패했습니다') || err.message.includes('로그인이 필요합니다')) {
                router.push({ path: '/login', query: { redirect: route.fullPath } });
            }
        }
    })
    .finally(() => {
        isLoading.value = false;
    });
};

// 컴포넌트 마운트 시 로그인 상태 확인
if (!authStore.isAuthenticated) {
    console.log('인증 상태 없음: 로그인이 필요합니다');
}
</script>

<style scoped>
.modal-container{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.pwd-icon{
    align-self: center;
}

/* 잠금 아이콘 스타일 */
.pwd-circle {
    width: 60px;
    height: 60px;
    background-color: rgba(255, 159, 64, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.pwd-inner-circle {
    width: 40px;
    height: 40px;
    background-color: rgba(255, 159, 64, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pwd-icon-symbol {
    color: #FF9F40;
}

.modal-title{
    align-self: start;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;
    letter-spacing: -2%;
    color: #424242;
}

.pwd-input-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

label{
    font-weight: 700;
    font-size: 16px;
    line-height: 28px;
    color: #424242;
}

.input-container {
    width: 387px;
    height: 44px;
    display: flex;
    align-items: flex-start;
    border: 1px solid #757575;
    border-radius: 6px;
    padding: 8px 12px;
}

input {
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
    border: none;
    outline: none;
    flex-grow: 1;
    align-self: center;
}

.eye-icon {
    cursor: pointer;
    color: #424242;
    align-self: center;
}

.error-area{
    height: 18px;
}

.pwd-hint {
    font-weight: 400;
    font-size: 13px;
    line-height: 150%;
    letter-spacing: -2%;
    color:#757575;
}

.error-border {
    border-color: #FF4040 !important;
}

.success-border {
    border-color: #28A745 !important;
}

.error-text {   
    color: #FF4040;
    font-weight: 400;
    font-size: 13px;
    line-height: 150%;
}

.success-text {
    color: #28A745;
    font-weight: 400;
    font-size: 13px;
    line-height: 150%;
}

.modal-footer {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 15px;
}
</style>