import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Admin from '../views/Admin.vue'

const base = '/sample-applications/spot-the-ball/'

const router = createRouter({
  history: createWebHistory(base),
  routes: [
    {
      path: base,
      name: 'home',
      component: Home
    },
    {
      path: base + 'auth',
      name: 'auth',
      component: Auth
    },
    {
      path: base + 'admin',
      name: 'admin',
      component: Admin
    }
  ]
})

export default router
