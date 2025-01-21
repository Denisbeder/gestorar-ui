<script setup lang="ts">
    import PageContentComponent from '@/components/PageContentComponent.vue';
    import LoadingComponent from '@/components/LoadingComponent.vue';
    import ArrowNarrowLeft from '@/components/Icons/ArrowNarrowLeft.vue';
    import LoaderIcon from '@/components/Icons/LoaderIcon.vue';
    import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useCustomerService } from '@/composable/useCustomerService.ts';
    import { reactive, ref, computed } from 'vue';
    import {
        Combobox,
        ComboboxButton,
        ComboboxInput,
        ComboboxOption,
        ComboboxOptions,
        TransitionRoot,
    } from '@headlessui/vue';
    import CheckIcon from '@/components/Icons/CheckIcon.vue';
    import SelectorIcon from '@/components/Icons/SelectorIcon.vue';
    import PlusIcon from '@/components/Icons/PlusIcon.vue';
    import SelectCombo from '@/components/SelectCombo.vue';

    type WorkOrderFormType = {
        customer_id: number | null;
    };

    const route = useRoute();
    const router = useRouter();
    const customerService = useCustomerService();

    const customerList = [
        { id: 1, name: 'Wade Cooper' },
        { id: 2, name: 'Arlene Mccoy' },
        { id: 3, name: 'Devon Webb' },
        { id: 4, name: 'Tom Cook' },
        { id: 5, name: 'Tanya Fox' },
        { id: 6, name: 'Hellen Schmidt' },
    ];

    const loading = ref<boolean>(false);
    const submitting = ref<boolean>(false);
    const editMode = ref<boolean>(false);
    const form = reactive<WorkOrderFormType>({
        customer_id: customerList[3],
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
                                    :options="customerList"
                                />
                            </div>

                            <button
                                type="button"
                                class="btn btn--white"
                                title="Cadastrar novo cliente"
                            >
                                <PlusIcon class="size-5" />
                                Novo Cliente
                            </button>
                        </div>

                        <div class="relative grid grid-cols-[100px_1fr] gap-3 border bg-gray-50 p-4 rounded-md">
                            <div class="label">Nome</div>
                            <div>Denisbeder</div>
                            <div class="label">Nome</div>
                            <div>Denisbeder</div>
                        </div>
                    </div>
                </div>
            </LoadingComponent>
        </PageContentComponent>
    </form>
</template>
