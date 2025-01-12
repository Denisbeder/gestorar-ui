<script setup lang="ts">
    import { useCustomerService } from '@/composable/useCustomerService.ts';
    import PageContentComponent from '@/components/PageContentComponent.vue';
    import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
    import TableComponent from '@/components/Table/TableComponent.vue';
    import TableStackedListComponent from '@/components/TableStackedListComponent.vue';

    const customerService = useCustomerService();

    const CustomerTypes = {
      cpf: 'text-green-700 bg-green-50 ring-green-600/20',
      cnpj: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
    };
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
              <TableStackedListComponent :records="records?.data">
                <template v-slot="{ record }">
                  <div class="flex items-start gap-x-3">
                    <RouterLink
                      :to="`/customers/${record.id}/edit`"
                      class="text-sm/6 font-semibold text-gray-900 hover:text-primary"
                    >
                      {{ record.name }}
                    </RouterLink>
                    <p
                      :class="[
                        CustomerTypes[record.type],
                        'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset uppercase',
                      ]"
                    >
                      {{ record.type }}
                    </p>
                  </div>
                  <div class="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                    #{{ record.id }}
                    &bullet;
                    <p class="truncate">Criado por Denisbeder</p>
                    &bullet;
                    <p class="whitespace-nowrap">{{ record.document_id }}</p>
                  </div>
                </template>
              </TableStackedListComponent>
            </TableComponent>
        </div>
    </PageContentComponent>
</template>
