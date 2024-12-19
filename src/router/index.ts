import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "@/stores/user.ts";

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean
  }
}

const router = createRouter({
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
})

router.beforeResolve(async (to, from) => {
  const userStore = useUserStore();
  const guestPagesMap = ['Login'];
  const isGuestPage = guestPagesMap.includes(to.name);
  const requiresAuth = to.meta.requiresAuth;
  const redirectToLogin = { name: 'Login', query: { redirect: to.fullPath } };
  const redirectToDashboard = { name: 'Dashboard' };

  if (requiresAuth || isGuestPage) {
    if (userStore.isAuthenticated && isGuestPage) {
      return redirectToDashboard;
    }

    try {
      await userStore.getUser();

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

export default router
