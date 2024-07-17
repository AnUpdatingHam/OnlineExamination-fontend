import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: () => import('../views/IndexView.vue')},
        { path: '/user/team', name: 'teamList', component: () => import('../views/TeamListView.vue')},
        { path: '/user/exam', name: 'examList', component: () => import('../views/ExamListView.vue')},
        { path: '/user/user', name: 'userHome', component: () => import('../views/UserView.vue')},
        { path: '/user/question', name: 'question', component: () => import('../views/QuestionListView.vue')},

        { path: '/admin/team', name: 'teamManagement', component: () => import('../views/TeamManagementView.vue')},
        { path: '/admin/exam', name: 'examManagement', component: () => import('../views/ExamManagementView.vue')},
        { path: '/admin/examQestion', name: 'examQestion', component: () => import('../views/ExamQuestionManagementView.vue')},
        { path: '/admin/user', name: 'userManagement', component: () => import('../views/UserManagementView.vue')},
        { path: '/admin/question', name: 'questionManagement', component: () => import('../views/QuestionManagementView.vue')},
        { path: '/admin/examScoreList', name: 'examScoreList', component: () => import('../views/ExamScoreListView.vue')},
        { path: '/admin/major', name: 'majorManagement', component: () => import('../views/MajorManagementView.vue')},
        { path: '/:pathMatch(.*)*', name: 'noFound', component: () => import('../views/NoFoundVue.vue')}
    ]
})

export default router
