<script setup lang="ts">
    import { reactive, ref } from 'vue';
    import { useHTTPAuth } from '@/composable/useHTTPAuth.ts';

    const httpAuth = useHTTPAuth();

    const isLoading = ref<boolean>(false);
    const form = reactive<CredentialsType>({ email: 'admin@email.com', password: 'password' });

    async function handleSubmit() {
        isLoading.value = true;

        try {
            await httpAuth.login(form);
        } finally {
            isLoading.value = false;
        }
    }
</script>

<template>
    <main>
        <form @submit.prevent="handleSubmit">
            <input
                v-model="form.email"
                :disabled="isLoading"
                type="text"
                name="email"
                autocomplete="email"
            />
            <input
                v-model="form.password"
                :disabled="isLoading"
                type="password"
                name="password"
                autocomplete="current-password"
            />

            <button
                :disabled="isLoading"
                type="submit"
            >
                Enviar
            </button>
        </form>
    </main>
</template>
