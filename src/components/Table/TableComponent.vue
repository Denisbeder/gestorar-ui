<script setup lang="ts">
    import { onBeforeUnmount, onMounted, provide, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { useConfirmDialog } from '@vueuse/core';
    import { displayError } from '@/utils.ts';
    import ConfirmDialogComponent from '@/components/Dialog/ConfirmDialogComponent.vue';
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
    const timeouts = ref<number[]>([]);
    const abortControllers = ref([]);

    function loadRecords(params?: Record<string, string | number>, silent = false) {
        loading.value = !silent;

        props.service
            .index(params, { signal: newAbortController().signal })
            .then((response: AxiosResponse<PaginationDataType>) => {
                records.value = response?.data;
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
            await props.service.destroy(id, { signal: newAbortController().signal });
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

    function newAbortController() {
        const controller = new AbortController();

        abortControllers.value.push(controller);

        return controller;
    }

    function removeTimeouts() {
        timeouts.value.forEach((timeout) => clearTimeout(timeout));
    }

    function cancelRequests() {
        abortControllers.value.forEach((controller) => controller.abort());
    }

    onMounted(() => {
        const params = { ...(route.query as object) };

        loadRecords(params);
    });

    onBeforeUnmount(() => {
        removeTimeouts();
        cancelRequests();
    });

    provide('table', {
        loading,
        records,
        processingRecords,
        handleDelete,
    });
</script>

<template>
    <LoadingComponent
        :loading="loading"
        class="min-h-[30vh]"
    >
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
