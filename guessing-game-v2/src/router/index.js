import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import Competition from '../views/CompetitionPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/competition',
      name: 'competition',
      component: Competition
    }
  ]
})

export default router
