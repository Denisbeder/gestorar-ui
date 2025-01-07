<script setup lang="ts">
    import { toRaw, ref, computed, onMounted } from 'vue';
    import ChevronRightIcon from '@/components/Icons/ChevronRightIcon.vue';
    import ChevronLeftIcon from '@/components/Icons/ChevronLeftIcon.vue';

    type SliderPagesType = {
        start: number[] | null;
        slider: number[] | null;
        end: number[] | null;
    };

    type PropsType = {
        perPage?: number;
        total?: number;
        onEachSide?: number;
    };

    const props = withDefaults(defineProps<PropsType>(), {
        perPage: 15,
        onEachSide: 2
    });

    const emit = defineEmits(['on-change']);

    const currentPage = ref<number>(1);

    const isFirstPage = computed(() => {
        return currentPage.value === 1;
    });

    const isLastPage = computed(() => {
        return currentPage.value === totalPages.value;
    });

    const totalPages = computed(() => {
        return Math.ceil(props.total / props.perPage);
    });

    const pages = computed(() => {
        return Array.from({ length: totalPages.value }, (_, index) => index + 1);
    });

    const lastPage = computed(() => {
        return pages.value[totalPages.value - 1];
    });

    const startPages = computed(() => {
        return pages.value.slice(0, props.onEachSide);
    });

    const endPages = computed(() => {
        return pages.value.slice(-props.onEachSide);
    });

    const sliderPages = computed<SliderPagesType>(() => {
        const windowPage = props.onEachSide + 4;

        if (currentPage.value <= windowPage) {
            return {
                start: pages.value.slice(0, windowPage + props.onEachSide),
                slider: null,
                end: endPages.value,
            };
        }

        if (currentPage.value > lastPage.value - windowPage) {
            const last = pages.value.slice(lastPage.value - windowPage + (props.onEachSide + 1) * -1);

            return {
                start: startPages.value,
                slider: null,
                end: last,
            };
        }

        return {
            start: startPages.value,
            slider: pages.value.slice(currentPage.value - 1 - props.onEachSide , currentPage.value + props.onEachSide),
            end: endPages.value,
        };
    });

    const smallSliderPages = computed<SliderPagesType>(() => {
        return {
            start: pages.value,
            slider: null,
            end: null,
        };
    });

    const fullSliderPages = computed<SliderPagesType>(() => {
        if (pages.value.length === 0) {
            return {
                start: null,
                slider: null,
                end: null,
            };
        }

        if (lastPage.value < props.onEachSide * 2 + 8) {
            return smallSliderPages.value;
        }

        return sliderPages.value;
    });

    function goToPage(page: number) {
        currentPage.value = page;

        const currentParams = new URL(window.location.href).searchParams;

        currentParams.set('page', String(page));

        window.history.pushState({}, '', `?${currentParams.toString()}`);

        emit('on-change', page);
    }

    function prevPage() {
        if (currentPage.value > 1) {
            goToPage(currentPage.value - 1);
        }
    }

    function nextPage() {
        if (currentPage.value < totalPages.value) {
            goToPage(currentPage.value + 1);
        }
    }

    onMounted(() => {
        currentPage.value = Number(new URL(window.location.href).searchParams.get('page') ?? 1);
    });
</script>

<template>
    <div class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
            <button
                type="button"
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                :disabled="isFirstPage"
                @click="prevPage"
            >
                Anterior
            </button>
            <button
                type="button"
                class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                :disabled="isLastPage"
                @click="nextPage"
            >
                Próxima
            </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center lg:justify-between ">
            <p class="text-sm text-gray-700 hidden lg:block">
                Mostrando
                <span class="font-medium">{{ currentPage }}</span>
                de
                <span class="font-medium">{{ totalPages }}</span>
                de
                <span class="font-medium">{{ total }}</span>
                resultados
            </p>

            <nav
                class="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
            >
                <button
                    type="button"
                    class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    :disabled="isFirstPage"
                    @click="prevPage"
                >
                    <span class="sr-only">Anterior</span>
                    <ChevronLeftIcon
                        class="size-5"
                        aria-hidden="true"
                    />
                </button>

                <button
                    v-for="page in fullSliderPages.start"
                    :key="page"
                    type="button"
                    aria-current="page"
                    :class="[
                        currentPage === page ?
                            'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        :   'ring-1 ring-inset ring-gray-300 focus:outline-offset-0',
                        'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 disabled:opacity-50',
                    ]"
                    @click="goToPage(page)"
                >
                    {{ page }}
                </button>

                <template v-if="fullSliderPages.slider">
                    <span
                        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                        >...</span
                    >

                    <button
                        v-for="page in fullSliderPages.slider"
                        :key="page"
                        type="button"
                        aria-current="page"
                        :class="[
                            currentPage === page ?
                                'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            :   'ring-1 ring-inset ring-gray-300 focus:outline-offset-0',
                            'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 disabled:opacity-50',
                        ]"
                        @click="goToPage(page)"
                    >
                        {{ page }}
                    </button>
                </template>

                <template v-if="fullSliderPages.end">
                    <span
                        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                        >...</span
                    >

                    <button
                        v-for="page in fullSliderPages.end"
                        :key="page"
                        type="button"
                        aria-current="page"
                        :class="[
                            currentPage === page ?
                                'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            :   'ring-1 ring-inset ring-gray-300 focus:outline-offset-0',
                            'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 disabled:opacity-50',
                        ]"
                        @click="goToPage(page)"
                    >
                        {{ page }}
                    </button>
                </template>

                <button
                    type="button"
                    class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    :disabled="isLastPage"
                    @click="nextPage"
                >
                    <span class="sr-only">Próxima</span>
                    <ChevronRightIcon
                        class="size-5"
                        aria-hidden="true"
                    />
                </button>
            </nav>
        </div>
    </div>
</template>
