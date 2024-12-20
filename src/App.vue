<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies';

const cookies = useCookies()

function handleLogout() {
  cookies.remove('XSRF-TOKEN')
}
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/dashboard">Dashboard</RouterLink>
      <RouterLink to="/login">Entrar</RouterLink>
      <button @click="handleLogout">Sair</button>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
}
</style>
