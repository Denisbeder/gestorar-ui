<script setup lang="ts">
    import CheckIcon from '@/components/Icons/CheckIcon.vue';
    import {
        Combobox,
        ComboboxButton,
        ComboboxInput,
        ComboboxOption,
        ComboboxOptions,
        TransitionRoot,
    } from '@headlessui/vue';
    import SelectorIcon from '@/components/Icons/SelectorIcon.vue';
    import { computed, ref } from 'vue';

    type OptionType = {
        id: number;
        name: string;
    };

    type PropsType = {
        options: OptionType[];
    };

    const props = defineProps<PropsType>();

    const optionSelected = defineModel({ type: Object });

    const query = ref('');

    const filtered = computed(() =>
        query.value === '' ?
            props.options
        :   props.option.filter((option) =>
                option.name.toLowerCase().replace(/\s+/g, '').includes(query.value.toLowerCase().replace(/\s+/g, '')),
            ),
    );
</script>

<template>
    <Combobox v-model="optionSelected">
        <div class="relative z-10">
            <div class="relative w-full cursor-default rounded-lg bg-white text-left">
                <ComboboxInput
                    class="w-full form-input"
                    :display-value="(option) => option?.name"
                    @change="query = $event.target.value"
                />
                <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <SelectorIcon
                        class="size-5 text-gray-400"
                        aria-hidden="true"
                    />
                </ComboboxButton>
            </div>
            <TransitionRoot
                leave="transition ease-in duration-100"
                leave-from="opacity-100"
                leave-to="opacity-0"
                @after-leave="query = ''"
            >
                <ComboboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                >
                    <div
                        v-if="filtered.length === 0 && query !== ''"
                        class="relative cursor-default select-none px-4 py-2 text-gray-700"
                    >
                        Nothing found.
                    </div>

                    <ComboboxOption
                        v-for="option in filtered"
                        :key="option.id"
                        v-slot="{ selected, active }"
                        as="template"
                        :value="option"
                    >
                        <li
                            class="relative cursor-default select-none py-2 pl-10 pr-4"
                            :class="{
                                'bg-primary text-white': active,
                                'text-gray-900': !active,
                            }"
                        >
                            <span
                                class="block truncate"
                                :class="{
                                    'font-medium': selected,
                                    'font-normal': !selected,
                                }"
                            >
                                {{ option.name }}
                            </span>
                            <span
                                v-if="selected"
                                class="absolute inset-y-0 left-0 flex items-center pl-3"
                                :class="{ 'text-white': active, 'text-primary': !active }"
                            >
                                <CheckIcon
                                    class="size-5"
                                    aria-hidden="true"
                                />
                            </span>
                        </li>
                    </ComboboxOption>
                </ComboboxOptions>
            </TransitionRoot>
        </div>
    </Combobox>
</template>
