import {computed, ref} from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isAuthenticated = computed(() => {
    return Boolean(JSON.parse(localStorage.getItem('is_authenticated')));
  })

  function setIsAuthenticated(value) {
    localStorage.setItem('is_authenticated', value);
  }

  return { isAuthenticated, setIsAuthenticated }
})
