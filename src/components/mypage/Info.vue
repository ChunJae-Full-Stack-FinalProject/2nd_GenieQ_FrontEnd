<template>
  <div id="mypage-info">
    <div class="info-container">

      <section class="basic-info-section">
        <div class="info-header">
          <h3 class="info-title">기본 정보</h3>
        </div>
        <div class="info-item">
          <span class="info-label">이름</span>
          <span class="info-value">송겨울</span>
        </div>
        <div class="info-item">
          <span class="info-label">이메일</span>
          <span class="info-value">songwinter@naver.com</span>
        </div>
        <div class="info-item">
          <span class="info-label">비밀번호</span>
          <span class="info-value">********</span>
        </div>
      </section>

      <section class="additional-info-section">
        <div class="info-header">
          <h3 class="info-title">추가 정보</h3>
        </div>
        <div class="info-item">
          <span class="info-label">성별</span>
          <span class="info-value">여성</span>
        </div>
        <div class="info-item">
          <span class="info-label">소속</span>
          <span class="info-value">고등교사</span>
        </div>
      </section>

      <button class="edit-button">정보 변경하기</button>

      <div class="account-actions">
        <span class="delete-account">회원 탈퇴</span>
        <span class="logout">로그아웃</span>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
  .info-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 40px;
    position: absolute;
    width: 1472px;
    height: 384px;
    left: 292px;
    top: 275px;
  }

  .basic-info-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 20px;
    gap: 4px;
    width: 1472px;
    height: 194px;
    background: #FFFFFF;
    border-radius: 12px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
  }

  .additional-info-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 20px;
    gap: 4px;
    width: 1472px;
    height: 158px;
    background: #FFFFFF;
    border-radius: 12px;
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
  }

  .info-header {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 160px;
    width: 1432px;
    height: 46px;
    border-bottom: 1px solid #E1E1E1;
    border-radius: 12px 12px 0px 0px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
  }

  .info-title {
    width: 73px;
    height: 30px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;
    letter-spacing: -0.02em;
    color: #FF9F40;
    flex: none;
    order: 0;
    flex-grow: 0;
  }

  .info-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 160px;
    width: 1432px;
    height: 44px;
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
  }

  .info-label {
    width: 28px;
    height: 24px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: -0.02em;
    color: #303030;
    flex: none;
    order: 0;
    flex-grow: 0;
  }

  .info-value {
    width: 41px;
    height: 28px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
    letter-spacing: -0.02em;
    color: #303030;
    flex: none;
    order: 0;
    flex-grow: 0;
  }

  .edit-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px;
    gap: 8px;
    position: absolute;
    width: 248px;
    height: 46px;
    left: 1516px;
    top: 205px;
    background: #FF9F40;
    border-radius: 8px;
  }

  .account-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 16px;
    position: absolute;
    width: 240px;
    height: 40px;
    left: 1524px;
    top: 860px;
  }

  .delete-account {
    width: 58px;
    height: 24px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: -0.02em;
    color: #5F5F5F;
    flex: none;
    order: 0;
    flex-grow: 0;
  }

  .logout {
    width: 55px;
    height: 24px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: -0.02em;
    color: #FF9F40;
    flex: none;
    order: 0;
    flex-grow: 0;
  }
  
</style>  