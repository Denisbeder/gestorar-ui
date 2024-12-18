import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "@/stores/user.ts";
import { useCookies } from '@vueuse/integrations/useCookies';

const cookies = useCookies()

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
  const guestPagesMap = ['Login'];
  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = userStore.isAuthenticated;
  const hasXSRFToken = cookies.get('XSRF-TOKEN') !== undefined;
  const redirectToLogin = { name: 'Login', query: { redirect: to.fullPath } };
  const redirectToDashboard = { name: 'Dashboard' };

  if (requiresAuth && (!isAuthenticated || !hasXSRFToken)) {
    return redirectToLogin;
  }

  if (guestPagesMap.includes(to.name) && isAuthenticated && hasXSRFToken) {
    return redirectToDashboard;
  }

  if ((guestPagesMap.includes(to.name) && !isAuthenticated && hasXSRFToken) || (requiresAuth && !isAuthenticated && hasXSRFToken)) {
    return getUser(redirectToDashboard, redirectToLogin);
  }
});

async function getUser(redirectToOnSuccess, redirectToOnFail) {
  const userStore = useUserStore();

  try {
    await userStore.getUser();
  } catch {
    return redirectToOnFail;
  }

  return redirectToOnSuccess;
}

export default router
