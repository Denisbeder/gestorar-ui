<script setup lang="ts">
    import PageContentComponent from '@/components/PageContentComponent.vue';
    import LoadingComponent from '@/components/LoadingComponent.vue';
    import ArrowNarrowLeft from '@/components/Icons/ArrowNarrowLeft.vue';
    import LoaderIcon from '@/components/Icons/LoaderIcon.vue';
    import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
    import { useCustomerService } from '@/composable/useCustomerService.ts';
    import { onMounted, reactive, ref } from 'vue';
    import PlusIcon from '@/components/Icons/PlusIcon.vue';
    import SelectCombo from '@/components/SelectCombo.vue';
    import DialogComponent from '@/components/Dialog/DialogComponent.vue';
    import CustomerFormInputsComponent from '@/views/Customer/components/CustomerFormInputsComponent.vue';
    import DialogContentComponent from '@/components/Dialog/DialogContentComponent.vue';
    import type {AxiosResponse} from "axios";
    import XIcon from "@/components/Icons/XIcon.vue";

    type WorkOrderFormType = {
        customer_id: number | null;
        code: string | null;
        date: string | null;
        validity: string | null;
        description: string | null;
        items: WorkOrderFormItemsType[];
        attachments: WorkOrderFormAttachmentsType[];
    };

    type WorkOrderFormItemsType = {
      description: string;
      quantity: number;
      price: string;
    };

    type WorkOrderFormAttachmentsType = {
        file: File;
    };

    const customerService = useCustomerService();

    const openCustomerDialog = ref<boolean>(false);
    const customers = ref([]);
    const customerForm = reactive<CustomerFormType>({
        type: 'cpf',
        first_name: '',
        last_name: '',
        cpf: null,
        cnpj: null,
        name: '',
        legal_name: '',
        addresses: [],
        contacts: [],
    });

    const loading = ref<boolean>(false);
    const submitting = ref<boolean>(false);
    const editMode = ref<boolean>(false);
    const form = reactive<WorkOrderFormType>({
      customer_id: null,
      code: null,
      date: null,
      description: null,
      validity: null,
      items: [],
      attachments: [],
    });

    function loadCustomers() {
        loading.value = true;
        customerService
            .index()
            .then((response: AxiosResponse) => {
                customers.value = response.data?.data ?? [];
            })
            .finally(() => {
                loading.value = false;
            });
    }

    function onSubmit() {
        submitting.value = true;
        console.log(form);
    }

    function handleAddItem() {
      form.items.push({
        description: '',
        quantity: 1,
        price: '',
      });
    }

    function handleRemoveItem(index: number) {
      form.items.splice(index, 1);
    }

    onMounted(() => {
        loadCustomers();
    });
</script>

