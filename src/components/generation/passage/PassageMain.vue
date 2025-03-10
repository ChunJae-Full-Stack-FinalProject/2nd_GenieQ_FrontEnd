<template>
    <div class="app-container">
        <div class="main-content">
            <CreatePassageMain ref="createPassageMainRef" @input-change="updateInputText" @category-change="updateCategory"/>
            <PaymentUsage/>
            <BaseButton id="reset_button" text="초기화" type="type2" width="248px" height="54px" :disabled="!hasContent" @click="resetText"/>
            <router-link to="/passage/create" v-if="isButtonEnabled">
                <BaseButton 
                    id="create_button" 
                    text="지문 생성하기" 
                    type="type2" 
                    width="248px" 
                    height="54px"
                />
            </router-link>
            <BaseButton 
                v-else
                id="create_button" 
                text="지문 생성하기" 
                type="type2" 
                width="248px" 
                height="54px"
                disabled
            />
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import CreatePassageMain from '@/components/generation/passage/PassageMain/CreatePassageMain.vue';
import PaymentUsage from '@/components/generation/PaymentUsage.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';

const inputText = ref('');
const selectedCategory = ref('human');
const createPassageMainRef = ref(null);
const isButtonEnabled = computed(() => inputText.value.length >= 1);

// 지문 제재 초기화 함수
const resetText = () => {
    inputText.value = '';

    if (createPassageMainRef.value) {
        createPassageMainRef.value.resetForm();
    }
}

const hasContent = computed(() => {
    return inputText.value && inputText.value.trim().length > 0;
})

const updateInputText = (text) => {
    inputText.value = text;
};

const updateCategory = (category) => {
    selectedCategory.value = category;
}
</script>
<style scoped>
.app-container {
    width: 100%;
    padding: 20px 30px 80px 20px;
}
#reset_button {
    position: absolute;
    left: 1244px;
    top: 852px;
}
#create_button {
    position: absolute;
    left: 1516px;
    top: 852px;
}
</style>