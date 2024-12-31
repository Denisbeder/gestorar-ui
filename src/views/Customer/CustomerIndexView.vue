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
    const customers = ref<PaginationDataType<CustomerModelType> | null>(null);

    function loadCustomers(params?: Record<string, string | number>) {
        loading.value = true;

        customerService
            .index(params)
            .then(({ data }: AxiosResponse<PaginationDataType<CustomerModelType>>) => {
                customers.value = data;
            })
            .catch((error) => displayError(error))
            .finally(() => (loading.value = false));
    }

    function handleDelete(id: number) {
        if (!confirm('Você deseja realmente deletar esse cliente?')) {
            return;
        }

        customerService
            .destroy(id)
            .then(() => {
                const params = { ...(route.query as object) };

                loadCustomers(params);
            })
            .catch((error) => displayError(error));
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
                v-for="customer in customers?.data"
                :key="customer.id"
            >
                <div class="list-item">
                    <div class="list-text">
                        <span>#{{ customer.id }}</span>
                        <span :class="customer.type">{{ customer.type }}</span>
                        {{ customer.name }}
                    </div>
                    <div class="actions">
                        <button @click="$router.push(`/customers/${customer.id}/edit`)">Editar</button>
                        <button @click="handleDelete(customer.id)">Delete</button>
                    </div>
                </div>
            </li>
        </ul>

        <PaginationComponent
            :links="customers?.links"
            :total="customers?.total"
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
            align-items: center;

            .list-text {
                display: flex;
                align-items: center;
                gap: 0.5rem;

                span {
                    background-color: #ddd;
                    padding: 0.15rem 0.25rem;
                    border-radius: 0.25rem;
                    text-transform: uppercase;
                    font-size: 10px;

                    &.cpf {
                        background-color: yellowgreen;
                        color: white;
                    }

                    &.cnpj {
                        background-color: darkslateblue;
                        color: white;
                    }
                }
            }

            .actions {
                margin-left: auto;
                display: flex;
                gap: 0.5rem;
            }
        }
    }
</style>
