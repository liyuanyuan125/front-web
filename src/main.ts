// NOTE: hooks 必须放在任何 vue 代码之前才有效
import '@/util/hooks'
import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import app from './app.vue'
import Router from 'vue-router'
import home from './views/home.vue'
// 将登陆注册等模块「静态」到主文件中，以便用户更流畅
import login from './views/portal/login.vue'
import PortalLayout from './views/portal/layout.vue'
import RegisterLayout from './views/portal/registerLayout.vue'
import register from './views/portal/register.vue'
import registerComplete from './views/portal/registerComplete.vue'
import MainLayout from './site/MainLayout.vue'
import locale from 'iview/dist/locale/zh-CN'
import event from './fn/event'
import { alert } from './ui/modal'
import LazyInput from '@/components/LazyInput'
import { hasLogin } from './store'
import routes from './routes'

Vue.use(Router)

// 设置星期一为一周开始
locale.i.datepicker.weekStartDay = '1'
Vue.use(iView, { locale })

// 全局注册一些常用组件
Vue.component('LazyInput', LazyInput)

Vue.config.productionTip = false

const router = new Router({
  mode: 'history',
  // 非 MainLayout 页面放在这里，MainLayout 页面放在 routes 里
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/portal-layout',
      name: 'portal-layout',
      component: PortalLayout,
      children: [
        {
          path: '/register-layout',
          name: 'register',
          component: RegisterLayout,
          children: [
            {
              path: '/register',
              name: 'register',
              component: register
            },
            {
              path: '/register/complete',
              name: 'registerComplete',
              component: registerComplete
            },
          ]
        },
        {
          path: '/resetpwd',
          name: 'resetpwd',
          component: () => import('./views/portal/resetpwd.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'main-layout',
      component: MainLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: home,
        }
      ].concat(routes),
    }
  ]
})

iView.LoadingBar.config({
  color: '#fe8135',
  width: 6,
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
  // if (!hasLogin() && to.name !== 'login') {
  //   next({ name: 'login' })
  // // } else if (!store.getters.canSee(to.name)) {
  // //   next({ name: '403' })
  // } else {
  //   next()
  // }
})

router.afterEach((to, from) => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

event.on({
  ajax401(ev: any) {
    ev.handled = true
    // router.push({ name: 'login' })
  },

  ajax403(ev: any) {
    ev.handled = true
    alert('权限不足')
  }
})

new Vue({
  router,
  render: h => h(app),
}).$mount('#app')
