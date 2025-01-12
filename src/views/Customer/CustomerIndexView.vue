<script setup lang="ts">
    import { useCustomerService } from '@/composable/useCustomerService.ts';
    import PageContentComponent from '@/components/PageContentComponent.vue';
    import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
    import TableComponent from '@/components/Table/TableComponent.vue';
    import TableContentComponent from '@/views/Customer/components/TableContentComponent.vue';

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
        <div class="bg-white rounded-md px-6">
            <TableComponent
                v-slot="{ records }"
                :service="customerService"
            >
                <TableContentComponent :records="records?.data" />
            </TableComponent>
        </div>
    </PageContentComponent>
</template>
