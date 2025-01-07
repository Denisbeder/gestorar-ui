<script setup lang="ts">
    import { onBeforeUnmount, onMounted, ref } from 'vue';
    import { useCustomerService } from '@/composable/useCustomerService.ts';
    import type { AxiosResponse } from 'axios';
    import { useRoute } from 'vue-router';
    import { displayError } from '@/utils.ts';
    import PaginationComponent from '@/components/PaginationComponent.vue';
    import LoadingComponent from '@/components/LoadingComponent.vue';
    import PageContentComponent from '@/components/PageContentComponent.vue';
    import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
    import TableComponent from '@/views/Customer/components/TableComponent.vue';

    const route = useRoute();
    const customerService = useCustomerService();

    const loading = ref<boolean>(false);
    const deleteLoading = ref<boolean>(false);
    const customers = ref<PaginationDataType<CustomerModelType> | null>(null);
    const timeouts = ref<ReturnType<typeof setTimeout>[]>([]);

    function loadCustomers(params?: Record<string, string | number>, silent = false) {
        loading.value = !silent;

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

        removeTimeouts();

        deleteLoading.value = true;

        customerService
            .destroy(id)
            .then(() => {
                customers.value!.data = customers.value!.data.filter((customer) => customer.id !== id);

                timeouts.value.push(setTimeout(() => loadCustomers({ ...(route.query as object) }, true), 3000));
            })
            .catch((error) => displayError(error))
            .finally(() => (deleteLoading.value = false));
    }

    function onPageChange(page: number) {
        removeTimeouts();

        loadCustomers({ page });
    }

    function removeTimeouts() {
        timeouts.value.forEach((timeout) => clearTimeout(timeout));
    }

    onMounted(() => {
        const params = { ...(route.query as object) };

        loadCustomers(params);
    });

    onBeforeUnmount(() => {
        removeTimeouts();
    });
</script>

<template>
    <PageHeaderComponent title="Clientes">
        <template #rightCol>
            <button
                type="button"
                class="btn btn--white"
            >
                Filtrar
            </button>

            <button
                type="button"
                class="ml-3 btn btn--primary"
                @click="$router.push('/customers/create')"
            >
                Cadastrar novo
            </button>
        </template>
    </PageHeaderComponent>

    <PageContentComponent>
        <LoadingComponent :loading="loading">
            <div class="bg-white rounded px-6">
                <TableComponent
                    :records="customers?.data"
                    @on-delete="handleDelete"
                />

                <PaginationComponent
                    v-if="customers?.data"
                    class="-mx-6"
                    :total="customers?.total"
                    @on-change="onPageChange"
                />
            </div>
        </LoadingComponent>
    </PageContentComponent>
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
