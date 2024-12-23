import '@/assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useAuth } from '@/composable/useAuth.ts';
import App from './App.vue';
import router from './router';

const { getUser } = useAuth();
const app = createApp(App);

getUser().finally(() => {
    app.use(createPinia());
    app.use(router);
    app.mount('#app');
});
