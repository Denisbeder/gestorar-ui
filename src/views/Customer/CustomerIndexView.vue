<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { useCustomerService } from '@/composable/useCustomerService.ts';
    import { useHTTP } from '@/composable/useHTTP.ts';
    import type { AxiosResponse } from 'axios';

    const customerService = useCustomerService();
    const { displayError } = useHTTP();

    const isLoading = ref<boolean>(false);
    const customers = ref<CustomerModelType[]>([]);

    function loadCustomers() {
        isLoading.value = true;

        customerService
            .index()
            .then(({ data }: AxiosResponse<PaginationType<CustomerModelType>>) => {
                console.log(data);
                customers.value = data.data;
            })
            .catch((error) => displayError(error))
            .finally(() => (isLoading.value = false));
    }

    onMounted(() => {
        loadCustomers();
    });
</script>

<template>
    <button @click="$router.push('/customers/create')">Cadastrar</button>
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
