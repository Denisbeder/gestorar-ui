<script setup lang="ts">
import { reactive } from 'vue'
import { useHTTP, useCSRF } from '@/composable/useHTTP.ts'

const http = useHTTP()

const form = reactive({ email: '', password: '' })

async function handleSubmit() {
  await useCSRF()
  await http.post('/login', form).then((response) => {
    console.log(response)
  })
}
</script>

<template>
  <main>
    <form @submit.prevent="handleSubmit">
      <input type="text" name="email" v-model="form.email" />
      <input type="password" name="password" v-model="form.password" />

      <button type="submit">Enviar</button>
    </form>
  </main>
</template>
