<script setup lang="ts">
    import { onMounted, reactive, ref } from 'vue';
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
    import { RadioGroup, RadioGroupOption } from '@headlessui/vue';
    import XIcon from '@/components/Icons/XIcon.vue';
    import PlusIcon from '@/components/Icons/PlusIcon.vue';

    const CustomerTypes = {
      cpf: 'text-green-700 bg-green-50 ring-green-600/20',
      cnpj: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
    };

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

    function handleAddAddress() {
        form.addresses.push({
            type: 'home',
            zipcode: null,
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: '',
            complement: '',
        });
    }

    function handleRemoveAddress(index: number) {
        form.addresses.splice(index, 1);
    }

    function handleAddContact() {
        form.contacts.push({
            value: '',
            type: 'text',
        });
    }

    function handleRemoveContact(index: number) {
        form.contacts.splice(index, 1);
    }

    function updateContact(contact: ContactModelType) {
        const isPhone = /^(\+\d{1,3}\s?)?(\(?\d{2}\)?\s?)?\d{5}-?\d{4}$/.test(contact.value);
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.value);

        contact.type =
            isPhone ? 'phone'
            : isEmail ? 'email'
            : 'text';

        if (contact.type !== 'phone') {
            if (Object.hasOwn(contact.properties ?? {}, 'whatsapp')) {
                delete contact?.properties?.whatsapp;
            }

            if (Object.keys(contact.properties ?? {}).length === 0) {
                delete contact.properties;
            }

            return;
        }

        contact['properties'] = { whatsapp: false };
    }

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
        <PageHeaderComponent :title="editMode ? 'Editar cliente' : 'Cadastrar cliente'">
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
                    :disabled="submitting"
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
                <div class="flex flex-col gap-y-12">
                    <div class="card-container">
                        <div>
                            <h2 class="card-title">Tipo de cliente</h2>
                        </div>

                        <div v-if="editMode" class="rounded-md px-3 py-2 uppercase w-min" :class="CustomerTypes[form.type]">
                            {{ form.type }}
                        </div>

                        <RadioGroup
                            v-else
                            v-model="form.type"
                            class="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-6"
                            :disabled="submitting"
                        >
                            <RadioGroupOption
                                v-slot="{ active, checked, disabled }"
                                as="template"
                                value="cpf"
                            >
                                <div
                                    class="radio-group"
                                    :class="{
                                        'radio-group--active': active,
                                        'radio-group--checked': checked,
                                        'ring-inset': !active && !checked,
                                        'ring-2': active && checked,
                                        'is-disabled': disabled,
                                    }"
                                >
                                    CPF
                                </div>
                            </RadioGroupOption>

                            <RadioGroupOption
                                v-slot="{ active, checked, disabled }"
                                as="template"
                                value="cnpj"
                            >
                                <div
                                    class="radio-group"
                                    :class="{
                                        'radio-group--active': active,
                                        'radio-group--checked': checked,
                                        'ring-inset': !active && !checked,
                                        'ring-2': active && checked,
                                        'is-disabled border-red-500': disabled,
                                    }"
                                >
                                    CNPJ
                                </div>
                            </RadioGroupOption>
                        </RadioGroup>
                    </div>

                    <div
                        v-if="form.type === 'cpf'"
                        class="card-container"
                    >
                        <div>
                            <h2 class="card-title">Dados da Pessoa</h2>
                        </div>
                        <div class="card card--grid">
                            <div class="sm:col-span-3">
                                <label
                                    for="first-name"
                                    class="label"
                                    >Primeiro nome</label
                                >
                                <input
                                    id="first-name"
                                    v-model="form.first_name"
                                    type="text"
                                    name="first_name"
                                    autocomplete="off"
                                    class="form-input mt-2"
                                    :disabled="submitting"
                                />
                            </div>

                            <div class="sm:col-span-3">
                                <label
                                    for="last-name"
                                    class="label"
                                    >Sobrenome</label
                                >
                                <input
                                    id="last-name"
                                    v-model="form.last_name"
                                    type="text"
                                    name="last-name"
                                    autocomplete="off"
                                    class="form-input mt-2"
                                    :disabled="submitting"
                                />
                            </div>

                            <div class="sm:col-span-3">
                                <label
                                    for="cpf"
                                    class="label"
                                    >CPF</label
                                >
                                <input
                                    id="cpf"
                                    v-model="form.cpf"
                                    type="text"
                                    name="cpf"
                                    autocomplete="off"
                                    class="form-input mt-2"
                                    :disabled="submitting"
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="form.type === 'cnpj'"
                        class="card-container"
                    >
                        <div>
                            <h2 class="card-title">Dados da Empresa</h2>
                        </div>
                        <div class="card card--grid">
                            <div class="sm:col-span-3">
                                <label
                                    for="name"
                                    class="label"
                                    >Nome</label
                                >
                                <input
                                    id="name"
                                    v-model="form.name"
                                    type="text"
                                    name="name"
                                    autocomplete="off"
                                    class="form-input mt-2"
                                    :disabled="submitting"
                                />
                            </div>

                            <div class="sm:col-span-3">
                                <label
                                    for="legal-name"
                                    class="label"
                                    >Razão Social</label
                                >
                                <input
                                    id="legal-name"
                                    v-model="form.legal_name"
                                    type="text"
                                    name="legal-name"
                                    autocomplete="off"
                                    class="form-input mt-2"
                                    :disabled="submitting"
                                />
                            </div>

                            <div class="sm:col-span-3">
                                <label
                                    for="cnpj"
                                    class="label"
                                    >CNPJ</label
                                >
                                <input
                                    id="cnpj"
                                    v-model="form.cnpj"
                                    type="text"
                                    name="cnpj"
                                    autocomplete="off"
                                    class="form-input mt-2"
                                    :disabled="submitting"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="card-container">
                        <div>
                            <h2 class="card-title">Contatos</h2>
                        </div>
                        <div class="card flex flex-col gap-8">
                            <div
                                v-for="(contact, index) in form.contacts"
                                :key="`contact_${index}`"
                                class="relative grid grid-col-1 sm:grid-cols-6 gap-3 border bg-gray-50 p-4 rounded-md"
                            >
                                <div class="sm:col-span-2">
                                    <label
                                        for="contact-value"
                                        class="label"
                                    >
                                        Telefone ou E-mail
                                    </label>
                                    <input
                                        id="contact-value"
                                        v-model="contact.value"
                                        type="text"
                                        autocomplete="off"
                                        class="form-input mt-2"
                                        :name="`contact_value[${index}]`"
                                        :disabled="submitting"
                                        @keyup="updateContact(contact)"
                                    />
                                </div>

                                <div class="sm:col-span-3">
                                    <label
                                        for="contact-description"
                                        class="label"
                                    >
                                        Descrição
                                    </label>
                                    <input
                                        id="contact-description"
                                        v-model="contact.description"
                                        type="text"
                                        autocomplete="off"
                                        class="form-input mt-2"
                                        :name="`contact_description[${index}]`"
                                        :disabled="submitting"
                                    />
                                </div>

                                <div
                                    v-if="contact?.properties?.whatsapp !== undefined"
                                    class="sm:col-span-1 flex items-center"
                                >
                                    <div class="flex items-center gap-2">
                                        <label
                                            :for="`contact_whatsapp[${index}]`"
                                            class="label"
                                        >
                                            Tem WhatsApp
                                        </label>
                                        <input
                                            :id="`contact_whatsapp[${index}]`"
                                            type="checkbox"
                                            autocomplete="off"
                                            class="form-checkbox"
                                            :name="`contact_whatsapp[${index}]`"
                                            :disabled="submitting"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    title="Remover contato"
                                    class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 btn btn--square btn--white btn--sm"
                                    :disabled="submitting"
                                    @click="handleRemoveContact(index)"
                                >
                                    <XIcon class="size-8" />
                                </button>
                            </div>

                            <button
                                type="button"
                                class="btn btn--primary"
                                :disabled="submitting"
                                @click="handleAddContact"
                            >
                                <PlusIcon class="size-4" /> Add Contato
                            </button>
                        </div>
                    </div>

                    <div class="card-container">
                        <div>
                            <h2 class="card-title">Endereços</h2>
                        </div>
                        <div class="card flex flex-col gap-8">
                            <div
                                v-for="(address, index) in form.addresses"
                                :key="`contact_${index}`"
                                class="relative grid grid-col-1 sm:grid-cols-6 gap-3 border bg-gray-50 p-4 rounded-md"
                            >
                                <div class="sm:col-span-1">
                                    <label
                                        for="address-zipcode"
                                        class="label"
                                    >
                                        CEP
                                    </label>
                                    <input
                                        id="address-zipcode"
                                        v-model="address.zipcode"
                                        type="text"
                                        autocomplete="off"
                                        class="form-input mt-2"
                                        :name="`address_zipcode[${index}]`"
                                        :disabled="submitting"
                                    />
                                </div>

                                <div class="sm:col-span-4">
                                    <label
                                        for="address-street"
                                        class="label"
                                    >
                                        Rua
                                    </label>
                                    <input
                                        id="address-street"
                                        v-model="address.street"
                                        type="text"
                                        autocomplete="off"
                                        class="form-input mt-2"
                                        :name="`address_street[${index}]`"
                                        :disabled="submitting"
                                    />
                                </div>

                                <div class="sm:col-span-1">
                                    <label
                                        for="address-number"
                                        class="label"
                                    >
                                        Número
                                    </label>
                                    <input
                                        id="address-number"
                                        v-model="address.number"
                                        type="text"
                                        autocomplete="off"
                                        class="form-input mt-2"
                                        :name="`address_number[${index}]`"
                                        :disabled="submitting"
                                    />
                                </div>

                                <div class="sm:col-span-2">
                                    <label
                                        for="address-neighborhood"
                                        class="label"
                                    >
                                        Bairro
                                    </label>
                                    <input
                                        id="address-neighborhood"
                                        v-model="address.neighborhood"
                                        type="text"
                                        autocomplete="off"
                                        class="form-input mt-2"
                                        :name="`address_neighborhood[${index}]`"
                                        :disabled="submitting"
                                    />
                                </div>

                                <div class="sm:col-span-2">
                                    <label
                                        for="address-city"
                                        class="label"
                                    >
                                        Cidade
                                    </label>
                                    <input
                                        id="address-city"
                                        v-model="address.city"
                                        type="text"
                                        autocomplete="off"
                                        class="form-input mt-2"
                                        :name="`address_city[${index}]`"
                                        :disabled="submitting"
                                    />
                                </div>

                                <div class="sm:col-span-1">
                                    <label
                                        for="address-state"
                                        class="label"
                                    >
                                        Estado
                                    </label>
                                    <input
                                        id="address-state"
                                        v-model="address.state"
                                        type="text"
                                        autocomplete="off"
                                        class="form-input mt-2"
                                        :name="`address_state[${index}]`"
                                        :disabled="submitting"
                                    />
                                </div>

                                <div class="sm:col-span-1">
                                    <label
                                        for="address-complement"
                                        class="label"
                                    >
                                        Complemento
                                    </label>
                                    <input
                                        id="address-complement"
                                        v-model="address.complement"
                                        type="text"
                                        autocomplete="off"
                                        class="form-input mt-2"
                                        :name="`address_complement[${index}]`"
                                        :disabled="submitting"
                                    />
                                </div>

                                <div class="sm:col-span-full">
                                    <label class="label">Tipo de endereço</label>
                                    <div class="flex gap-4 items-center mt-2">
                                        <label class="text-sm flex items-center gap-2">
                                            <input
                                                v-model="address.type"
                                                type="radio"
                                                value="home"
                                                :name="`address_type[${index}]`"
                                                :disabled="submitting"
                                            />
                                            Casa
                                        </label>

                                        <label class="text-sm flex items-center gap-2">
                                            <input
                                                v-model="address.type"
                                                type="radio"
                                                value="commercial"
                                                :name="`address_type[${index}]`"
                                                :disabled="submitting"
                                            />
                                            Comercial
                                        </label>

                                        <label class="text-sm flex items-center gap-2">
                                            <input
                                                v-model="address.type"
                                                type="radio"
                                                value="billing"
                                                :name="`address_type[${index}]`"
                                                :disabled="submitting"
                                            />
                                            Cobrança
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    title="Remover contato"
                                    class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 btn btn--square btn--white btn--sm"
                                    @click="handleRemoveAddress(index)"
                                >
                                    <XIcon class="size-8" />
                                </button>
                            </div>

                            <button
                                type="button"
                                class="btn btn--primary"
                                :disabled="submitting"
                                @click="handleAddAddress"
                            >
                                <PlusIcon class="size-4" /> Add Endereço
                            </button>
                        </div>
                    </div>
                </div>
            </LoadingComponent>
        </PageContentComponent>
    </form>
</template>

<style lang="scss" scoped>
    .card-container {
        @apply grid grid-cols-1 sm:grid-cols-[300px_1fr] gap-y-4;
    }

    .card {
        @apply -mx-4 sm:mx-0 px-4 py-6 sm:p-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl;

        &--grid {
            @apply grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6;
        }
    }

    .card-title {
        @apply text-base/7 font-semibold text-gray-900;
    }
</style>
