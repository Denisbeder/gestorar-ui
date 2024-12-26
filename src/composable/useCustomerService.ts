import { useHTTP } from '@/composable/useHTTP.ts';
import type { AxiosResponse } from 'axios';

export function useCustomerService() {
    const { http } = useHTTP();

    function store(payload: CustomerFormType): Promise<AxiosResponse> {
        return http.post('/api/customers/store', payload);
    }

    return { store };
}
