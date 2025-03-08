<template>
    <div class="app-container">
        <div class="main-content">
            <WelcomInfo/>
            <NoticeList/>
            <ToFAQ/>
            <NotionLink/>
            <WorkList/>
        </div>
    </div>
</template>
<script setup>
import WelcomInfo from '@/components/mainhome/MainContent/WelcomInfo.vue'
import NoticeList from '@/components/mainhome/MainContent/NoticeList.vue'
import ToFAQ from '@/components/mainhome/MainContent/ToFAQ.vue'
import NotionLink from '@/components/mainhome/MainContent/NotionLink.vue'
import WorkList from '@/components/mainhome/MainContent/WorkList.vue'
</script>
<style scoped>
.app-container {
    width: 100%;
    padding: 20px 30px 80px 20px;
}
</style>


