import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserType | null>(null)
  const isAuthenticated = computed<boolean>(() => user.value !== null)

  return { user, isAuthenticated }
})
