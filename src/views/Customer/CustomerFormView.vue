<script setup lang="ts">
    import { onMounted, ref, reactive } from 'vue';
    import { toast } from 'vue3-toastify';
    import { useCustomerService } from '@/composable/useCustomerService.ts';
    import { useRoute, useRouter } from 'vue-router';
    import type { AxiosResponse } from 'axios';
    import { displayError } from '@/utils.ts';
    import LoadingComponent from '@/components/LoadingComponent.vue';
    import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
    import PageContentComponent from '@/components/PageContentComponent.vue';
    import ArrowNarrowLeft from '@/components/Icons/ArrowNarrowLeft.vue';
    import LoaderIcon from '@/components/Icons/LoaderIcon.vue';
    import CustomerFormInputsComponent from '@/views/Customer/components/CustomerFormInputsComponent.vue';

    const route = useRoute();
    const router = useRouter();
    const customerService = useCustomerService();

    const loading = ref<boolean>(false);
    const submitting = ref<boolean>(false);
    const editMode = ref<boolean>(false);
    const form = reactive<CustomerFormType>({
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

    function setForm(data: CustomerModelType) {
        form.type = data.type;
        form.first_name = data.customerable.first_name;
        form.last_name = data.customerable.last_name;
        form.cpf = data.customerable.cpf;
        form.cnpj = data.customerable.cnpj;
        form.name = data.customerable.name;
        form.legal_name = data.customerable.legal_name;
        form.addresses = data.customerable.addresses;
        form.contacts = data.customerable.contacts;
    }

    async function sendForm(): void {
        toast.clearAll();

        let response: AxiosResponse<CustomerModelType>;

        if (editMode.value) {
            response = await customerService.update(Number(route.params.id), form);

            setForm(response.data);
        } else {
            response = await customerService.store(form);
        }

        await router.push({ name: 'CustomersEdit', params: { id: response.data.id } });

        toast.success('Cliente salvo');
    }

    async function onSubmit() {
        submitting.value = true;

        try {
            await sendForm();
        } catch (error) {
            displayError(error);
        } finally {
            submitting.value = false;
        }
    }

    function loadCustomer() {
        if (!route.params.id) {
            return;
        }

        editMode.value = true;
        loading.value = true;

        customerService
            .find(Number(route.params.id))
            .then(({ data }: AxiosResponse<CustomerModelType>) => setForm(data))
            .catch((error) => displayError(error))
            .finally(() => (loading.value = false));
    }

    onMounted(() => {
        loadCustomer();
    });
</script>

<template>
    <form @submit.prevent="onSubmit">
        <PageHeaderComponent :title="editMode ? 'Editar Cliente' : 'Cadastrar Cliente'">
            <template #rightCol>
                <RouterLink
                    to="/customers"
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
                <CustomerFormInputsComponent
                    v-model="form"
                    :submitting="submitting"
                    :edit-mode="editMode"
                />
            </LoadingComponent>
        </PageContentComponent>
    </form>
</template>
