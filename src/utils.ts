import type { AxiosError } from 'axios';
import { toast, type ToastOptions, type ToastType } from 'vue3-toastify';

export function displayError(
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
