import Vue from 'vue'
import Router from 'vue-router'

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/register.vue')
    },
    {
      path: '/regsucess',
      name: 'regsucess',
      component: () => import('./components/register/regsucess.vue')
    },
  ]
})

export default router
