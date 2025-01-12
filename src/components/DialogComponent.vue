<template>
    <TransitionRoot
        appear
        :show="isOpen || open"
        as="template"
    >
        <Dialog
            as="div"
            @close="handleClose"
            class="relative z-10"
            v-bind="$attrs"
        >
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
                        >
                            <slot
                                v-if="$slots.header"
                                name="header"
                            />

                            <DialogTitle
                                v-if="title && !$slots.header"
                                as="h3"
                                class="text-lg font-medium leading-6 text-gray-900"
                            >
                                {{ title }}
                            </DialogTitle>

                            <slot />

                            <slot
                                name="footer"
                                :close="handleClose"
                            />
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script lang="ts" setup>
    import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';

    type PropsType = {
        title?: string;
        open?: boolean;
    };

    defineProps<PropsType>();

    const isOpen = defineModel({ type: Boolean, default: false });

    function handleClose() {
        isOpen.value = false;
    }
</script>
