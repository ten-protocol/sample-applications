import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

// const base = '/sample-applications/battleship-game/'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})

export default router
