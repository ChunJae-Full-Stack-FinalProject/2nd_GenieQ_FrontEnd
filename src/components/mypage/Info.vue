<template>
    <div id="mypage-info">
      <h2 class="page-title">마이페이지</h2>
      <div class="tab-menu">
        <span class="active-tab">회원정보</span>
        <span>이용권</span>
        <span>공지사항</span>
        <span>자주 묻는 질문</span>
      </div>
  
      <div class="info-container">
        <section class="info-section">
          <h3 class="info-title">기본 정보</h3>
          <div class="info-box">
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
          </div>
        </section>
  
        <section class="info-section">
          <h3 class="info-title">추가 정보</h3>
          <div class="info-box">
            <div class="info-item">
              <span class="info-label">성별</span>
              <span class="info-value">여성</span>
            </div>
            <div class="info-item">
              <span class="info-label">소속</span>
              <span class="info-value">고등교사</span>
            </div>
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
// 추후 API 연결 시 데이터 바인딩 가능
</script>

<style scoped>

</style>  