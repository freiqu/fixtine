import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import i18n from './lib/i18n.ts';
import 'primeflex/primeflex.css';
import './styles.css';
import 'primeicons/primeicons.css';

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(i18n);
app.mount('#app');
