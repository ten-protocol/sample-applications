import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Admin from '../views/Admin.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/sample-applications/spot-the-ball/',
      name: 'home',
      component: Home
    },
    {
      path: '/sample-applications/spot-the-ball/auth',
      name: 'auth',
      component: Auth
    },
    {
      path: '/sample-applications/spot-the-ball/admin',
      name: 'admin',
      component: Admin
    }
  ]
})

export default router
