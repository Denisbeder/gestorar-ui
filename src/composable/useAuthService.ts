import { computed, reactive } from 'vue';
import { useHTTP } from '@/composable/useHTTP.ts';
import type { AxiosError } from 'axios';
import { displayError } from '@/utils.ts';

const state = reactive({
    user: null,
});

export function useAuthService() {
    const http = useHTTP();

    const user = computed(() => state.user);
    const isAuthenticated = computed(() => state.user !== null);

    async function getUser(): Promise<void> {
        try {
            const { data } = await http.get('/api/user');
            state.user = data;
        } catch (error) {
            state.user = null;

            console.debug(error);
        }
    }

    async function login(credentials: CredentialsType): Promise<void> {
        try {
            await http.post('/login', credentials);
            await getUser();
        } catch (error) {
            displayError(error as AxiosError<AxiosErrorDataType>, { type: 'error', position: 'bottom-center' });
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
    function errorHandle(error: AxiosError<AxiosErrorDataType>): void {
        if (Object.hasOwn(error, 'status') && error.status! >= 400 && error.status! < 500) {
            displayError(error);
        }
    }

    return { isAuthenticated, user, getUser, login, logout };
}
