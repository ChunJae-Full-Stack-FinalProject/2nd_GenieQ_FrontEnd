<template>
  <div class="wrapper">
    <BaseButton text="저장하기" type="type1" id="save-button" width="248px" height="46px"/>

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
          <BaseButton text="비밀번호 변경" type="type3" id="pwd-change"width="125px" height="40px" />
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
          <select class="value value-box" id="user-type">
            <option value="elementary">초등교사</option>
            <option value="middle">중등교사</option>
            <option value="high">고등교사</option>
            <option value="academy">학원</option>
            <option value="company">기업</option>
            <option value="student">학생</option>
            <option value="parent">학부모</option>
            <option value="other">기타</option>
          </select>
        </div>
      </section>
    </div>

    <div class="account">
      <span class="withdrawal">회원 탈퇴</span>
      <span class="logout">로그아웃</span>
    </div>
  </div>
</template>
<script setup>
import BaseButton from '../common/button/BaseButton.vue';
</script>
<style scoped>
/* 전체 레이아웃 */
.wrapper {
  position: absolute;
  top: 0px;
  left: 0px;

  width: 1764px;
}
#save-button {
  position: absolute;
  top:24px;
  left: 1360px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 40px;

  position: absolute;
  width: 1472px;
  height: 384px;
  left: 136px;
  top: 94px;
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
  padding: 8px 20px;  /* 내부 여백 */

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

/* 기본 정보 박스 */
.basic {
  height: 194px;

  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
}

/* 추가 정보 박스 */
.additional {
  height: 150px;

  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
}

/* 타이틀 */
.title-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 8px;
  border-bottom: 1px solid #E1E1E1;

  width: 1432px;

  flex: none;
  order: 0;
  flex-grow: 0;
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
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 160px;

  width: 1432px;
  height: 40px;

  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
}

/* 라벨 및 값 스타일 */
.label {
display: flex;
flex-direction: row;
align-items: center;
padding: 8px;
gap: 8px;

width: 120px;
height: 40px;

font-family: 'Pretendard';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 150%;

letter-spacing: -0.02em;
color: #424242;
}
.value {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 8px;

  width: 360px;
  height: 40px;

  flex: none;
  order: 1;
  flex-grow: 0;
}
.value-box {
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;

  width: 360px;
  height: 40px;

  background: #FFFFFF; /* 배경색 */
  border: 1px solid #FF9F40; /* 테두리 */
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
#pwd-change {
  left: 1000px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;

  text-align: center;
  letter-spacing: -0.02em;

  color: #424242;

  position: absolute;
  left: 535px;
}

.withdrawal {
  color: #5F5F5F;
}
.logout {
  color: #FF9F40;
}
</style>
