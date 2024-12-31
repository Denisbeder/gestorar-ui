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

        return config;
    });

    return http;
}
