<script setup lang="ts">
    type PropsType = {
        title?: string;
    };

    defineProps<PropsType>();
</script>

<template>
    <header class="bg-white shadow-sm">
        <div class="mx-auto md:flex md:items-center md:justify-between max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div
                v-if="title"
                class="min-w-0 flex-1"
            >
                <h2 class="text-2xl/7 font-semibold text-gray-900 sm:truncate sm:text-lg/6 sm:tracking-tight">
                    {{ title }}
                </h2>
            </div>

            <div
                v-if="$slots.rightCol"
                class="mt-4 flex md:ml-4 md:mt-0"
            >
                <slot name="rightCol" />
            </div>
        </div>
    </header>
</template>
