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
import CreatePassageMain from './components/CreatePassage/components/CreatePassageMain.vue';
import PaymentUsage from './components/CreatePassage/components/PaymentUsage.vue';

</script>
<style scoped>

</style>