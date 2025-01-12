<script setup lang="ts">
    import { inject } from 'vue';

    const table = inject('table');
</script>

<template>
    <div>
        <slot :delete-action="table.handleDelete" />
    </div>
</template>
