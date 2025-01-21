import { useHTTP } from '@/composable/useHTTP.ts';
import type { AxiosResponse } from 'axios';

export function useWorkOrderService() {
    const http = useHTTP();
    const basePath = '/api/work-orders';

    function store(payload: CustomerFormType): Promise<AxiosResponse<CustomerModelType>> {
        return http.post(basePath, payload);
    }

    function update(id: number, payload: CustomerFormType): Promise<AxiosResponse<CustomerModelType>> {
        return http.put(`${basePath}/${id}`, payload);
    }

    function find(id: number): Promise<AxiosResponse<CustomerModelType>> {
        return http.get(`${basePath}/${id}`);
    }

    function destroy(id: number): Promise<AxiosResponse> {
        return http.delete(`${basePath}/${id}`);
    }

    function index(
        params?: Record<string, string | number>,
    ): Promise<AxiosResponse<PaginationDataType<CustomerModelType>>> {
        return http.get(basePath, { params });
    }

    return { store, update, find, destroy, index };
}
