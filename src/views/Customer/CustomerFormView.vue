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

    const ADDRESS_TAG_ENUM = {
        home: 'Casa',
        commercial: 'Comercial',
        billing: 'Cobrança',
    };

    const route = useRoute();
    const router = useRouter();
    const customerService = useCustomerService();

    const loading = ref<boolean>(false);
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

    function onSubmit() {
        loading.value = true;

        toast.clearAll();

        const promise = new Promise((resolve, reject) => {
            if (editMode.value) {
                customerService
                    .update(Number(route.params.id), form)
                    .then((response: AxiosResponse<CustomerModelType>) => {
                        setForm(response.data);
                        resolve(response);
                    })
                    .catch((error) => reject(error));

                return;
            }

            customerService
                .store(form)
                .then(async (response) => {
                    await router.push({ name: 'CustomersEdit', params: { id: response.data.id } });
                    resolve(response);
                })
                .catch((error) => reject(error));
        });

        promise
            .then(() => toast.success('Cliente salvo'))
            .catch((error) => displayError(error))
            .finally(() => (loading.value = false));
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
                    @click="$router.push('/customers/create')"
                >
                    <LoaderIcon
                        v-if="loading"
                        class="size-5"
                    />
                    Salvar
                </button>
            </template>
        </PageHeaderComponent>

        <PageContentComponent>
            <LoadingComponent :loading="loading">
                <div class="flex flex-col gap-8">
                    <div class="card-container">
                        <div>
                            <h2 class="card-title">Tipo de cliente</h2>
                        </div>

                        <RadioGroup
                            v-model="form.type"
                            class="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-6"
                        >
                            <RadioGroupOption
                                v-slot="{ active, checked }"
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
                                    }"
                                >
                                    CPF
                                </div>
                            </RadioGroupOption>

                            <RadioGroupOption
                                v-slot="{ active, checked }"
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
                        <div class="card">
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
                        <div class="card">
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
                                />
                            </div>
                        </div>
                    </div>

                    <div class="card-container">
                        <div>
                            <h2 class="card-title">Contatos</h2>
                        </div>
                        <div class="card">conta</div>
                    </div>

                    <div class="card-container">
                        <div>
                            <h2 class="card-title">Endereços</h2>
                        </div>
                        <div class="card">END</div>
                    </div>
                </div>
            </LoadingComponent>
            <!--            <LoadingComponent :loading="loading">
                <fieldset
                    v-if="!editMode"
                    :disabled="loading"
                >
                    <legend>Tipo de cadastro</legend>

                    <div class="form-control inline">
                        <label class="form-control">
                            CPF
                            <input
                                v-model="form.type"
                                class="form-radio"
                                type="radio"
                                name="type"
                                value="cpf"
                            />
                        </label>

                        <label class="form-control">
                            CNPJ
                            <input
                                v-model="form.type"
                                class="form-radio"
                                type="radio"
                                name="type"
                                value="cnpj"
                            />
                        </label>
                    </div>
                </fieldset>

                <fieldset
                    v-if="form.type === 'cpf'"
                    :disabled="loading"
                >
                    <legend>Dados da pessoa</legend>

                    <div class="form-control inline">
                        <label class="form-control">
                            Primeiro nome
                            <input
                                v-model="form.first_name"
                                type="text"
                                name="first_name"
                            />
                        </label>

                        <label class="form-control">
                            Sobrenome
                            <input
                                v-model="form.last_name"
                                type="text"
                                name="last_name"
                            />
                        </label>

                        <label class="form-control">
                            CPF
                            <input
                                v-model="form.cpf"
                                type="text"
                                name="cpf"
                            />
                        </label>
                    </div>
                </fieldset>

                <fieldset
                    v-if="form.type === 'cnpj'"
                    :disabled="loading"
                >
                    <legend>Dados da empresa</legend>

                    <label class="form-control">
                        Nome
                        <input
                            v-model="form.name"
                            type="text"
                            name="name"
                        />
                    </label>

                    <div class="form-control inline">
                        <label
                            class="form-control"
                            style="max-width: 30%"
                        >
                            CNPJ
                            <input
                                v-model="form.cnpj"
                                type="text"
                                name="cnpj"
                            />
                        </label>

                        <label class="form-control">
                            Razão Social
                            <input
                                v-model="form.legal_name"
                                type="text"
                                name="legal_name"
                            />
                        </label>
                    </div>
                </fieldset>

                <fieldset :disabled="loading">
                    <legend>Contatos</legend>

                    <template
                        v-for="(contact, index) in form.contacts"
                        :key="`contact_${index}`"
                    >
                        <div class="form-control inline">
                            <label
                                class="form-control"
                                style="max-width: 20%"
                            >
                                <input
                                    v-model="contact.value"
                                    placeholder="Telefone ou E-mail"
                                    type="text"
                                    :name="`contact_value[${index}]`"
                                    @keyup="updateContact(contact)"
                                />
                            </label>

                            <label
                                class="form-control"
                                style="max-width: 20%"
                            >
                                <input
                                    v-model="contact.description"
                                    placeholder="Descrição do contato"
                                    type="text"
                                    :name="`contact_description[${index}]`"
                                />
                            </label>

                            <label
                                v-if="contact?.properties?.whatsapp !== undefined"
                                class="form-control inline"
                                style="max-width: fit-content; align-items: center"
                            >
                                Tem Whatsapp
                                <input
                                    v-model="contact.properties.whatsapp"
                                    type="checkbox"
                                    :name="`contact_properties_whatsapp[${index}]`"
                                />
                            </label>

                            <button
                                style="max-width: 80px"
                                type="button"
                                @click="handleRemoveContact(index)"
                            >
                                Remover
                            </button>
                        </div>
                    </template>

                    <button
                        type="button"
                        @click="handleAddContact"
                    >
                        + ADD CONTATO
                    </button>
                </fieldset>

                <fieldset :disabled="loading">
                    <legend>Endereços</legend>

                    <fieldset
                        v-for="(address, index) in form.addresses"
                        :key="`address-${index}`"
                    >
                        <legend>{{ ADDRESS_TAG_ENUM[address?.type ?? 'home'] }}</legend>

                        <div class="form-control inline">
                            <label class="form-control">
                                Casa
                                <input
                                    v-model="address.type"
                                    type="radio"
                                    :name="`type[${index}]`"
                                    value="home"
                                />
                            </label>

                            <label class="form-control">
                                Comercial
                                <input
                                    v-model="address.type"
                                    type="radio"
                                    :name="`type[${index}]`"
                                    value="commercial"
                                />
                            </label>

                            <label class="form-control">
                                Cobrança
                                <input
                                    v-model="address.type"
                                    type="radio"
                                    :name="`type[${index}]`"
                                    value="billing"
                                />
                            </label>
                        </div>

                        <div class="form-control inline">
                            <label
                                class="form-control"
                                style="max-width: 20%"
                            >
                                CEP
                                <input
                                    v-model="address.zipcode"
                                    type="text"
                                    :name="`zipcode[${index}]`"
                                />
                            </label>

                            <label class="form-control">
                                Rua
                                <input
                                    v-model="address.street"
                                    type="text"
                                    :name="`street[${index}]`"
                                />
                            </label>

                            <label
                                class="form-control"
                                style="max-width: 20%"
                            >
                                Número
                                <input
                                    v-model="address.number"
                                    type="text"
                                    :name="`number[${index}]`"
                                />
                            </label>
                        </div>

                        <div class="form-control inline">
                            <label class="form-control">
                                Bairro
                                <input
                                    v-model="address.neighborhood"
                                    type="text"
                                    :name="`neighborhood[${index}]`"
                                />
                            </label>

                            <label class="form-control">
                                Cidade
                                <input
                                    v-model="address.city"
                                    type="text"
                                    :name="`city[${index}]`"
                                />
                            </label>

                            <label class="form-control">
                                Estado
                                <input
                                    v-model="address.state"
                                    type="text"
                                    :name="`state[${index}]`"
                                />
                            </label>
                        </div>

                        <label class="form-control">
                            Complemento
                            <input
                                v-model="address.complement"
                                type="text"
                                :name="`state[${index}]`"
                            />
                        </label>

                        <button
                            type="button"
                            :disabled="loading"
                            @click="handleRemoveAddress(index)"
                        >
                            Remover endereço
                        </button>
                    </fieldset>

                    <button
                        type="button"
                        @click="handleAddAddress"
                    >
                        + ADD ENDEREÇO
                    </button>
                </fieldset>

                <button
                    type="submit"
                    :disabled="loading"
                >
                    Salvar
                </button>
            </LoadingComponent>-->
        </PageContentComponent>
    </form>
</template>

<style lang="scss" scoped>
    .card-container {
        @apply grid grid-cols-1 sm:grid-cols-[300px_1fr];
    }

    .card {
        @apply -mx-4 sm:mx-0 px-4 py-6 sm:p-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6;
    }

    .card-title {
        @apply text-base/7 font-semibold text-gray-900;
    }
</style>
