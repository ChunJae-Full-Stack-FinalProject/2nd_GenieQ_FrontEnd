<template>
    <div class="mypage-header">
      <h2 class="page-title">마이페이지</h2>
      <div class="tab-menu">
        <span class="active-tab">회원정보</span>
        <span>이용권</span>
        <span>공지사항</span>
        <span>자주 묻는 질문</span>
      </div>
    </div>
    <MyPageContent/>
</template>

<script setup>
  import MyPageContent from './MyPageContent.vue';
</script>

<style scoped>
  #mypage-info {
    position: relative;
    width: 1920px;
    height: 973px;
    left: 1851px;
    top: 12547px;
    background: #F6F6F6;
  }

  .mypage-header {
    position: absolute;
    width: 1764px;
    height: 182px;
    left: 156px;
    top: 0px;
    background: #FFFFFF;
  }

  .page-title {
    position: absolute;
    width: 102px;
    height: 36px;
    left: 40px;
    top: 40px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 150%;
    letter-spacing: -0.02em;
    color: #303030;
  }

  .tab-menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 8px 0px 136px;
    gap: 24px;
    position: absolute;
    width: 1764px;
    height: 50px;
    left: 156px;
    top: 131px;
  }

  .active-tab {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px 20px;
    gap: 10px;
    width: 108px;
    height: 50px;
    background: #FFFFFF;
    border-bottom: 2px solid #FF9F40;
    flex: none;
    order: 0;
    flex-grow: 0;
  }
</style>