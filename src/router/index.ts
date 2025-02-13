import { createRouter, createWebHistory, type RouteLocationNormalized, type Router } from 'vue-router';
import { useAuthService } from '@/composable/useAuthService.ts';
import AppLayout from '@/layouts/AppLayout.vue';
import CustomerRoutes from './CustomerRoutes.ts';
import WorkOrderRoutes from './WorkOrderRoutes.ts';

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
            path: '/logout',
            name: 'Logout',
            component: () => import('../views/Auth/LoginView.vue'),
            meta: { guest: true },
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: () => import('../views/DashboardView.vue'),
            meta: { requiresAuth: true, layout: AppLayout },
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: import('../views/NotFoundView.vue'),
        },
        ...CustomerRoutes,
        ...WorkOrderRoutes,
    ],
});

router.beforeResolve(async (to: RouteLocationNormalized) => {
    const { isAuthenticated } = useAuthService();

    const requiresAuth = to.meta.requiresAuth;
    const isGuestPage = to.meta.guest;
    const redirectToLogin = { name: 'Login', query: { redirect: isGuestPage ? undefined : to.fullPath } };
    const redirectToDashboard = { name: 'Dashboard' };

    if (to.name === 'Logout') {
        await useAuthService().logout();

        return redirectToLogin;
    }

    if (isAuthenticated.value && isGuestPage) {
        return redirectToDashboard;
    }

    if (!isAuthenticated.value && requiresAuth) {
        return redirectToLogin;
    }
});

export default router;
