<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { useCustomerService } from '@/composable/useCustomerService.ts';
    import type { AxiosResponse } from 'axios';
    import { useRoute } from 'vue-router';
    import { displayError } from '@/utils.ts';
    import PaginationComponent from '@/components/PaginationComponent.vue';
    import LoadingComponent from '@/components/LoadingComponent.vue';

    const route = useRoute();
    const customerService = useCustomerService();

    const loading = ref<boolean>(false);
    const customers = ref<CustomerModelType[]>([]);
    const paginationLinks = ref<PaginationType['links']>([]);

    function loadCustomers(params?: Record<string, string | number>) {
        loading.value = true;

        customerService
            .index(params)
            .then(({ data }: AxiosResponse<PaginationType<CustomerModelType>>) => {
                paginationLinks.value = data.links;

                customers.value = data.data;
            })
            .catch((error) => displayError(error))
            .finally(() => (loading.value = false));
    }

    function onPageChange(page: number) {
        loadCustomers({ page });
    }

    onMounted(() => {
        const params = { ...(route.query as object) };

        loadCustomers(params);
    });
</script>

<template>
    <button @click="$router.push('/customers/create')">Cadastrar</button>

    <LoadingComponent :loading="loading">
        <ul class="list-wrapper">
            <li
                v-for="customer in customers"
                :key="customer.id"
            >
                <div class="list-item">
                    <div>{{ customer.name }}</div>
                    <div class="actions">
                        <button @click="$router.push(`/customers/${customer.id}/edit`)">Editar</button>
                        <button>Delete</button>
                    </div>
                </div>
            </li>
        </ul>

        <PaginationComponent
            :links="paginationLinks"
            @on-change="onPageChange"
        />
    </LoadingComponent>
</template>

<style lang="scss" scoped>
    .list-wrapper {
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .list-item {
            border: solid 1px #ccc;
            padding: 1rem;
            background-color: #fff;
            display: flex;

            .actions {
                margin-left: auto;
            }
        }
    }
</style>
