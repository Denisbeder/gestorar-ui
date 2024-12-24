import { createRouter, createWebHistory, type RouteLocationNormalized, type Router } from 'vue-router';
import { useAuth } from '@/composable/useAuth.ts';

declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth?: boolean;
        guest?: boolean;
    }
}

const router: Router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('../views/HomeView.vue'),
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/Auth/LoginView.vue'),
            meta: { guest: true },
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: () => import('../views/DashboardView.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/customers/create',
            name: 'CustomersCreate',
            component: () => import('../views/Customer/CreateView.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: import('../views/NotFoundView.vue'),
        },
    ],
});

router.beforeResolve(async (to: RouteLocationNormalized) => {
    const { isAuthenticated } = useAuth();

    const requiresAuth = to.meta.requiresAuth;
    const isGuestPage = to.meta.guest;
    const redirectToLogin = { name: 'Login', query: { redirect: to.fullPath } };
    const redirectToDashboard = { name: 'Dashboard' };

    if (isAuthenticated.value && isGuestPage) {
        return redirectToDashboard;
    }

    if (!isAuthenticated.value && requiresAuth) {
        return redirectToLogin;
    }
});

export default router;
