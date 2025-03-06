import myPageWrapper from "@/components/mypage/MyPageWrapper.vue";
import myPageContent from "@/components/mypage/MyPageContent.vue";

const myPageRoutes = [
    {
      path: 'mypage',
      name: 'mypage',
      children: [
        { path: '', name: 'my-page-wrapper', component: myPageWrapper },
        { path: '', name: 'my-page-content', component: myPageContent },
      ]
    }
  ];
  
  export default myPageRoutes;