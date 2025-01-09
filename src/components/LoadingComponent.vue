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
            class="z-40 absolute inset-0 flex items-center justify-center h-full w-full"
        >
            <span class="loader"></span>
        </div>

        <div
            class="w-full"
            :class="{ 'opacity-[0.45]': loading }"
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

<style scoped>
    .loader {
        @apply bg-gray-300;
        width: 48px;
        height: 48px;
        display: inline-block;
        border-radius: 50%;
        box-sizing: border-box;
        animation: animloader 1s ease-in infinite;
    }

    @keyframes animloader {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }
</style>
