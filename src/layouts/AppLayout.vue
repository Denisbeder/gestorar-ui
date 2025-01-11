<template>
    <div class="min-h-full">
        <Disclosure
            v-slot="{ open }"
            as="nav"
            class="bg-primary"
        >
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center justify-between">
                    <div class="flex items-center">
                        <div class="shrink-0">
                            <img
                                class="size-8"
                                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=300"
                                alt="Your Company"
                            />
                        </div>
                        <div class="hidden md:block">
                            <div class="ml-10 flex items-baseline space-x-4">
                                <RouterLink
                                    v-for="item in navigation"
                                    :key="item.name"
                                    :to="item.href"
                                    active-class="bg-indigo-700"
                                    class="text-white hover:bg-indigo-500/75 rounded-md px-3 py-2 text-sm font-medium"
                                >
                                    {{ item.name }}
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-4 flex items-center md:ml-6">
                            <button
                                type="button"
                                class="relative rounded-full bg-primary p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                            >
                                <span class="absolute -inset-1.5" />
                                <span class="sr-only">Ver notificações</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="size-6"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                                    />
                                </svg>
                            </button>

                            <!-- Profile dropdown -->
                            <Menu
                                as="div"
                                class="relative ml-3"
                            >
                                <div>
                                    <MenuButton
                                        class="relative flex max-w-xs items-center rounded-full bg-primary text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                                    >
                                        <span class="absolute -inset-1.5" />
                                        <span class="sr-only">Abri menu do usuário</span>
                                        <img
                                            class="size-8 rounded-full"
                                            :src="user.imageUrl"
                                            alt=""
                                        />
                                    </MenuButton>
                                </div>
                                <transition
                                    enter-active-class="transition ease-out duration-100"
                                    enter-from-class="transform opacity-0 scale-95"
                                    enter-to-class="transform opacity-100 scale-100"
                                    leave-active-class="transition ease-in duration-75"
                                    leave-from-class="transform opacity-100 scale-100"
                                    leave-to-class="transform opacity-0 scale-95"
                                >
                                    <MenuItems
                                        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                                    >
                                        <MenuItem
                                            v-for="item in userNavigation"
                                            :key="item.name"
                                        >
                                            <RouterLink
                                                :to="item.href"
                                                active-class="bg-gray-100 outline-none"
                                                class="block px-4 py-2 text-sm text-gray-700"
                                            >
                                                {{ item.name }}
                                            </RouterLink>
                                        </MenuItem>
                                    </MenuItems>
                                </transition>
                            </Menu>
                        </div>
                    </div>
                    <div class="-mr-2 flex md:hidden">
                        <!-- Mobile menu button -->
                        <DisclosureButton
                            class="relative inline-flex items-center justify-center rounded-md bg-primary p-2 text-indigo-200 hover:bg-indigo-500/75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                        >
                            <span class="absolute -inset-0.5" />
                            <span class="sr-only">Abrir menu principal</span>
                            <svg
                                v-if="!open"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="block size-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>

                            <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </DisclosureButton>
                    </div>
                </div>
            </div>

            <DisclosurePanel class="md:hidden">
                <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                    <DisclosureButton
                        v-for="item in navigation"
                        :key="item.name"
                        :class="[
                            item.current ? 'bg-indigo-700 text-white' : 'text-white hover:bg-indigo-500/75',
                            'block rounded-md px-3 py-2 text-base font-medium',
                        ]"
                        :aria-current="item.current ? 'page' : undefined"
                        @click="$router.push(item.href)"
                        >{{ item.name }}
                    </DisclosureButton>
                </div>
                <div class="border-t border-indigo-700 pb-3 pt-4">
                    <div class="flex items-center px-5">
                        <div class="shrink-0">
                            <img
                                class="size-10 rounded-full"
                                :src="user.imageUrl"
                                alt=""
                            />
                        </div>
                        <div class="ml-3">
                            <div class="text-base font-medium text-white">{{ user.name }}</div>
                            <div class="text-sm font-medium text-indigo-300">{{ user.email }}</div>
                        </div>
                        <button
                            type="button"
                            class="relative ml-auto shrink-0 rounded-full bg-primary p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                        >
                            <span class="absolute -inset-1.5" />
                            <span class="sr-only">Ver notificações</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                                />
                            </svg>
                        </button>
                    </div>
                    <div class="mt-3 space-y-1 px-2">
                        <DisclosureButton
                            v-for="item in userNavigation"
                            :key="item.name"
                            as="a"
                            :href="item.href"
                            class="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-500/75"
                            >{{ item.name }}</DisclosureButton
                        >
                    </div>
                </div>
            </DisclosurePanel>
        </Disclosure>

        <slot />
    </div>
</template>

<script lang="ts" setup>
    import {
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
        Menu,
        MenuButton,
        MenuItem,
        MenuItems,
    } from '@headlessui/vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();

    const user = {
        name: 'Tom Cook',
        email: 'tom@example.com',
        imageUrl:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    };

    const navigation = [
        { name: 'Visão geral', href: '/dashboard', current: route.path === '/dashboard' },
        { name: 'Orçamentos', href: '/estimates', current: false },
        { name: 'Ordem de serviços', href: '/work-orders', current: false },
        { name: 'Caixa', href: '/treasures', current: false },
        { name: 'Calendário', href: '/calendar', current: false },
        { name: 'Fornecedores', href: '/suppliers', current: false },
        { name: 'Clientes', href: '/customers', current: route.path === '/customers' },
        { name: 'Relatórios', href: '/reports', current: false },
    ];

    const userNavigation = [
        { name: 'Minha conta', href: '/account' },
        { name: 'Configurações', href: '/settings' },
        { name: 'Sair', href: '/logout' },
    ];
</script>
