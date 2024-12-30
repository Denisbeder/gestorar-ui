import { useHTTP } from '@/composable/useHTTP.ts';
import type { AxiosResponse } from 'axios';

export function useCustomerService() {
    const { http } = useHTTP();

    function store(payload: CustomerFormType): Promise<AxiosResponse<CustomerModelType>> {
        return http.post('/api/customers', payload);
    }

    function update(id: number, payload: CustomerFormType): Promise<AxiosResponse<CustomerModelType>> {
        return http.put(`/api/customers/${id}`, payload);
    }

    function find(id: number): Promise<AxiosResponse<CustomerModelType>> {
        return http.get(`/api/customers/${id}`);
    }

    function destroy(id: number): Promise<AxiosResponse> {
        return http.delete(`/api/customers/${id}`);
    }

    function index(): Promise<AxiosResponse<PaginationType<CustomerModelType>>> {
        return http.get('/api/customers');
    }

    return { store, update, find, destroy, index };
}
