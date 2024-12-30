<script setup lang="ts">
    import { RouterLink, RouterView, useRouter } from 'vue-router';
    import { useAuthService } from '@/composable/useAuthService.ts';

    const router = useRouter();
    const { isAuthenticated } = useAuthService();

    async function handleLogout() {
        await useAuthService().logout();
        await router.push({ name: 'Login' });
    }
</script>

<template>
    <header>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/dashboard">Dashboard</RouterLink>
            <RouterLink to="/login">Entrar</RouterLink>
            <template v-if="isAuthenticated">
                <RouterLink to="/customers">Clientes</RouterLink>
                <button @click="handleLogout">Sair</button>
            </template>
        </nav>
    </header>

    <router-view v-slot="{ Component, route }">
        <component
            :is="Component"
            :key="route.fullPath"
        />
    </router-view>
</template>

<style scoped>
    nav {
        display: flex;
        gap: 1rem;
    }
</style>
