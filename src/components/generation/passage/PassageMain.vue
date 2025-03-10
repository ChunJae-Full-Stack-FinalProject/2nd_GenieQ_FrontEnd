<template>
    <div class="app-container">
        <div class="main-content">
            <InputPassageTitle ref="passageTitleRef"/>
            <CreatePassageMain @input-change="updateInputText"/>
            <PaymentUsage/>
            <BaseButton id="reset_button" text="초기화" type="type2" width="248px" height="54px" />
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
import { ref, computed , defineExpose } from 'vue';
import CreatePassageMain from '@/components/generation/passage/PassageMain/CreatePassageMain.vue';
import PaymentUsage from '@/components/generation/PaymentUsage.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import InputPassageTitle from '@/components/generation/passage/PassageContent/InputPassageTitle.vue';

const inputText = ref('');
const isButtonEnabled = computed(() => inputText.value.length >= 2);

const updateInputText = (text) => {
    inputText.value = text;
    console.log('Text updated:', inputText.value, 'Length:', inputText.value.length);
    console.log('Button enabled:', isButtonEnabled.value);
};
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