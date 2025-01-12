<script setup lang="ts">
    import { useCustomerService } from '@/composable/useCustomerService.ts';
    import PaginationComponent from '@/components/PaginationComponent.vue';
    import PageContentComponent from '@/components/PageContentComponent.vue';
    import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
    import TableComponent from '@/components/Table/TableComponent.vue';
    import TableContentComponent from '@/views/Customer/components/TableContentComponent.vue';
    import LoadingComponent from '@/components/LoadingComponent.vue';

    const customerService = useCustomerService();
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
        <div class="bg-white rounded px-6">
            <TableComponent
                v-slot="{ loading, records, pageChange }"
                :service="customerService"
            >
                <LoadingComponent :loading="loading">
                    <TableContentComponent :records="records?.data" />

                    <PaginationComponent
                        v-if="records?.total"
                        class="-mx-6"
                        :total="records?.total"
                        @on-change="pageChange"
                    />
                </LoadingComponent>
            </TableComponent>
        </div>
    </PageContentComponent>
</template>
