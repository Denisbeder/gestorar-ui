<script setup lang="ts">
    import { onBeforeUnmount, onMounted, provide, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { useConfirmDialog } from '@vueuse/core';
    import { displayError } from '@/utils.ts';
    import ConfirmDialogComponent from '@/components/ConfirmDialogComponent.vue';
    import type { AxiosResponse } from 'axios';
    import LoadingComponent from '@/components/LoadingComponent.vue';
    import PaginationComponent from '@/components/PaginationComponent.vue';

    type PropsType = {
        service: TableServiceType;
    };

    const props = defineProps<PropsType>();

    const route = useRoute();
    const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();

    const loading = ref<boolean>(false);
    const records = ref<PaginationDataType | null>(null);
    const processingRecords = ref<number[]>([]);
    const timeouts = ref<ReturnType<typeof setTimeout>[]>([]);

    function loadRecords(params?: Record<string, string | number>, silent = false) {
        loading.value = !silent;

        props.service
            .index(params)
            .then(({ data }: AxiosResponse<PaginationDataType>) => {
                records.value = data;
            })
            .catch((error) => displayError(error))
            .finally(() => (loading.value = false));
    }

    async function handleDelete(id: number) {
        const { isCanceled } = await reveal();

        if (isCanceled) {
            return;
        }

        removeTimeouts();

        processingRecords.value.push(id);

        try {
            await props.service.destroy(id);
            records.value!.data = records.value!.data.filter((record) => record.id !== id);

            timeouts.value.push(setTimeout(() => loadRecords({ ...(route.query as object) }, true), 3000));
        } catch (error) {
            displayError(error);
        } finally {
            processingRecords.value = processingRecords.value.filter((record) => record !== id);
        }
    }

    function onPageChange(page: number) {
        removeTimeouts();

        loadRecords({ page });
    }

    function removeTimeouts() {
        timeouts.value.forEach((timeout) => clearTimeout(timeout));
    }

    onMounted(() => {
        const params = { ...(route.query as object) };

        loadRecords(params);
    });

    onBeforeUnmount(() => {
        removeTimeouts();
    });

    provide('table', {
        loading,
        records,
        processingRecords,
        handleDelete,
    });
</script>

<template>
    <LoadingComponent :loading="loading">
        <slot
            :records="records"
            :loading="loading"
            :page-change="onPageChange"
        />

        <PaginationComponent
            v-if="records?.total"
            class="-mx-6"
            :total="records?.total"
            @on-change="onPageChange"
        />
    </LoadingComponent>

    <ConfirmDialogComponent
        :open="isRevealed"
        @on-confirm="confirm"
        @on-cancel="cancel"
    />
</template>
