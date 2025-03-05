<template>
    <div class="app-container">
        <!-- <Sidebar/> 컴포넌트 추가 -->
        <div class="main-content">
            <CreatePassageMain/>
            <PaymentUsage/>
            <!-- <ResetComponent id="reset-component"/> //컴포넌트 추가 -->
            <!-- <CreateComponent id="create-component"/> //컴포넌트 추가 -->
        </div>
    </div>
</template>
<script setup>
import CreatePassageMain from '@/components/generation/passage/CreatePassageMain.vue';
import PaymentUsage from '@/components/generation/passage/PaymentUsage.vue';
import BaseButton from '../common/button/BaseButton.vue';

</script>
<style scoped>

</style>