<template>
  <div class="wrapper">
    <div class="button">
      <div class="button-type1">저장하기</div>
    </div>

    <div class="content">
      <!-- 기본 정보 -->
      <section class="basic">
        <div class="title-container">
          <span class="title">기본 정보</span>
        </div>
        <div class="item">
          <span class="label">이름</span>
          <span class="value value-box">송겨울</span>
        </div>
        <div class="item">
          <span class="label">이메일</span>
          <span class="value">songwinter@naver.com</span>
        </div>
        <div class="item">
          <span class="label">비밀번호</span>
          <span class="value">****</span>
        </div>
      </section>

      <!-- 추가 정보 -->
      <section class="additional">
        <div class="title-container">
          <span class="title">추가 정보</span>
        </div>
        <div class="item">
          <span class="label">성별</span>
          <span class="value">여성</span>
        </div>
        <div class="item">
          <span class="label">소속</span>
          <span class="value value-box">고등교사</span>
        </div>
      </section>
    </div>

    <div class="account">
      <span class="withdrawal">회원 탈퇴</span>
      <span class="logout">로그아웃</span>
    </div>
  </div>
</template>

<style scoped>
/* 전체 레이아웃 */
.wrapper {
  width: 100%; 
  max-width: 1764px; 
  height: 700px;
  margin: 0 auto;
}

/* 버튼 */
.button {
  width: 1764px;
  height: 46px;
}
.button-type1 {
  width: 248px;
  height: 46px;
}

.content {
  width: 1472px;
  height: auto; 
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 80px;
  padding-top: 50px;
  position: relative; 
  
}

.content::after {
  content: ""; 
  display: block;
  width: 100%;
  height: 1px;
  background-color: #BDBDBD;
  position: absolute;
  bottom: -60px; 
  left: 150px; 
}


/* 기본 정보, 추가 정보 공통 박스 스타일 */
.basic, .additional {
  width: 1472px;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 20px;  /* 내부 여백 */
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 150px;
}

/* 기본 정보 박스 */
.basic {
  height: 194px;
}

/* 추가 정보 박스 */
.additional {
  height: 150px;
  margin-top: 25px;
}

/* 타이틀 */
.title-container {
  display: flex;
  align-items: center;
  width: 100%;
}
.title {
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: -2%;
  color: #FF9F40;
}

/* 기본 정보, 추가 정보 내용 스타일 */
.item {
  width: 100%;
  display: flex;
  justify-content: flex-start; /* 왼쪽 정렬 */
  gap: 20px; 

  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: -2%;
}

/* 라벨 및 값 스타일 */
.label {
  width: 120px;
  color: #424242;
}
.value-box {
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;

  width: 360px;
  height: 40px;

  background: #FFFFFF; /* 배경색 */
  border: 1px solid #BDBDBD; /* 테두리 */
  border-radius: 8px; /* 모서리 둥글게 */

  flex: none;
  order: 1;
  flex-grow: 0;
  
  color: #303030;
}

.account {
  width: 240px;
  height: 40px;
  display: flex;
  gap: 70px;
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: -2%;
  margin-left: auto;
  margin-right: 110px; 
  margin-top: 90px;
}

.withdrawal {
  color: #5F5F5F;
}
.logout {
  color: #FF9F40;
}
</style>
