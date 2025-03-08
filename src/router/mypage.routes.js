import myPageWrapper from "@/components/mypage/MyPageWrapper.vue";
import Notice from "@/components/mypage/Notice.vue";
import NoticeDetail from "@/components/mypage/NoticeDetail.vue";


const myPageRoutes = [
    {
      path: 'mypage',
      name: 'mypage',
      children: [
        { path: '', name: 'my-page-wrapper', component: myPageWrapper },
        
      ]
    },
    {
      path: '/notice',
      name: 'Notice',
      component: Notice
    },
    { path: '/notice/:id', name: 'NoticeDetail', component: NoticeDetail},
  ];
  
  export default myPageRoutes;


 
 

  