<script setup lang="ts">
    import { reactive, ref } from 'vue';
    import { useAuthService } from '@/composable/useAuthService.ts';
    import { useRoute, useRouter } from 'vue-router';

    const authService = useAuthService();
    const router = useRouter();
    const route = useRoute();

    const loading = ref<boolean>(false);
    const form = reactive<CredentialsType>({ email: 'admin@email.com', password: 'password' });

    async function onSubmit() {
        loading.value = true;

        try {
            await authService.login(form);

            await router.push((route.query?.redirect ?? '/dashboard') as string);
        } finally {
            loading.value = false;
        }
    }
</script>

<template>
    <main>
        <form @submit.prevent="onSubmit">
            <input
                v-model="form.email"
                :disabled="loading"
                type="text"
                name="email"
                autocomplete="email"
            />
            <input
                v-model="form.password"
                :disabled="loading"
                type="password"
                name="password"
                autocomplete="current-password"
            />

            <button
                :disabled="loading"
                type="submit"
            >
                Enviar
            </button>
        </form>
    </main>
</template>
