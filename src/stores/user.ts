import {computed, ref} from 'vue';
import { defineStore } from 'pinia';
import {useHTTP} from "@/composable/useHTTP.ts";

const http = useHTTP();

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const isAuthenticated = computed(() => user.value !== null);

  async function getUser() {
    try {
      user.value = await http.get('/api/user');
    } catch(error) {
      user.value = null;

      throw error;
    }
  }

  return { user, isAuthenticated, getUser }
})
