import PasswordSearch from "@/components/auth/PasswordSearch.vue";
import SingUpPage from "@/components/auth/SingUpPage.vue";
import TempPasswordNotice from "@/components/auth/TempPasswordNotice.vue";

 const authRoutes = [
  { path: '/signup', name: 'signup', component: SingUpPage },
   { path: '/passwordsearch', name: 'passwordsearch', component: PasswordSearch },
   { path: '/temppasswordnotice', name: 'temppasswordnotice', component: TempPasswordNotice },
 ];

export default authRoutes;