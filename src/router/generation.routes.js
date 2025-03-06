import GenerationMain from "@/components/generation/passage/PassageMain.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // { path: '/passage', name: 'passage', component: GenerationMain }
    ]
});

export default router;