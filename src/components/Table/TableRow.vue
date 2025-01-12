<script setup lang="ts">
    import { inject } from 'vue';

    const table = inject('table');
</script>

<template>
    <div>
        <slot :processing-records="table.processingRecords.value" />
    </div>
</template>
