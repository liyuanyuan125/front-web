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
      component: () => import('./views/register/regsucess.vue')
    },
    {
      path: '/forgetpass',
      name: 'forgetpass',
      component: () => import('./views/forgetPassword.vue')
    }
  ]
})

export default router
