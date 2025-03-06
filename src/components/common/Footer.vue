<template>
    <footer class="footer">
        <div class="footer-content">
            Copyright © Chunjae Education, Inc. ALL rights reserved.
            <router-link to="/terms" class="footer-link" active-class="active">이용약관</router-link> |
            <router-link to="/privacy" class="footer-link" active-class="active">개인정보처리방침</router-link> |
            <a href="https://pf.kakao.com/_blqXxl" target="_blank" class="footer-link">고객센터</a>
        </div>
    </footer>
</template>

<style scoped>
.footer {
  width: calc(100% - 156px); /* 사이드바 제외한 너비 */
  height: 36px; /*푸터 높이 고정 */
  background-color: #F6F6F6; /* 디자인 색상 적용 */
  color: #666;
  text-align: center;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed; /* 화면 하단에 고정 */
  bottom: 0;
  left: 156px; /*사이드바 크기만큼 이동 */
  padding: 8px;
  gap: 8px;
}

.footer-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
}

.footer-link:hover {
  text-decoration: underline;
}

/* 현재 페이지일 경우 Bold 처리 */
.active {
  font-weight: bold;
}
</style>
