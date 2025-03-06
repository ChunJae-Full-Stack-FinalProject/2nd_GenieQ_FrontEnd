import PassageContent from "@/components/generation/PassageContent.vue";
import PassageMain from "@/components/generation/PassageMain.vue";

// passage 라우트를 라우트 객체 배열로 정의
const generationRoutes = [
    {
      path: 'passage',
      name: 'passage',
      children: [
        { path: '', name: 'passage-main', component: PassageMain },
        { path: 'create', name: 'passage-create', component: PassageContent },
      ]
    }
  ];
  
  export default generationRoutes;