<script setup lang="ts">
    import { reactive, ref } from 'vue';
    import { toast } from 'vue3-toastify';
    import { useHTTP } from '@/composable/useHTTP.ts';
    import { useCustomerService } from '@/composable/useCustomerService.ts';

    const customerService = useCustomerService();
    const { errorHandle } = useHTTP();

    const ADDRESS_TAG_ENUM = {
        home: 'Casa',
        commercial: 'Comercial',
        billing: 'Cobrança',
    };

    const isLoading = ref<boolean>(false);
    const form = reactive<CustomerFormType>({
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
                zipcode: null,
                street: '',
                number: '',
                neighborhood: '',
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
    });

    function onSubmit() {
        isLoading.value = true;

        toast.clearAll();

        customerService
            .store(form)
            .then((response) => {
                console.log(response);
                toast.success('Cliente salvo');
            })
            .catch((error) => {
                errorHandle(error);
            })
            .finally(() => (isLoading.value = false));
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
        });
    }

    function handleRemoveContact(index: number) {
        form.contacts.splice(index, 1);
    }
</script>

<template>
    <form @submit.prevent="onSubmit">
        <fieldset :disabled="isLoading">
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
            :disabled="isLoading"
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
            :disabled="isLoading"
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

        <fieldset :disabled="isLoading">
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
                        />
                    </label>

                    <label
                        class="form-control"
                        style="max-width: 20%"
                    >
                        <input
                            v-model="contact.description"
                            placeholder="Detalhes do contato"
                            type="text"
                            :name="`contact_description[${index}]`"
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

        <fieldset :disabled="isLoading">
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
                    :disabled="isLoading"
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

        <button
            type="submit"
            :disabled="isLoading"
        >
            Salvar
        </button>
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
