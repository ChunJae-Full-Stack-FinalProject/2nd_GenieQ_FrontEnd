<template>
    <div>
        <p>ExampleView 페이지 입니다</p>
        <p>side-nav-bar 컴포넌트 삽입</p>
        <p>footer-nav-bar 컴포넌트 삽입</p>
        <p>slot 을 이용해서 MainHome/Gen/Mypage/Storage 컴포넌트 삽입</p>
    </div>
    <div class="frame-container">
        <TestSideNavBarComponent />
        <div class="content-area">
          content-area 에 각 컴포넌트가 들어가게 됩니다. <br><br>
          <!-- 라우터 뷰로 slot을 대체합니다 -->
          <router-view />
        </div>
    </div>
    <div>
        <p>{{ globalStore.count }}</p>
        <p>테스트용 예제 뷰 페이지</p>
    </div>
</template>
<script>
    import TestSideNavBarComponent from '@/components/test/SideNavBarComponent.vue';
    import { useGlobalNameStore } from '@/stores/globalNameStore';
    const globalStore = useGlobalNameStore();
</script>
<style>
    .frame-container {
    display: flex;
    min-height: 100vh;
    }

    .content-area {
    flex: 1;
    padding: 20px;
    background-color: #f4f6f9;
    overflow-y: auto;
    }
</style>