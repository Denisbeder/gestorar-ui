import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { toast, type ToastOptions, type ToastType } from 'vue3-toastify';

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

export function useHTTP() {
    function displayError(
        payload: string | AxiosError<AxiosErrorDataType>,
        options: ToastType | ToastOptions = 'error',
    ) {
        const toastConfig: ToastOptions = typeof options === 'string' ? { type: options } : options;

        if (typeof payload === 'string') {
            toast(payload, toastConfig as ToastOptions);
            return;
        }

        const payloadData = payload.response?.data;
        let msg = payloadData?.message ?? payload.message;

        if (payloadData?.errors) {
            msg = Object.values(payloadData.errors).flat().join('\n');
        }

        toast(msg, toastConfig as ToastOptions);
    }

    function errorHandle(error: AxiosError<AxiosErrorDataType>, silent = false) {
        if (Object.hasOwn(error, 'status') && error.status < 400) {
            return;
        }

        if (Object.hasOwn(error, 'status') && error.status >= 400 && error.status < 500 && silent === false) {
            displayError(error);
        }

        //console.debug(error);

        throw error;
    }

    return { http, displayError, errorHandle };
}
