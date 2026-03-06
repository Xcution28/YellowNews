import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/news'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/pages/LoginPage.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/pages/RegisterPage.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/news',
            name: 'news-list',
            component: () => import('@/pages/NewsListPage.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/news/create',
            name: 'news-create',
            component: () => import('@/pages/NewsEditorPage.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/news/:id/edit',
            name: 'news-edit',
            component: () => import('@/pages/NewsEditorPage.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/news/preview/:id?',
            name: 'news-preview',
            component: () => import('@/pages/NewsPreviewPage.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

router.beforeEach((to, _from, next) => {
    const token = Cookies.get('token')
    const requiresAuth = to.meta.requiresAuth !== false

    if (requiresAuth && !token) {
        next('/login')
    } else if (!requiresAuth && token && (to.name === 'login' || to.name === 'register')) {
        next('/news')
    } else {
        next()
    }
})

export default router
