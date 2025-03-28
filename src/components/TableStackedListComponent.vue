<template>
    <ul
        role="list"
        class="divide-y divide-gray-100"
    >
        <li
            v-for="record in records"
            :key="record.id"
        >
            <TableRow v-slot="{ processingRecords }">
                <LoadingComponent :loading="processingRecords.includes(record.id)">
                    <div class="flex items-center justify-between gap-x-6 py-5">
                        <div class="min-w-0">
                            <slot :record="record" />
                        </div>

                        <div class="flex flex-none items-center gap-x-4">
                            <RouterLink
                                :to="`/customers/${record.id}/edit`"
                                class="hidden sm:block btn btn--white"
                            >
                                Visualizar
                                <span class="sr-only">, {{ record.name }}</span>
                            </RouterLink>
                            <Menu
                                as="div"
                                class="relative flex-none"
                            >
                                <MenuButton class="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                    <span class="sr-only">Mais opções</span>
                                    <DotsVertical class="size-5" />
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
                                            <TableAction v-slot="{ deleteAction }">
                                                <button
                                                    :class="[
                                                        active ? 'bg-red-50 outline-none' : '',
                                                        'block px-3 py-1 text-sm/6 text-gray-900 w-full text-left',
                                                    ]"
                                                    @click="deleteAction(record.id)"
                                                >
                                                    Deletar<span class="sr-only">, {{ record.name }}</span>
                                                </button>
                                            </TableAction>
                                        </MenuItem>
                                    </MenuItems>
                                </transition>
                            </Menu>
                        </div>
                    </div>
                </LoadingComponent>
            </TableRow>
        </li>
    </ul>
</template>

<script lang="ts" setup>
    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
    import DotsVertical from '@/components/Icons/DotsVertical.vue';
    import LoadingComponent from '@/components/LoadingComponent.vue';
    import TableAction from '@/components/Table/TableAction.vue';
    import TableRow from '@/components/Table/TableRow.vue';

    type PropsType = {
        records?: CustomerModelType[];
    };

    defineProps<PropsType>();
</script>
