import { createRouter, createWebHistory } from 'vue-router'
import { pages } from './pages'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: pages
})

export default router
