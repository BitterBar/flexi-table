import { createRouter, createWebHistory } from 'vue-router'
import Swapper from '@/views/Swapper'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'swapper',
      component: Swapper,
    },
  ],
})

export default router
