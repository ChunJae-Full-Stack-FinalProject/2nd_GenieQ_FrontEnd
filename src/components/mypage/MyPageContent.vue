<template>
    <div id="content-container">
        <Info/>
        <Ticket/>
        <Notice/>
        <Fnq/>
    </div>
</template>
<script setup>
    import Info from './Info.vue';
    import Ticket from './Ticket.vue';
    import Notice from './Notice.vue';
    import Fnq from './Fnq.vue';
</script>
<style scoped>
    #content-container {
        position: absolute;
        left: 156px;
        top: 182px;
    }
</style>