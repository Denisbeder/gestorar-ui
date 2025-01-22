<script setup lang="ts">
    import DialogComponent from '@/components/Dialog/DialogComponent.vue';

    type PropsType = {
        open: boolean;
    };

    type EmitsType = {
        (e: 'on-confirm'): void;
        (e: 'on-cancel'): void;
    };

    defineProps<PropsType>();
    defineEmits<EmitsType>();
</script>

<template>
    <DialogComponent
        title="Atenção"
        :open="open"
    >
        <div class="mt-2 text-sm text-gray-500">
            Você tem certeza que deseja deletar esse item? Todas as informações dele serão perdidas permanentemente.
            Essa ação não pode ser desfeita.
        </div>

        <template #footer>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    class="w-full sm:ml-3 sm:w-auto btn btn--primary"
                    @click="$emit('on-confirm')"
                >
                    Confirmar
                </button>
                <button
                    type="button"
                    class="mt-3 w-full sm:mt-0 sm:w-auto btn btn--white"
                    @click="$emit('on-cancel')"
                >
                    Cancelar
                </button>
            </div>
        </template>
    </DialogComponent>
</template>
