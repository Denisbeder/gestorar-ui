<script setup lang="ts">
import PageContentComponent from '@/components/PageContentComponent.vue';
import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
import TableComponent from '@/components/Table/TableComponent.vue';
import TableStackedListComponent from '@/components/TableStackedListComponent.vue';
import {useWorkOrderService} from "@/composable/useWorkOrderService.ts";

const workOrderService = useWorkOrderService();
</script>

<template>
  <PageHeaderComponent title="Ordem de Serviços">
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
        @click="$router.push('/work-orders/create')"
      >
        Cadastrar nova
      </button>
    </template>
  </PageHeaderComponent>

  <PageContentComponent>
    <div class="bg-white rounded-md px-6">
      <TableComponent
        v-slot="{ records }"
        :service="workOrderService"
      >
        <TableStackedListComponent :records="records?.data">
          <template v-slot="{ record }">
            <div class="flex items-start gap-x-3">
              <RouterLink
                :to="`/work-orders/${record.id}/edit`"
                class="text-sm/6 font-semibold text-gray-900 hover:text-primary"
              >
                {{ record.name }}
              </RouterLink>
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
