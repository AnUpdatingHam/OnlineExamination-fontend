import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: () => import('../views/PaperView.vue')},
        { path: '/index', name: 'index', component: () => import('../components/TheWelcome.vue')},
        { path: '/about', name: 'about', component: () => import('../views/AboutView.vue')},
        { path: '/paper', name: 'paper', component: () => import('../views/PaperView.vue')},
        { path: '/history', name: 'history', component: () => import('../views/HistoryView.vue')},
        { path: '/:pathMatch(.*)*', name: 'noFound', component: () => import('../views/NoFoundVue.vue')}
    ]
})

export default router
