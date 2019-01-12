/**
 * 请注意，相似的路径写在一起，并用「一个」空行隔开
 */
export default [
  // 账户管理 - 账号信息
  {
    path: '/account/info',
    name: 'account-info',
    component: () => import('./views/account/info/index.vue'),
  },
  {
    path: '/account/info/edit',
    name: 'account-info-edit',
    component: () => import('./views/account/info/edit.vue'),
  },
  // 账户管理 - 账号信息-账户编辑
  {
    path: '/account/info/accedit',
    name: 'account-info-accedit',
    component: () => import('./views/account/info/accEdit.vue'),
  },

  // 账户管理 - 用户管理
  {
    path: '/account/user',
    name: 'account-user',
    component: () => import('./views/account/user/index.vue'),
  },
  // 账户管理 - 用户管理 - 添加子用户
  {
    path: '/account/user/add',
    name: 'account-user-add',
    component: () => import('./views/account/user/addUser.vue')
  },
  // 账户管理 - 用户管理 - 编辑
  {
    path: '/account/user/edit/:useid',
    name: 'account-user-edit',
    component: () => import('./views/account/user/editUser.vue')
  },
  // 账户管理 - 用户管理 - 查看
  {
    path: '/account/user/detail/:useid',
    name: 'account-user-detail',
    component: () => import('./views/account/user/detailUser.vue')
  },

  // 账户管理 - 权限管理
  {
    path: '/account/auth',
    name: 'account-auth',
    component: () => import('./views/account/auth/index.vue'),
  },
  // 账户管理 - 权限管理 - 添加子用户
  {
    path: '/account/auth/add/:id',
    name: 'account-auth-add',
    component: () => import('./views/account/auth/addRole.vue')
  },
  // 账户管理 - 权限管理 - 查看
  {
    path: '/account/auth/detail/:id',
    name: 'account-auth-detail',
    component: () => import('./views/account/auth/detailRole.vue')
  },


  // 账户管理 - 影院管理
  {
    path: '/account/cinema',
    name: 'account-cinema',
    component: () => import('./views/account/cinema/index.vue'),
  },
   // 账户管理 - 影院管理 - 查看
   {
    path: '/account/cinema/detail/:id',
    name: 'account-cinema-detail',
    component: () => import('./views/account/cinema/detailCinema.vue')
  },

  // 账户管理 - 修改密码
  {
    path: '/account/password',
    name: 'account-password',
    component: () => import('./views/account/password/index.vue'),
  },

  // 财务信息 - 财务信息  - 查看
  {
    path: '/finance/info',
    name: 'finance-info',
    component: () => import('./views/finance/info/index.vue'),
  },
  // 财务信息 - 财务信息  - 更多数据
  {
    path: '/finance/info/more',
    name: 'finance-info-more',
    component: () => import('./views/finance/info/moreList.vue'),
  },

  // 推广管理 - 广告计划 - 创建广告计划
  {
    path: '/pop/plan',
    name: 'pop-plan',
    component: () => import('./views/pop/plan/index.vue'),
  },
  // 推广管理 - 广告计划 - 生成广告方案
  {
    path: '/pop/plan/scheme/:id?',
    name: 'pop-plan-scheme',
    component: () => import('./views/pop/pages/index.vue'),
  },

  // 数据报表 - 投放成效报告
  {
    path: '/report/plan/:id?',
    name: 'report-plan',
    component: () => import('./views/report/plan/index.vue'),
  },

  // 示例，没有实际用处
  {
    path: '/about',
    name: 'about',
    component: () => import('./views/about.vue'),
  },
] as any[]
