import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: () => import('../views/IndexView.vue')},
        { path: '/team', name: 'team', component: () => import('../views/TeamListView.vue')},
        { path: '/exam', name: 'exam', component: () => import('../views/ExamListView.vue')},
        { path: '/user', name: 'user', component: () => import('../views/UserView.vue')},
        { path: '/about', name: 'about', component: () => import('../views/AboutView.vue')},
        { path: '/question', name: 'question', component: () => import('../views/QuestionListView.vue')},
        { path: '/paper', name: 'paper', component: () => import('../views/PaperView.vue')},
        { path: '/admin/users', name: 'admin/users', component: () => import('../views/UserManagermentView.vue')},
        { path: '/:pathMatch(.*)*', name: 'noFound', component: () => import('../views/NoFoundVue.vue')}
    ]
})

export default router
