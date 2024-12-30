<script setup lang="ts">
    type PropsType = {
        links: PaginationType['links'];
    };

    defineProps<PropsType>();

    const emit = defineEmits(['on-change']);

    function goToPage(url: string | null) {
        if (!url) {
            return;
        }

        const pageUrlParams = new URL(url).searchParams;
        const currentParams = new URL(window.location.href).searchParams;
        const page = pageUrlParams.get('page');

        if (!page) {
            return;
        }

        currentParams.set('page', page);

        window.history.pushState({}, '', `?${currentParams.toString()}`);

        emit('on-change', page);
    }
</script>

<template>
    <div class="pagination">
        <button
            v-for="link in links"
            :key="link.label"
            :style="{ backgroundColor: link.active ? '#ff0000' : 'unset' }"
            @click="goToPage(link.url)"
        >
            <span v-html="link.label"></span>
        </button>
    </div>
</template>

<style lang="scss" scoped>
    .pagination {
        margin-top: 1rem;
    }
</style>
