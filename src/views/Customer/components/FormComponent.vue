<script setup lang="ts">
    import { reactive, toRaw } from 'vue';

    const ADDRESS_TAG_ENUM = {
        home: 'Casa',
        commercial: 'Comercial',
        billing: 'Cobrança',
    };

    type AddressTypeType = 'home' | 'commercial' | 'billing';
    type ContactTypeType = 'phone' | 'email';

    type AddressModelType<T = AddressTypeType> = {
        type?: T;
        zip_code?: number | null;
        street?: string;
        number?: string;
        district?: string;
        city?: string;
        state?: string;
        complement?: string;
    };

    type ContactModelType = {
        value: string;
        type?: ContactTypeType;
    };

    type PersonModelType = {
        first_name: string;
        last_name?: string | null;
        cpf?: number | null;
        contacts: ContactModelType[];
        addresses: AddressModelType[];
    };

    type CompanyModelType = {
        name: string;
        legal_name?: string | null;
        cnpj?: number | null;
        contacts: ContactModelType[];
        addresses: AddressModelType[];
        contact_person: PersonModelType | null;
    };

    type FormType = {
        type: 'cpf' | 'cnpj';
    } & PersonModelType &
        CompanyModelType;

    const emit = defineEmits(['on-submit']);

    const form = reactive<FormType>({
        type: 'cpf',
        first_name: '',
        last_name: '',
        cpf: null,
        cnpj: null,
        name: '',
        legal_name: '',
        addresses: [
            {
                type: 'commercial',
                zip_code: null,
                street: '',
                number: '',
                district: '',
                city: '',
                state: '',
                complement: '',
            },
        ],
        contacts: [
            {
                value: '67996948065',
                type: 'phone',
            },
            {
                value: 'gK7Y4@example.com',
                type: 'email',
            },
        ],
        contact_person: null,
    });

    function onSubmit() {
        emit('on-submit', toRaw(formPF));
    }

    function handleAddAddress() {
        form.addresses.push({
            type: 'home',
            zip_code: null,
            street: '',
            number: '',
            district: '',
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
        });
    }

    function handleRemoveContact(index) {
        form.contacts.splice(index, 1);
    }
</script>

<template>
    <form @submit.prevent="onSubmit">
        <fieldset>
            <legend>Tipo de cadastro</legend>

            <div class="form-control inline">
                <label class="form-control">
                    CPF
                    <input
                        type="radio"
                        name="type"
                        value="cpf"
                    />
                </label>

                <label class="form-control">
                    CNPJ
                    <input
                        type="radio"
                        name="type"
                        value="cnpj"
                    />
                </label>
            </div>
        </fieldset>

        <fieldset>
            <legend>Dados da pessoa</legend>

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
        </fieldset>

        <fieldset>
            <legend>Dados da empresa</legend>

            <label class="form-control">
                Nome
                <input
                    v-model="form.name"
                    type="text"
                    name="name"
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

            <label class="form-control">
                CNPJ
                <input
                    v-model="form.cnpj"
                    type="text"
                    name="cnpj"
                />
            </label>
        </fieldset>

        <fieldset>
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
                            placeholder="Digite um Telefone ou E-mail"
                            type="text"
                            :name="`contact[${index}]`"
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

        <fieldset>
            <legend>Endereço</legend>

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
                            v-model="address.zip_code"
                            type="text"
                            :name="`zip_code[${index}]`"
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
                            v-model="address.district"
                            type="text"
                            :name="`district[${index}]`"
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
                    @click="handleRemoveAddress(index)"
                >
                    Remover
                </button>
            </fieldset>

            <button
                type="button"
                @click="handleAddAddress"
            >
                + ADD ENDEREÇO
            </button>
        </fieldset>

        <button type="submit">Salvar</button>
    </form>
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
