import { createApp } from 'vue'
import App from './App.vue'
import JsonViewer from 'vue-json-viewer'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).use(JsonViewer).mount('#app')
