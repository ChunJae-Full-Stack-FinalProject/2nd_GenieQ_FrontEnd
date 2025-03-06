<template>
    <div class="frame">
        <p>ExView.vue 입니다</p>
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
        <!-- 기본 버튼 -->
        <div>
          <h2>기본 버튼</h2>
            <!-- 기본 크기 -->
            <BaseButton text="TYPE 1" type="type1" @click="handleClick" />

            <!-- 크기 변경 -->
            <BaseButton text="LARGE BUTTON" type="type2" width="200px" height="50px" />

            <!-- 더 작은 버튼 -->
            <BaseButton text="SMALL" type="type3" width="80px" height="30px" />

            <!-- 비활성화 버튼 -->
            <BaseButton text="DISABLED" type="type4" disabled />

            <!-- hover 효과 확인 -->
            <BaseButton text="HOVER ME" type="type5" width="150px" height="45px" />
          </div>

          <!-- 기본 tooltip -->
        <div>
          <PlainTooltip id="example" message="Test Message" width="153px"/>
          <!-- 피그마에 뜬 width값에 20 더해서 width 속성에 넣어주세요!! -->
           <!-- id값을 이용해서 style 태그에 position:absolute; top:00px; left:00px; 로 위치 조정해주세요 -->
        </div>
        </div>

        
    </div>
</template>

<script setup>
import TestSideNavBarComponent from '@/components/test/TestSideNavBarComponent.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import PlainTooltip from '@/components/common/PlainTooltip.vue';

</script>

<style scoped>
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