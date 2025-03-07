<template>
    <BaseModal :isOpen="isOpen" width="435px" height="533px" @close="closeModal">
        <div class="modal-container">
        <!-- ✅ 항상 표시되는 잠금 아이콘 -->
        <div class="pwd-icon">
          <div class="pwd-circle">
            <div class="pwd-inner-circle">
                <Icon icon="mdi:password-outline" class="pwd-icon-symbol" width="24" height="24" />
            </div>
          </div> 
        </div>

        <div class="modal-title">비밀번호 변경</div>

        <form class="pwd-form">
            <div class="pwd-input-group">
                <label>현재 비밀번호 *</label>
                <div class="input-container">
                    <input v-model="currentPassword" :type="showPassword.current ? 'text' : 'password'" placeholder="비밀번호 입력" />
                    <Icon :icon="showPassword.current ? 'basil:eye-outline' : 'basil:eye-closed-outline'" width="24px" height="24px" class="eye-icon" @click="togglePasswordVisibility('current')" />
                </div>
                <div class="error-area">
                    <span></span>
                </div>
            </div>
            <div class="pwd-input-group">
                <label>새로운 비밀번호 *</label>
                <div class="input-container">
                    <input v-model="newPassword" :type="showPassword.new ? 'text' : 'password'" placeholder="새로운 비밀번호 입력" />
                    <Icon :icon="showPassword.new ? 'basil:eye-outline' : 'basil:eye-closed-outline'" width="24px" height="24px" class="eye-icon" @click="togglePasswordVisibility('new')" />
                </div>
                <div class="error-area">
                    <p class="pwd-hint">8자리 이상, 영문+숫자+특수문자(@#$%^&*) 조합</p>
                </div>
            </div>
            
            <div class="pwd-input-group">
                <label>새로운 비밀번호 확인 *</label>
                <!-- <div class="input-container">
                    <input v-model="confirmPassword" :type="showPassword.confirm ? 'text' : 'password'" placeholder="새로운 비밀번호 입력" />
                    <Icon :icon="showPassword.confirm ? 'basil:eye-outline' : 'basil:eye-closed-outline'" width="24px" height="24px" class="eye-icon" @click="togglePasswordVisibility('confirm')" />
                </div> -->
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
                <BaseButton text="비밀번호 변경" type="type1" width="187.5px" height="46px" :disabled="!isButtonEnabled"/>
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

const emit = defineEmits(["close"]);
const showPassword = ref({ current: false, new: false, confirm: false });
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const closeModal = () => {
  emit("close");
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
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

/* ✅ 잠금 아이콘 스타일 */
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