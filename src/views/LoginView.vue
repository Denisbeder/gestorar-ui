<script setup lang="ts">
import {reactive, ref} from 'vue'
import { useHTTP, useCSRF } from '@/composable/useHTTP.ts'
import { useErrorHandle } from "@/composable/useErrorHandle.ts";
import { useUserStore } from "@/stores/user.ts";
import {useRouter, useRoute} from "vue-router";

const http = useHTTP()
const errorHandle = useErrorHandle()
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const isLoading = ref(false)
const form = reactive({ email: 'admin@email.com', password: 'password' })

async function handleSubmit() {
  isLoading.value = true;

  try {
    await http.post('/login', form);
    await userStore.getUser();
    await router.push(route.query?.redirect ?? 'dashboard');
  } catch (error) {
    errorHandle.show(error);
  } finally {
    isLoading.value = false;
  }
}

</script>

<template>
  <main>
    <form @submit.prevent="handleSubmit">
      <input :disabled="isLoading" type="text" name="email" autocomplete="email" v-model="form.email" />
      <input :disabled="isLoading" type="password" name="password" autocomplete="current-password" v-model="form.password" />

      <button :disabled="isLoading" type="submit">Enviar</button>
    </form>
  </main>
</template>
