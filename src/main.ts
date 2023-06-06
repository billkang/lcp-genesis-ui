import { createApp } from 'vue/dist/vue.esm-browser';
import GenesisUI from './entry';
import App from '../Demo/App.vue';

const app = createApp(App);
app.use(GenesisUI);
app.mount('#app');
