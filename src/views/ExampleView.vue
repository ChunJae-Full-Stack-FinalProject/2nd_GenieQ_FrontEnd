<template>
    <div>
        <p>{{ globalStore.count }}</p>
        <p>테스트용 예제 뷰 페이지</p>
    </div>
</template>
<script>
    import { useGlobalNameStore } from '@/stores/globalNameStore';
    const globalStore = useGlobalNameStore();
</script>
<style>
    
</style>