<template>
    <form @submit.prevent="onSubmit">
        <PageHeaderComponent :title="editMode ? 'Editar Ordem de Serviço' : 'Cadastrar Ordem de Serviço'">
            <template #rightCol>
                <RouterLink
                    to="/work-orders"
                    class="btn btn--white"
                >
                    <ArrowNarrowLeft class="size-5" />
                    Voltar
                </RouterLink>

                <button
                    type="submit"
                    class="ml-3 btn btn--primary"
                    :disabled="submitting || loading"
                >
                    <LoaderIcon
                        v-if="submitting"
                        class="size-5"
                    />
                    Salvar
                </button>
            </template>
        </PageHeaderComponent>

        <PageContentComponent>
            <LoadingComponent :loading="loading">
              <div class="flex flex-col gap-y-12">
                <div class="form-card-container">
                    <div>
                        <h2 class="form-card-title">Cliente</h2>
                    </div>
                    <div class="form-card flex flex-col gap-6">
                        <div class="form-card--grid">
                            <div class="sm:col-span-3">
                                <SelectCombo
                                    v-model="form.customer_id"
                                    :options="customers"
                                    :disabled="submitting"
                                />
                            </div>

                            <button
                                type="button"
                                class="btn btn--white"
                                title="Cadastrar novo cliente"
                                @click="openCustomerDialog = true"
                            >
                                <PlusIcon class="size-5" />
                                Novo Cliente
                            </button>
                        </div>

                        <div class="relative grid grid-cols-[100px_1fr] gap-3 border bg-gray-50 p-4 rounded-md">
                            <div class="label">Nome</div>
                            <div>Denisbeder Duek Carvalho</div>

                            <div class="label">CPF</div>
                            <div>024.852.511-50</div>

                            <div class="label">Telefone</div>
                            <div>(67) 99694-8065 <small>(Whatsapp)</small></div>

                            <div class="label">E-mail</div>
                            <div>denisbeder@gmail.com</div>

                            <div class="label">Endereço</div>
                            <div>Rua Clovis Cersozimo de Souza, 5620, 79831-383, Jardim Piratininga, Dourados-MS</div>
                        </div>
                    </div>
                </div>

                <div class="form-card-container">
                    <div>
                        <h2 class="form-card-title">Dados da Ordem de Serviço</h2>
                    </div>
                  <div class="form-card form-card--grid">
                    <div class="sm:col-span-1">
                      <label
                        for="code"
                        class="label"
                      >
                        Código
                      </label>
                      <input
                        id="code"
                        v-model="form.code"
                        type="text"
                        name="code"
                        autocomplete="off"
                        class="form-input mt-2"
                        :disabled="submitting"
                      />
                    </div>

                    <div class="sm:col-span-1">
                      <label
                        for="date"
                        class="label"
                      >
                        Data
                      </label>
                      <input
                        id="date"
                        v-model="form.date"
                        type="date"
                        name="date"
                        autocomplete="off"
                        class="form-input mt-2"
                        :disabled="submitting"
                      />
                    </div>

                    <div class="sm:col-span-1">
                      <label
                        for="validity"
                        class="label"
                      >
                        Válido até
                      </label>
                      <input
                        id="validity"
                        v-model="form.validity"
                        type="date"
                        name="validity"
                        autocomplete="off"
                        class="form-input mt-2"
                        :disabled="submitting"
                      />
                    </div>

                    <div class="sm:col-span-6">
                      <label
                        for="description"
                        class="label"
                      >
                        Descrição do serviço
                      </label>
                      <textarea
                        id="description"
                        v-model="form.description"
                        type="text"
                        name="description"
                        autocomplete="off"
                        class="form-input mt-2"
                        rows="3"
                        :disabled="submitting"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div class="form-card-container">
                  <div>
                    <h2 class="form-card-title">Items</h2>
                  </div>
                  <div class="form-card flex flex-col gap-8">
                    <div
                      v-for="(item, index) in form.items"
                      :key="`item_${index}`"
                      class="relative flex gap-5 border bg-gray-50 p-4 rounded-md"
                    >
                      <div class="font-bold text-xl text-primary">
                        {{ index + 1}}
                      </div>

                      <div class="grid grid-cols-2 sm:grid-cols-6 gap-3 ">
                        <div class="col-span-full">
                          <label
                            for="item-name"
                            class="label"
                          >
                            Descrição do serviço ou produto
                          </label>
                          <textarea
                            id="item-name"
                            v-model="item.description"
                            rows="1"
                            placeholder="Ex: Instalação ar-condicionado 18000 BTUs"
                            class="form-input mt-2 resize-none"
                            style="field-sizing: content;"
                            :name="`item_name[${index}]`"
                            :disabled="submitting"
                          ></textarea>
                        </div>

                        <div class="sm:col-span-1">
                          <label
                            for="item-quantity"
                            class="label"
                          >
                            Qtd.
                          </label>
                          <input
                            id="item-quantity"
                            v-model="item.quantity"
                            type="number"
                            autocomplete="off"
                            class="form-input mt-2"
                            :name="`item_quantity[${index}]`"
                            :disabled="submitting"
                          />
                        </div>

                        <div class="sm:col-span-1">
                          <label
                            for="item-price"
                            class="label"
                          >
                            Preço unitário
                          </label>
                          <input
                            id="item-price"
                            v-model="item.price"
                            type="number"
                            autocomplete="off"
                            class="form-input mt-2"
                            :name="`item_price[${index}]`"
                            :disabled="submitting"
                          />
                        </div>

                        <div class="col-span-full md:col-span-1">
                        <span
                          for="item-total"
                          class="label"
                        >
                          Total
                        </span>
                          <span class="block py-1.5 mt-2 leading-none text-xl font-semibold">R$ 0,00</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        title="Remover Item"
                        class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 btn btn--square btn--white btn--sm"
                        @click="handleRemoveItem(index)"
                      >
                        <XIcon class="size-8" />
                      </button>
                  </div>

                    <button
                      type="button"
                      class="btn btn--primary-soft"
                      :disabled="submitting"
                      @click="handleAddItem"
                    >
                      <PlusIcon class="size-4" /> Add Item
                    </button>
                  </div>
                </div>
              </div>
            </LoadingComponent>
        </PageContentComponent>
    </form>

    <DialogComponent
        v-model="openCustomerDialog"
        title="Cadastrar novo cliente"
        size="5xl"
    >
        <DialogContentComponent
            class="bg-gray-50"
            :border-top="true"
        >
            <CustomerFormInputsComponent
                v-model="customerForm"
                :submitting="submitting"
                :edit-mode="false"
            />
        </DialogContentComponent>

        <template #footer>
            <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 px-4 sm:px-6 sm:flex sm:flex-row-reverse border-t -mx-4 sm:-mx-6">
                <button
                    type="button"
                    class="w-full sm:ml-3 sm:w-auto btn btn--primary"
                    @click="openCustomerDialog = true"
                >
                    Salvar
                </button>
                <button
                    type="button"
                    class="mt-3 w-full sm:mt-0 sm:w-auto btn btn--white"
                    @click="openCustomerDialog = false"
                >
                    Cancelar
                </button>
            </div>
        </template>
    </DialogComponent>
</template>
