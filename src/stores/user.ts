import { ref} from 'vue';
import { defineStore } from 'pinia';
import {useHTTP} from "@/composable/useHTTP.ts";

const http = useHTTP();

export const useUserStore = defineStore('user', () => {
  const user = ref();
  const isAuthenticated = ref(false);

  async function getUser() {
      const response = await http.get('/api/user');

      user.value = response.data;

      isAuthenticated.value = true;
  }

  return { user, isAuthenticated, getUser }
})
