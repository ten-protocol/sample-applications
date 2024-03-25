import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import Competition from '../views/CompetitionPage.vue'

const base = '/sample-applications/guessing-game-v2/'

const router = createRouter({
  history: createWebHistory(base),
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
