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

router.beforeEach(async (to, from) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    try {
      await userStore.getUser();
    } catch (error) {
      userStore.retryGetUser = false;

      return {
        name: 'Login',
        query: { redirect: to.fullPath },
      }
    }
  }

  if (to.name === 'Login' && userStore.isAuthenticated) {
    return false;
  }

  if (to.name === 'Login' && !userStore.isAuthenticated && userStore.retryGetUser) {
      try {
        await userStore.getUser();

        return {
          name: 'Dashboard'
        }
      } catch (error) {
        return;
      }
  }
})

export default router
