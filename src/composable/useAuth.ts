import { computed, reactive } from 'vue';
import { useHTTP } from '@/composable/useHTTP.ts';
import { useRouter, useRoute } from 'vue-router';

const state = reactive({
    user: null,
});

export function useAuth() {
    const { http, displayError, errorHandle } = useHTTP();

    const user = computed(() => state.user);
    const isAuthenticated = computed(() => state.user !== null);

    async function getUser(): Promise<void> {
        try {
            const { data } = await http.get('/api/user');
            state.user = data;
        } catch (error: AxiosError) {
            state.user = null;

            errorHandle(error, true);
        }
    }

    async function login(credentials: CredentialsType): Promise<void> {
        try {
            await http.post('/login', credentials);
            await getUser();
        } catch (error: AxiosError) {
            displayError(error);
        }
    }

    async function logout() {
        try {
            await http.post('/logout');
            state.user = null;
        } catch (error: AxiosError) {
            errorHandle(error);
        }
    }

    return { isAuthenticated, user, getUser, login, logout };
}
