import { useHTTP } from '@/composable/useHTTP.ts';
import { useUserStore } from '@/stores/user.ts';
import { useRouter, useRoute } from 'vue-router';

export function useHTTPAuth() {
    const { http, displayError, errorHandle } = useHTTP();
    const userStore = useUserStore();
    const router = useRouter(); // it is undefined
    const route = useRoute(); // it is undefined

    async function getUser(): Promise<void> {
        try {
            userStore.user = await http.get('/api/user');
        } catch (error: AxiosError) {
            userStore.user = null;

            errorHandle(error, true);
        }
    }

    async function login(credentials: CredentialsType): Promise<void> {
        try {
            await http.post('/login', credentials);
            await getUser();
            await router.push((route.query?.redirect ?? 'dashboard') as string);
        } catch (error: AxiosError) {
            displayError(error);
        }
    }

    async function logout() {}

    return { getUser, login, logout };
}
