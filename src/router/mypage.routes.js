import myPageWrapper from "@/components/mypage/MyPageWrapper.vue";
import myPageContent from "@/components/mypage/MyPageContent.vue";

const myPageRoutes = [
    {
      path: 'myPage',
      name: 'myPage',
      children: [
        { path: 'wrapper', name: 'my-page-wrapper', component: myPageWrapper },
        { path: 'content', name: 'my-page-content', component: myPageContent },
      ]
    }
  ];
  
  export default myPageRoutes;