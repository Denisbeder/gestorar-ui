<template>
    <ul
        role="list"
        class="divide-y divide-gray-100"
    >
        <li
            v-for="record in records"
            :key="record.id"
            class="flex items-center justify-between gap-x-6 py-5"
        >
            <div class="min-w-0">
                <div class="flex items-start gap-x-3">
                    <p class="text-sm/6 font-semibold text-gray-900">{{ record.name }}</p>
                    <p
                        :class="[
                            types[record.type],
                            'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset uppercase',
                        ]"
                    >
                        {{ record.type }}
                    </p>
                </div>
                <div class="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                    #{{ record.id }}
                    &bullet;
                    <p class="truncate">Criado por Denisbeder</p>
                    &bullet;
                    <p class="whitespace-nowrap">{{ record.document_id }}</p>
                </div>
            </div>
            <div class="flex flex-none items-center gap-x-4">
                <a
                    :href="`/customers/${record.id}/edit`"
                    class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                    >Visualizar<span class="sr-only">, {{ record.name }}</span></a
                >
                <Menu
                    as="div"
                    class="relative flex-none"
                >
                    <MenuButton class="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span class="sr-only">Mais opções</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-5"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                            />
                        </svg>
                    </MenuButton>
                    <transition
                        enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95"
                        enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95"
                    >
                        <MenuItems
                            class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                        >
                            <MenuItem v-slot="{ active }">
                                <RouterLink
                                    :to="`/customers/${record.id}/edit`"
                                    :class="[
                                        active ? 'bg-gray-50 outline-none' : '',
                                        'block px-3 py-1 text-sm/6 text-gray-900',
                                    ]"
                                >
                                    Editar
                                    <span class="sr-only">, {{ record.name }} </span>
                                </RouterLink>
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                                <button
                                    :class="[
                                        active ? 'bg-red-50 outline-none' : '',
                                        'w-full text-left block px-3 py-1 text-sm/6 text-gray-900',
                                    ]"
                                    @click="$emit('on-delete', record.id)"
                                >
                                    Deletar<span class="sr-only">, {{ record.name }}</span>
                                </button>
                            </MenuItem>
                        </MenuItems>
                    </transition>
                </Menu>
            </div>
        </li>
    </ul>
</template>

<script lang="ts" setup>
    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';

    type PropsType = {
        records?: CustomerModelType[];
    };

    defineProps<PropsType>();

    const types = {
        cpf: 'text-green-700 bg-green-50 ring-green-600/20',
        cnpj: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
    };
</script>
