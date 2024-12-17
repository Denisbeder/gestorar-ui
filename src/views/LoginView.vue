<script setup lang="ts">
import { reactive } from 'vue'
import { useHTTP, useCSRF } from '@/composable/useHTTP.ts'
import { useErrorHandle } from "@/composable/useErrorHandle.ts";
import { useUserStore } from "@/stores/user.ts";

const http = useHTTP()
const errorHandle = useErrorHandle()
const userStore = useUserStore();

const form = reactive({ email: '', password: '' })

async function handleSubmit() {
  await useCSRF()

  http.post('/login', form).then((response) => {
    console.log('then', response)
    userStore.setIsAuthenticated(true);
  }).catch(errorHandle.show)
}
</script>

<template>
  <main>
    <form @submit.prevent="handleSubmit">
      <input type="text" name="email" autocomplete="email" v-model="form.email" />
      <input type="password" name="password" autocomplete="current-password" v-model="form.password" />

      <button type="submit">Enviar</button>
    </form>
  </main>
</template>
