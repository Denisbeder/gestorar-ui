<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { useCustomerService } from '@/composable/useCustomerService.ts';
    import type { AxiosResponse } from 'axios';
    import { useRoute } from 'vue-router';
    import { displayError } from '@/utils.ts';

    const route = useRoute();
    const customerService = useCustomerService();

    const isLoading = ref<boolean>(false);
    const customers = ref<CustomerModelType[]>([]);
    const paginationLinks = ref([]);

    function loadCustomers(params?: Record<string, string | number>) {
        isLoading.value = true;

        customerService
            .index(params)
            .then(({ data }: AxiosResponse<PaginationType<CustomerModelType>>) => {
                paginationLinks.value = data.links.map((link) => {
                    let url = link.url;
                    let page = 1;

                    if (url) {
                        const urlInstance = new URL(url);
                        url = urlInstance.pathname + urlInstance.search;
                        page = urlInstance.searchParams.get('page');
                    }

                    return {
                        label: link.label,
                        url: url,
                        page: page,
                        active: link.active,
                    };
                });

                customers.value = data.data;

                const paramsInstance = new URLSearchParams(params);

                if (paramsInstance.size > 0) {
                    window.history.pushState({}, '', `?${paramsInstance.toString()}`);
                }
            })
            .catch((error) => displayError(error))
            .finally(() => (isLoading.value = false));
    }

    function goToPage(page: number) {
        loadCustomers({ page });
    }

    onMounted(() => {
        const params = { ...route.query };

        loadCustomers(params);
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

    <div class="paginantion">
        <button
            v-for="link in paginationLinks"
            :key="link.label"
            :style="{ backgroundColor: link.active ? '#ff0000' : 'unset' }"
            @click="goToPage(link.page)"
        >
            <span v-html="link.label"></span>
        </button>
    </div>
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

    .paginantion {
        margin-top: 1rem;
    }
</style>
