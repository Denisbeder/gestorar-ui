<script setup lang="ts">
    import { onMounted, reactive, ref } from 'vue';
    import { toast } from 'vue3-toastify';
    import { useCustomerService } from '@/composable/useCustomerService.ts';
    import { useRoute, useRouter } from 'vue-router';
    import type { AxiosResponse } from 'axios';
    import { displayError } from '@/utils.ts';
    import LoadingComponent from '@/components/LoadingComponent.vue';

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
    <LoadingComponent :loading="loading">
        <form @submit.prevent="onSubmit">
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
                            type="radio"
                            name="type"
                            value="cpf"
                        />
                    </label>

                    <label class="form-control">
                        CNPJ
                        <input
                            v-model="form.type"
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
        </form>
    </LoadingComponent>
</template>

<style lang="scss" scoped>
    form,
    fieldset {
        display: flex;
        gap: 1rem;
        flex-direction: column;
    }

    fieldset legend {
        font-weight: bold;
    }

    .form-control {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        input[type='text'],
        input[type='email'],
        input[type='number'] {
            width: 100%;
            flex: 1;
        }

        &.inline {
            display: flex;
            flex-direction: row;
            gap: 1rem;

            & > * {
                flex: 1;
            }
        }
    }
</style>
