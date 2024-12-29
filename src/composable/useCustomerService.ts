import { useHTTP } from '@/composable/useHTTP.ts';
import type { AxiosResponse } from 'axios';

export function useCustomerService() {
    const { http } = useHTTP();

    function store(payload: CustomerFormType): Promise<AxiosResponse> {
        return http.post('/api/customers', payload);
    }

    function update(id: number, payload: CustomerFormType): Promise<AxiosResponse> {
        return http.put(`/api/customers/${id}`, payload);
    }

    function find(id: number): Promise<AxiosResponse<CustomerModelType>> {
        return http.get(`/api/customers/${id}`);
    }

    return { store, update, find };
}
