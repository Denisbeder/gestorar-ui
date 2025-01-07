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
                <div class="space-y-10 divide-y divide-gray-900/10">
                    <div class="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
                        <div class="px-4 sm:px-0">
                            <h2 class="text-base/7 font-semibold text-gray-900">Profile</h2>
                            <p class="mt-1 text-sm/6 text-gray-600">
                                This information will be displayed publicly so be careful what you share.
                            </p>
                        </div>

                        <div
                            class="px-4 py-6 sm:p-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
                        >
                            <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div class="sm:col-span-4">
                                    <label
                                        for="username"
                                        class="block text-sm/6 font-medium text-gray-900"
                                        >Username</label
                                    >
                                    <div class="mt-2">
                                        <div
                                            class="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
                                        >
                                            <div class="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
                                                workcation.com/
                                            </div>
                                            <input
                                                id="username"
                                                type="text"
                                                name="username"
                                                class="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                                placeholder="janesmith"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="col-span-full">
                                    <label
                                        for="about"
                                        class="block text-sm/6 font-medium text-gray-900"
                                        >About</label
                                    >
                                    <div class="mt-2">
                                        <textarea
                                            id="about"
                                            name="about"
                                            rows="3"
                                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>
                                    <p class="mt-3 text-sm/6 text-gray-600">Write a few sentences about yourself.</p>
                                </div>

                                <div class="col-span-full">
                                    <label
                                        for="photo"
                                        class="block text-sm/6 font-medium text-gray-900"
                                        >Photo</label
                                    >
                                    <div class="mt-2 flex items-center gap-x-3">
                                        <UserCircleIcon
                                            class="size-12 text-gray-300"
                                            aria-hidden="true"
                                        />
                                        <button
                                            type="button"
                                            class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>

                                <div class="col-span-full">
                                    <label
                                        for="cover-photo"
                                        class="block text-sm/6 font-medium text-gray-900"
                                        >Cover photo</label
                                    >
                                    <div
                                        class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                                    >
                                        <div class="text-center">
                                            <PhotoIcon
                                                class="mx-auto size-12 text-gray-300"
                                                aria-hidden="true"
                                            />
                                            <div class="mt-4 flex text-sm/6 text-gray-600">
                                                <label
                                                    for="file-upload"
                                                    class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                >
                                                    <span>Upload a file</span>
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        class="sr-only"
                                                    />
                                                </label>
                                                <p class="pl-1">or drag and drop</p>
                                            </div>
                                            <p class="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                        <div class="px-4 sm:px-0">
                            <h2 class="text-base/7 font-semibold text-gray-900">Personal Information</h2>
                            <p class="mt-1 text-sm/6 text-gray-600">
                                Use a permanent address where you can receive mail.
                            </p>
                        </div>

                        <form class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                            <div class="px-4 py-6 sm:p-8">
                                <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div class="sm:col-span-3">
                                        <label
                                            for="first-name"
                                            class="block text-sm/6 font-medium text-gray-900"
                                            >First name</label
                                        >
                                        <div class="mt-2">
                                            <input
                                                id="first-name"
                                                type="text"
                                                name="first-name"
                                                autocomplete="given-name"
                                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div class="sm:col-span-3">
                                        <label
                                            for="last-name"
                                            class="block text-sm/6 font-medium text-gray-900"
                                            >Last name</label
                                        >
                                        <div class="mt-2">
                                            <input
                                                id="last-name"
                                                type="text"
                                                name="last-name"
                                                autocomplete="family-name"
                                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div class="sm:col-span-4">
                                        <label
                                            for="email"
                                            class="block text-sm/6 font-medium text-gray-900"
                                            >Email address</label
                                        >
                                        <div class="mt-2">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autocomplete="email"
                                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div class="sm:col-span-3">
                                        <label
                                            for="country"
                                            class="block text-sm/6 font-medium text-gray-900"
                                            >Country</label
                                        >
                                        <div class="mt-2 grid grid-cols-1">
                                            <select
                                                id="country"
                                                name="country"
                                                autocomplete="country-name"
                                                class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            >
                                                <option>United States</option>
                                                <option>Canada</option>
                                                <option>Mexico</option>
                                            </select>
                                            <ChevronDownIcon
                                                class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>

                                    <div class="col-span-full">
                                        <label
                                            for="street-address"
                                            class="block text-sm/6 font-medium text-gray-900"
                                            >Street address</label
                                        >
                                        <div class="mt-2">
                                            <input
                                                id="street-address"
                                                type="text"
                                                name="street-address"
                                                autocomplete="street-address"
                                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div class="sm:col-span-2 sm:col-start-1">
                                        <label
                                            for="city"
                                            class="block text-sm/6 font-medium text-gray-900"
                                            >City</label
                                        >
                                        <div class="mt-2">
                                            <input
                                                id="city"
                                                type="text"
                                                name="city"
                                                autocomplete="address-level2"
                                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div class="sm:col-span-2">
                                        <label
                                            for="region"
                                            class="block text-sm/6 font-medium text-gray-900"
                                            >State / Province</label
                                        >
                                        <div class="mt-2">
                                            <input
                                                id="region"
                                                type="text"
                                                name="region"
                                                autocomplete="address-level1"
                                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div class="sm:col-span-2">
                                        <label
                                            for="postal-code"
                                            class="block text-sm/6 font-medium text-gray-900"
                                            >ZIP / Postal code</label
                                        >
                                        <div class="mt-2">
                                            <input
                                                id="postal-code"
                                                type="text"
                                                name="postal-code"
                                                autocomplete="postal-code"
                                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8"
                            >
                                <button
                                    type="button"
                                    class="text-sm/6 font-semibold text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>

                    <div class="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                        <div class="px-4 sm:px-0">
                            <h2 class="text-base/7 font-semibold text-gray-900">Notifications</h2>
                            <p class="mt-1 text-sm/6 text-gray-600">
                                We'll always let you know about important changes, but you pick what else you want to
                                hear about.
                            </p>
                        </div>

                        <form class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                            <div class="px-4 py-6 sm:p-8">
                                <div class="max-w-2xl space-y-10 md:col-span-2">
                                    <fieldset>
                                        <legend class="text-sm/6 font-semibold text-gray-900">By email</legend>
                                        <div class="mt-6 space-y-6">
                                            <div class="flex gap-3">
                                                <div class="flex h-6 shrink-0 items-center">
                                                    <div class="group grid size-4 grid-cols-1">
                                                        <input
                                                            id="comments"
                                                            aria-describedby="comments-description"
                                                            name="comments"
                                                            type="checkbox"
                                                            checked=""
                                                            class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                        />
                                                        <svg
                                                            class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                                            viewBox="0 0 14 14"
                                                            fill="none"
                                                        >
                                                            <path
                                                                class="opacity-0 group-has-[:checked]:opacity-100"
                                                                d="M3 8L6 11L11 3.5"
                                                                stroke-width="2"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                            <path
                                                                class="opacity-0 group-has-[:indeterminate]:opacity-100"
                                                                d="M3 7H11"
                                                                stroke-width="2"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="text-sm/6">
                                                    <label
                                                        for="comments"
                                                        class="font-medium text-gray-900"
                                                        >Comments</label
                                                    >
                                                    <p
                                                        id="comments-description"
                                                        class="text-gray-500"
                                                    >
                                                        Get notified when someones posts a comment on a posting.
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="flex gap-3">
                                                <div class="flex h-6 shrink-0 items-center">
                                                    <div class="group grid size-4 grid-cols-1">
                                                        <input
                                                            id="candidates"
                                                            aria-describedby="candidates-description"
                                                            name="candidates"
                                                            type="checkbox"
                                                            class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                        />
                                                        <svg
                                                            class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                                            viewBox="0 0 14 14"
                                                            fill="none"
                                                        >
                                                            <path
                                                                class="opacity-0 group-has-[:checked]:opacity-100"
                                                                d="M3 8L6 11L11 3.5"
                                                                stroke-width="2"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                            <path
                                                                class="opacity-0 group-has-[:indeterminate]:opacity-100"
                                                                d="M3 7H11"
                                                                stroke-width="2"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="text-sm/6">
                                                    <label
                                                        for="candidates"
                                                        class="font-medium text-gray-900"
                                                        >Candidates</label
                                                    >
                                                    <p
                                                        id="candidates-description"
                                                        class="text-gray-500"
                                                    >
                                                        Get notified when a candidate applies for a job.
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="flex gap-3">
                                                <div class="flex h-6 shrink-0 items-center">
                                                    <div class="group grid size-4 grid-cols-1">
                                                        <input
                                                            id="offers"
                                                            aria-describedby="offers-description"
                                                            name="offers"
                                                            type="checkbox"
                                                            class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                        />
                                                        <svg
                                                            class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                                            viewBox="0 0 14 14"
                                                            fill="none"
                                                        >
                                                            <path
                                                                class="opacity-0 group-has-[:checked]:opacity-100"
                                                                d="M3 8L6 11L11 3.5"
                                                                stroke-width="2"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                            <path
                                                                class="opacity-0 group-has-[:indeterminate]:opacity-100"
                                                                d="M3 7H11"
                                                                stroke-width="2"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="text-sm/6">
                                                    <label
                                                        for="offers"
                                                        class="font-medium text-gray-900"
                                                        >Offers</label
                                                    >
                                                    <p
                                                        id="offers-description"
                                                        class="text-gray-500"
                                                    >
                                                        Get notified when a candidate accepts or rejects an offer.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>

                                    <fieldset>
                                        <legend class="text-sm/6 font-semibold text-gray-900">
                                            Push notifications
                                        </legend>
                                        <p class="mt-1 text-sm/6 text-gray-600">
                                            These are delivered via SMS to your mobile phone.
                                        </p>
                                        <div class="mt-6 space-y-6">
                                            <div class="flex items-center gap-x-3">
                                                <input
                                                    id="push-everything"
                                                    name="push-notifications"
                                                    type="radio"
                                                    checked=""
                                                    class="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                                                />
                                                <label
                                                    for="push-everything"
                                                    class="block text-sm/6 font-medium text-gray-900"
                                                    >Everything</label
                                                >
                                            </div>
                                            <div class="flex items-center gap-x-3">
                                                <input
                                                    id="push-email"
                                                    name="push-notifications"
                                                    type="radio"
                                                    class="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                                                />
                                                <label
                                                    for="push-email"
                                                    class="block text-sm/6 font-medium text-gray-900"
                                                    >Same as email</label
                                                >
                                            </div>
                                            <div class="flex items-center gap-x-3">
                                                <input
                                                    id="push-nothing"
                                                    name="push-notifications"
                                                    type="radio"
                                                    class="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                                                />
                                                <label
                                                    for="push-nothing"
                                                    class="block text-sm/6 font-medium text-gray-900"
                                                    >No push notifications</label
                                                >
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            <div
                                class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8"
                            >
                                <button
                                    type="button"
                                    class="text-sm/6 font-semibold text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
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
