import axios, { type AxiosInstance } from 'axios';

export function useHTTP() {
    const http: AxiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
        },
    });

    http.defaults.withCredentials = true;
    http.defaults.withXSRFToken = true;

    http.interceptors.request.use(async (config) => {
        if ((config.method as string).toLowerCase() !== 'get') {
            await http.get('sanctum/csrf-cookie');
        }

        return Promise.resolve(config);
    });

    http.interceptors.response.use(
        (config) => Promise.resolve(config),
        (error) => {
            if (error.response.status === 401 && error.response.config.url !== '/api/user') {
                window.location.reload();
                return;
            }

            return Promise.reject(error);
        },
    );

    return http;
}
