import PasswordSearch from "@/components/auth/PasswordSearch.vue";
import SingUpPage from "@/components/auth/SingUpPage.vue";


//라우터 객체를 만드는 것이 아니라 라우트 정의를 내보냅니다
// const authRoutes = {
//     // path: 'auth',
//     // name: 'auth',
//     routes: [
//       { path: 'signup', name: 'signup', component: SingUpPage },
//       { path: 'password-search', name: 'passwordsearch', component: PasswordSearch },
//     ]
//   };


 const authRoutes = [
  { path: '/singup', name: 'singup', component: SingUpPage },
   { path: '/passwordsearch', name: 'passwordsearch', component: PasswordSearch },
 ];


export default authRoutes;