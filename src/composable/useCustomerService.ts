import { useHTTP } from '@/composable/useHTTP.ts';
import type { AxiosResponse } from 'axios';

type CustomerService = {
    store: (payload: CustomerFormType) => Promise<AxiosResponse<CustomerModelType>>;
    update: (id: number, payload: CustomerFormType) => Promise<AxiosResponse<CustomerModelType>>;
    find: (id: number) => Promise<AxiosResponse<CustomerModelType>>;
    destroy: (id: number) => Promise<AxiosResponse>;
    index: (params?: Record<string, string | number>) => Promise<AxiosResponse<PaginationDataType<CustomerModelType>>>;
};

export function useCustomerService(): CustomerService {
    const http = useHTTP();
    const basePath = '/api/customers';

    function store(
        payload: CustomerFormType,
        config?: Record<string, string | number>,
    ): Promise<AxiosResponse<CustomerModelType>> {
        return http.post(basePath, payload, config);
    }

    function update(
        id: number,
        payload: CustomerFormType,
        config?: Record<string, string | number>,
    ): Promise<AxiosResponse<CustomerModelType>> {
        return http.put(`${basePath}/${id}`, payload, config);
    }

    function find(id: number, config?: Record<string, string | number>): Promise<AxiosResponse<CustomerModelType>> {
        return http.get(`${basePath}/${id}`, config);
    }

    function destroy(id: number, config?: Record<string, string | number>): Promise<AxiosResponse> {
        return http.delete(`${basePath}/${id}`, config);
    }

    function index(
        params?: Record<string, string | number>,
        config?: Record<string, string | number>,
    ): Promise<AxiosResponse<PaginationDataType<CustomerModelType>>> {
        return http.get(basePath, { params, ...config });
    }

    return { store, update, find, destroy, index };
}
