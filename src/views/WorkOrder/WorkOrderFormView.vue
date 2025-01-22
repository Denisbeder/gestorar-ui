<script setup lang="ts">
    import PageContentComponent from '@/components/PageContentComponent.vue';
    import LoadingComponent from '@/components/LoadingComponent.vue';
    import ArrowNarrowLeft from '@/components/Icons/ArrowNarrowLeft.vue';
    import LoaderIcon from '@/components/Icons/LoaderIcon.vue';
    import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
    import { useCustomerService } from '@/composable/useCustomerService.ts';
    import { onMounted, reactive, ref } from 'vue';
    import PlusIcon from '@/components/Icons/PlusIcon.vue';
    import SelectCombo from '@/components/SelectCombo.vue';
    import DialogComponent from '@/components/Dialog/DialogComponent.vue';
    import CustomerFormInputsComponent from '@/views/Customer/components/CustomerFormInputsComponent.vue';
    import DialogContentComponent from '@/components/Dialog/DialogContentComponent.vue';

    type WorkOrderFormType = {
        customer_id: number | null;
    };

    const customerService = useCustomerService();

    const openCustomerDialog = ref<boolean>(false);
    const customers = ref([]);
    const customerForm = reactive<CustomerFormType>({
        type: 'cpf',
        first_name: '',
        last_name: '',
        cpf: null,
        cnpj: null,
        name: '',
        legal_name: '',
        addresses: [],
        contacts: [],
    });

    const loading = ref<boolean>(false);
    const submitting = ref<boolean>(false);
    const editMode = ref<boolean>(false);
    const form = reactive<WorkOrderFormType>({
        customer_id: null,
    });

    function loadCustomers() {
        loading.value = true;
        customerService
            .index()
            .then((response: AxiosResponse) => {
                customers.value = response.data?.data ?? [];
            })
            .finally(() => {
                loading.value = false;
            });
    }

    onMounted(() => {
        loadCustomers();
    });
</script>

<template>
    <form @submit.prevent="onSubmit">
        <PageHeaderComponent :title="editMode ? 'Editar Ordem de Serviço' : 'Cadastrar Ordem de Serviço'">
            <template #rightCol>
                <RouterLink
                    to="/work-orders"
                    class="btn btn--white"
                >
                    <ArrowNarrowLeft class="size-5" />
                    Voltar
                </RouterLink>

                <button
                    type="submit"
                    class="ml-3 btn btn--primary"
                    :disabled="submitting || loading"
                >
                    <LoaderIcon
                        v-if="submitting"
                        class="size-5"
                    />
                    Salvar
                </button>
            </template>
        </PageHeaderComponent>

        <PageContentComponent>
            <LoadingComponent :loading="loading">
                <div class="form-card-container">
                    <div>
                        <h2 class="form-card-title">Cliente</h2>
                    </div>
                    <div class="form-card flex flex-col gap-6">
                        <div class="form-card--grid">
                            <div class="sm:col-span-3">
                                <SelectCombo
                                    v-model="form.customer_id"
                                    :options="customers"
                                />
                            </div>

                            <button
                                type="button"
                                class="btn btn--white"
                                title="Cadastrar novo cliente"
                                @click="openCustomerDialog = true"
                            >
                                <PlusIcon class="size-5" />
                                Novo Cliente
                            </button>
                        </div>

                        <div class="relative grid grid-cols-[100px_1fr] gap-3 border bg-gray-50 p-4 rounded-md">
                            <div class="label">Nome</div>
                            <div>Denisbeder Duek Carvalho</div>

                            <div class="label">CPF</div>
                            <div>024.852.511-50</div>

                            <div class="label">Telefone</div>
                            <div>(67) 99694-8065 <small>(Whatsapp)</small></div>

                            <div class="label">E-mail</div>
                            <div>denisbeder@gmail.com</div>

                            <div class="label">Endereço</div>
                            <div>Rua Clovis Cersozimo de Souza, 5620, 79831-383, Jardim Piratininga, Dourados-MS</div>
                        </div>
                    </div>
                </div>
            </LoadingComponent>
        </PageContentComponent>
    </form>

    <DialogComponent
        v-model="openCustomerDialog"
        title="Cadastrar novo cliente"
        size="5xl"
    >
        <DialogContentComponent
            class="bg-gray-50"
            :border-top="true"
        >
            <CustomerFormInputsComponent
                v-model="customerForm"
                :submitting="submitting"
                :edit-mode="false"
            />
        </DialogContentComponent>

        <template #footer>
            <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 px-4 sm:px-6 sm:flex sm:flex-row-reverse border-t -mx-4 sm:-mx-6">
                <button
                    type="button"
                    class="w-full sm:ml-3 sm:w-auto btn btn--primary"
                    @click="openCustomerDialog = true"
                >
                    Salvar
                </button>
                <button
                    type="button"
                    class="mt-3 w-full sm:mt-0 sm:w-auto btn btn--white"
                    @click="openCustomerDialog = false"
                >
                    Cancelar
                </button>
            </div>
        </template>
    </DialogComponent>
</template>
