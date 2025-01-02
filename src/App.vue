<script setup lang="ts">
    import { RouterView } from 'vue-router';
    import DefaultLayout from "@/layouts/DefaultLayout.vue";
</script>

<template>
  <component :is="$route.meta.layout || DefaultLayout">
    <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.fullPath" />
    </router-view>
  </component>
</template>
