<script setup lang="ts">
    import { useSlots } from 'vue';

    type PropsType = {
        loading: boolean;
    };

    withDefaults(defineProps<PropsType>(), {
        loading: false,
    });

    const slots = useSlots();

    console.log(slots.default);
</script>

<template>
    <div
        v-if="$slots.default"
        class="page-loading-container"
    >
        <div
            v-if="loading"
            class="page-loading-wrapper"
        >
            <progress></progress>
        </div>

        <slot />
    </div>

    <div
        v-else
        class="page-loading-wrapper"
    >
        <progress></progress>
    </div>
</template>

<style lang="scss" scoped>
    .page-loading-container {
        position: relative;

        .page-loading-wrapper {
            display: flex;
            width: 100%;
            height: 100%;
            min-width: 100%;
            min-height: 100%;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.8);
        }
    }
</style>
