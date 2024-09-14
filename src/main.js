import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Varlet from '@varlet/ui'
import '@varlet/ui/es/style'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(Varlet)
app.use(pinia)

app.mount('#app')
