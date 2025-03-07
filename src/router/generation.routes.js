import PassageContent from "@/components/generation/passage/PassageContent.vue";
import PassageMain from "@/components/generation/passage/PassageMain.vue";
import GenerateQuestion from "@/components/generation/question/GenerateQuestion.vue";
import QuestionMain from "@/components/generation/question/QuestionMain.vue";

// passage 라우트를 라우트 객체 배열로 정의
const generationRoutes = [
    {
      path: 'passage',
      name: 'passage',
      children: [
        { path: '', name: 'passage-main', component: PassageMain },
        { path: 'create', name: 'passage-create', component: PassageContent },
      ]
    },
    {
        path: 'questions',
        name: 'questions',
        children: [
            { path: '', name: 'question-main', component: QuestionMain },
            { path: 'generate', name: 'question-generate', component: GenerateQuestion },
        ]
    }
  ];
  
  export default generationRoutes;