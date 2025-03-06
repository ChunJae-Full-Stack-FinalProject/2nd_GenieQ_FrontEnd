<template>
    <div class="app-container">
        <div class="main-content">
            <CreatePassageMain/>
            <PaymentUsage/>
            <BaseButton id="reset_button" text="초기화" type="type2" width="248px" height="54px" />

            <router-link to="/passage/create">
            <!-- front 작업할 때 disabled 속성 추가해야함 -->
                <BaseButton id="create_button" text="지문 생성하기" type="type2" width="248px" height="54px"/>
            </router-link>
        </div>
    </div>
</template>
<script setup>
import CreatePassageMain from '@/components/generation/passage/PassageMain/CreatePassageMain.vue';
import PaymentUsage from '@/components/generation/passage/PassageMain/PaymentUsage.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
</script>
<style scoped>
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