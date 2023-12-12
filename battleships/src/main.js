import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'; // make sure the path is correct

const pinia = createPinia()

createApp(App).use(ElementPlus).use(pinia).use(router).mount('#app')
