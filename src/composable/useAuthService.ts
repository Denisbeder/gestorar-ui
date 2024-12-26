import { computed, reactive } from 'vue';
import { useHTTP } from '@/composable/useHTTP.ts';
import type { AxiosError } from 'axios';

const state = reactive({
    user: null,
});

export function useAuthService() {
    const { http, displayError, errorHandle } = useHTTP();

    const user = computed(() => state.user);
    const isAuthenticated = computed(() => state.user !== null);

    async function getUser(): Promise<void> {
        try {
            const { data } = await http.get('/api/user');
            state.user = data;
        } catch (error) {
            state.user = null;

            errorHandle(error as AxiosError<AxiosErrorDataType>, true);
        }
    }

    async function login(credentials: CredentialsType): Promise<void> {
        try {
            await http.post('/login', credentials);
            await getUser();
        } catch (error) {
            displayError(error as AxiosError<AxiosErrorDataType>);
        }
    }

    async function logout(): Promise<void> {
        try {
            await http.post('/logout');
            state.user = null;
        } catch (error) {
            errorHandle(error as AxiosError<AxiosErrorDataType>);
        }
    }

    return { isAuthenticated, user, getUser, login, logout };
}
