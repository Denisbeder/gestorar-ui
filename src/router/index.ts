import { createRouter, createWebHistory, type RouteLocationNormalized, type Router } from 'vue-router';
import { useUserStore } from '@/stores/user.ts';
import { useHTTPAuth } from '@/composable/useHTTPAuth.ts';

declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth: boolean;
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
            component: () => import('../views/LoginView.vue'),
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: () => import('../views/DashboardView.vue'),
            meta: { requiresAuth: true },
        },
    ],
});

router.beforeResolve(async (to: RouteLocationNormalized) => {
    const httpAuth = useHTTPAuth();
    const userStore = useUserStore();
    const guestPagesMap = ['Login'];
    const isGuestPage = guestPagesMap.includes(to.name as string);
    const requiresAuth = to.meta.requiresAuth;
    const redirectToLogin = { name: 'Login', query: { redirect: to.fullPath } };
    const redirectToDashboard = { name: 'Dashboard' };

    if (requiresAuth || isGuestPage) {
        if (userStore.isAuthenticated && isGuestPage) {
            return redirectToDashboard;
        }

        try {
            await httpAuth.getUser();

            if (userStore.isAuthenticated && isGuestPage) {
                return redirectToDashboard;
            }
        } catch {
            if (!userStore.isAuthenticated && requiresAuth) {
                return redirectToLogin;
            }
        }
    }
});

export default router;
