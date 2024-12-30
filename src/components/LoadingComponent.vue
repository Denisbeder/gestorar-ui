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
        class="container"
        :class="{ loading: loading }"
    >
        <div
            v-if="loading"
            class="loading-overlay"
        >
            <progress></progress>
        </div>

        <div class="content">
            <slot />
        </div>
    </div>

    <div
        v-else
        class="page-loading-wrapper"
    >
        <progress></progress>
    </div>
</template>

<style lang="scss" scoped>
    .container {
        position: relative;

        .content {
            width: 100%;
        }

        .loading-overlay {
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
        }

        &.loading {
            .content {
                opacity: 0.2;
            }
        }
    }
</style>
