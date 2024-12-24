<script setup lang="ts">
    import { RouterLink, RouterView, useRouter } from 'vue-router';
    import { useAuth } from '@/composable/useAuth.ts';

    const router = useRouter();
    const { isAuthenticated } = useAuth();

    async function handleLogout() {
        await useAuth().logout();
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
                <RouterLink to="/customers/create">Cadastrar Cliente</RouterLink>
                <button @click="handleLogout">Sair</button>
            </template>
        </nav>
    </header>

    <RouterView />
</template>

<style scoped>
    nav {
        display: flex;
        gap: 1rem;
    }
</style>
