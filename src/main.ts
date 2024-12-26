import '@/assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useAuthService } from '@/composable/useAuthService.ts';
import App from './App.vue';
import router from './router';

const { getUser } = useAuthService();
const app = createApp(App);

getUser().finally(() => {
    app.use(createPinia());
    app.use(router);
    app.mount('#app');
});
