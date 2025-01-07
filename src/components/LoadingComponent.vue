<script setup lang="ts">
    import LoaderIcon from '@/components/Icons/LoaderIcon.vue';

    type PropsType = {
        loading: boolean;
    };

    withDefaults(defineProps<PropsType>(), {
        loading: false,
    });
</script>

<template>
    <div
        v-if="$slots.default"
        class="relative"
        :class="{ loading: loading }"
    >
        <div
            v-if="loading"
            class="z-40 absolute inset-0 flex items-center justify-center min-h-[30svh] h-full w-full"
        >
            <LoaderIcon />
        </div>

        <div
            class="w-full"
            :class="{ 'opacity-[0.2]': loading }"
        >
            <slot />
        </div>
    </div>

    <div
        v-else
        class="relative"
    >
        <LoaderIcon />
    </div>
</template>
