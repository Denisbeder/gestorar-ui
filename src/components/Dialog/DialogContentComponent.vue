<script setup lang="ts">
    type PropsType = {
        borderTop?: boolean;
    };

    defineProps<PropsType>();
</script>

<template>
    <div
        class="-mx-4 sm:-mx-6 -mb-4 sm:-mb-6 p-4 sm:p-6"
        :class="{ 'border-t mt-4 sm:mt-6': borderTop }"
    >
        <slot />
    </div>
</template>
