// 将登陆注册等模块「静态」到主文件中，以便用户更流畅
import home from './views/home.vue'
import login from './views/portal/login/index.vue'
import register from './views/portal/register.vue'
import registerComplete from './views/portal/registerComplete.vue'
import activeEmail from './views/portal/activeEmail.vue'
import registerSuccess from './views/portal/registerSuccess.vue'
import MainLayout from './views/layout/MainLayout.vue'
import Error from './views/error/index.vue'

import { RouteConfig, Route, Location } from 'vue-router'
import { devInfo, devError } from './util/dev'

/**
 * 面包屑
 */
export interface Breadcrumb {
  label: string
  route?: Location
}

/**
 * 面包屑导航获取函数
 */
export type GetBreadcrumb = (route: Route) => Breadcrumb[]

/**
 * meta 类型：基础类型，可以放一些别的成员
 */
// tslint:disable-next-line:no-empty-interface
export interface RouteMetaBase {
  /**
   * 页面标题
   */
  title?: string | ((route: Route) => string)

  /**
   * 明确的面包屑导航，若不提供，则自动判断，若不需要，设置为 []
   */
  breadcrumbs?: Breadcrumb[] | GetBreadcrumb
}

/**
 * meta 类型成员，标记是否不需要登录，与 authKey 互斥
 */
export interface RouteMetaUnauth extends RouteMetaBase {
  /**
   * 标记是否不需要登录（注意不是不需要验证）
   */
  unauth: true
}

/**
 * RouteMetaAuth 中 authAction 也可以为函数，该函数即是它的签名
 * @param route 当前页面的 route
 * @returns 权限字符串
 */
export type AuthActionFunction = (route: Route) => string

/**
 * meta 类型成员，标记权限对应的 key，与 unauth 互斥
 */
export interface RouteMetaAuth extends RouteMetaBase {
  /**
   * 权限对应的全路径 key，用来权限控制
   * 注意：这里不要带前缀 ads. 或 resource. 等 systemCode 前缀
   * 参见 https://zentao.aiads.com/index.php?m=story&f=view&storyID=82
   */
  authKey: string

  /**
   * 权限对应的操作，每个页面必须精确到操作（减少出错的机会），即：
   * 1、在 authKey 不为空的情况下，该字段不能为空
   * 2、但有些简单页面，例如首页，确实存在没有 actions，此时可以用 EMPTY 占位
   * 参见上面的 authKey 中的链接
   */
  authAction: string | AuthActionFunction

  /**
   * 标记是否为菜单
   */
  authIsMenu?: true
}

/** 标记不需要登录 */
const unauth: RouteMetaUnauth = {
  unauth: true
}

/** 占位，不需要验证 */
const emptyAuth: RouteMetaAuth = {
  authKey: '',
  authAction: '',
}

/** 标准化 Meta 的类型 */
export type RouteMeta = RouteMetaUnauth | RouteMetaAuth

/**
 * 重新定义 meta，使 meta 的类型更具体
 */
export interface RouteConfigEnhance extends RouteConfig {
  /** route name，变成必须提供 */
  name: string
  /** 附加信息，变成必须提供 */
  meta: RouteMeta
}

/**
 * 单独的 routes
 *
 * 请注意，相似的路径写在一起，并用「一个」空行隔开
 */
const singleRoutes: RouteConfigEnhance[] = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: unauth
  },

  // 激活邮箱
  {
    path: '/account-activate/:id',
    name: 'account-activate',
    component: activeEmail,
    meta: unauth
  },

  // 注册
  {
    path: '/register',
    name: 'register',
    component: register,
    meta: unauth
  },

  // 注册完成信息
  {
    path: '/register/complete',
    name: 'register-complete',
    component: registerComplete,
    meta: unauth
  },

  // 注册成功
  {
    path: '/register/success',
    name: 'register-success',
    component: registerSuccess,
    meta: unauth
  },

  // 重置密码
  {
    path: '/resetpwd',
    name: 'resetpwd',
    component: () => import('./views/portal/resetpwd.vue'),
    meta: unauth
  },
] // end of singleRoutes

/**
 * 放在 mainLayout 中的 routes
 *
 * 请注意，相似的路径写在一起，并用「一个」空行隔开
 *
 * TODO: 所有页面均要平坦化，不要使用 children
 * 若需要使用 children，下面注入「没有权限」的代码也需要修改
 */
const mainLayoutRoutes: RouteConfigEnhance[] = [
  // 管理首页
  {
    path: '/',
    name: 'home',
    component: home,
    meta: {
      authKey: 'index',
      authAction: 'EMPTY',
      authIsMenu: true,
    }
  },

  // 广告主 - 账户概览
  {
    path: '/home/overview',
    name: 'home-overview',
    component: () => import('./views/home/overview/index.vue'),
    meta: {
      ...emptyAuth,
      breadcrumbs: [{ label: '首页' }]
    }
  },

  // 资源方 - 账户概览
  {
    path: '/home/resoverview',
    name: 'home-resoverview',
    component: () => import('./views/home/resoverview/index.vue'),
    meta: {
      ...emptyAuth,
      breadcrumbs: [{ label: '首页' }]
    }
  },

  // 广告主、资源方 - 账户管理 - 账号信息
  {
    path: '/account/info',
    name: 'account-info',
    component: () => import('./views/account/info/index.vue'),
    meta: {
      authKey: 'account-manage.info',
      authAction: 'view',
      authIsMenu: true,
    }
  },

  // TODO: 下面两个页面应该合并在一起？还是涉及权限，应该拆开以方便控制？

  // 广告主、资源方 - 账户管理 - 账户编辑（全部信息编辑）
  {
    path: '/account/info/edit',
    name: 'account-info-edit',
    component: () => import('./views/account/info/edit.vue'),
    meta: {
      authKey: 'account-manage.info',
      authAction: 'edit',
    }
  },

  // 广告主、资源方 - 账户管理 - 账户编辑（基本信息编辑）
  {
    path: '/account/info/accedit',
    name: 'account-info-accedit',
    component: () => import('./views/account/info/accEdit.vue'),
    meta: {
      authKey: 'account-manage.info',
      authAction: 'edit',
    }
  },

  // 广告主、资源方 - 账户管理 - 用户管理
  {
    path: '/account/user',
    name: 'account-user',
    component: () => import('./views/account/user/index.vue'),
    meta: {
      authKey: 'account-manage.users',
      authAction: 'viewList',
      authIsMenu: true,
    }
  },

  // 广告主、资源方 - 账户管理 - 用户管理 - 添加子用户
  {
    path: '/account/user/add',
    name: 'account-user-add',
    component: () => import('./views/account/user/addUser.vue'),
    meta: {
      authKey: 'account-manage.users',
      authAction: 'create',
    }
  },

  // 广告主、资源方 - 账户管理 - 用户管理 - 编辑
  {
    path: '/account/user/edit/:useid',
    name: 'account-user-edit',
    component: () => import('./views/account/user/editUser.vue'),
    meta: {
      authKey: 'account-manage.users',
      authAction: 'edit',
    }
  },

  // 广告主、资源方 - 账户管理 - 用户管理 - 查看
  {
    path: '/account/user/detail/:useid',
    name: 'account-user-detail',
    component: () => import('./views/account/user/detailUser.vue'),
    meta: {
      authKey: 'account-manage.users',
      authAction: 'view',
    }
  },

  // 广告主、资源方 - 账户管理 - 查看子用户 - 日志
  {
    path: '/account/user/detail/log/:id',
    name: 'account-user-detail-log',
    component: () => import('./views/account/user/logList.vue'),
    meta: {
      authKey: 'account-manage.users',
      authAction: 'view',
    }
  },

  // 广告主、资源方 - 账户管理 - 权限管理
  {
    path: '/account/auth',
    name: 'account-auth',
    component: () => import('./views/account/auth/index.vue'),
    meta: {
      authKey: 'account-manage.roles',
      authAction: 'viewList',
      authIsMenu: true,
    }
  },

  // 广告主、资源方 - 账户管理 - 权限管理 - 添加角色
  {
    path: '/account/auth/add/:id?',
    name: 'account-auth-add',
    component: () => import('./views/account/auth/addRole.vue'),
    meta: {
      authKey: 'account-manage.roles',
      authAction(route) {
        const id = parseInt(route.params.id, 10) || 0
        return id > 0 ? 'edit' : 'create'
      }
    }
  },

  // 广告主、资源方 - 账户管理 - 权限管理 - 查看
  {
    path: '/account/auth/detail/:id',
    name: 'account-auth-detail',
    component: () => import('./views/account/auth/detailRole.vue'),
    meta: {
      authKey: 'account-manage.roles',
      authAction: 'view',
    }
  },

  // 资源方 - 账户管理 - 影院管理
  {
    path: '/account/cinema',
    name: 'account-cinema',
    component: () => import('./views/account/cinema/index.vue'),
    meta: {
      authKey: 'account-manage.managecinema',
      authAction: 'viewList',
      authIsMenu: true,
    }
  },

   // 资源方 - 账户管理 - 影院管理 - 查看
   {
    path: '/account/cinema/detail/:id',
    name: 'account-cinema-detail',
    component: () => import('./views/account/cinema/detailCinema.vue'),
    meta: {
      authKey: 'account-manage.managecinema',
      authAction: 'view',
    }
  },

  // 广告主、资源方 - 账户管理 - 修改密码
  {
    path: '/account/password',
    name: 'account-password',
    component: () => import('./views/account/password/index.vue'),
    meta: {
      authKey: 'account-manage.changePassword',
      authAction: 'EMPTY',
      authIsMenu: true,
    }
  },

  // 广告主 - 财务信息 - 财务信息 - 查看
  {
    path: '/finance/info',
    name: 'finance-info',
    component: () => import('./views/finance/info/index.vue'),
    meta: {
      authKey: 'financial-manage.info',
      authAction: 'viewSummary',
      authIsMenu: true,
    }
  },

  // 广告主 - 财务信息 - 财务信息 - 更多数据（查看充值记录）
  {
    path: '/finance/info/more',
    name: 'finance-info-more',
    component: () => import('./views/finance/info/moreList.vue'),
    meta: {
      authKey: 'financial-manage.info',
      authAction: 'viewList',
    }
  },

  // 广告主 -财务管理 - 资金账单
  {
    path: '/finance-bill',
    name: 'finance-bill',
    component: () => import('./views/finance/bill/index.vue'),
    meta: {
      authKey: 'financial-manage.bill',
      authAction: 'view',
      authIsMenu: true,
    }
  },

  // 广告主 - 推广管理 - 广告计划 - 计划列表
  {
    path: '/pop/planlist',
    name: 'pop-planlist',
    component: () => import('./views/pop/plan/planlist.vue'),
    meta: {
      authKey: 'promotion.ad-plan',
      authAction: 'viewList',
      authIsMenu: true,
    }
  },

  // TODO: 下面的两个页面应该合成一个

  // 广告主 - 推广管理 - 广告计划 - 详情（草稿、拒绝、已取消状态下）
  {
    path: '/pop/planlist/default/:id',
    name: 'pop-planlist-default',
    component: () => import('./views/pop/plan/default/planDefault.vue'),
    meta: {
      authKey: 'promotion.ad-plan',
      authAction: 'view',
    }
  },

  // 广告主 - 推广管理 - 广告计划 - 详情（其他状态下）
  {
    path: '/pop/planlist/defaultpayment/:id',
    name: 'pop-planlist-defaultpayment',
    component: () => import('./views/pop/plan/default/defaultPayment.vue'),
    meta: {
      authKey: 'promotion.ad-plan',
      authAction: 'view',
    }
  },

  // 推广管理 - 广告计划 - 编辑
  // TODO: 应该是 demo 分支搞出来的，注释掉，等确认了，再彻底删除
  // {
  //   path: '/pop/plan-edit/:id?',
  //   name: 'pop-plan-edit',
  //   component: () => import('./views/pop/plan/edit/index.vue'),
  //   meta: {
  //     authKey: 'promotion.ad-plan',
  //     authAction: 'edit',
  //   }
  // },

  // 广告主 - 推广管理 - 广告计划 - 创建广告计划
  {
    path: '/pop/planlist/add/:id?',
    name: 'pop-planlist-add',
    component: () => import('./views/pop/plan/index.vue'),
    meta: {
      authKey: 'promotion.ad-plan',
      authAction(route) {
        const id = parseInt(route.params.id, 10) || 0
        return id > 0 ? 'edit' : 'create'
      },
      title({ params }) {
        return parseInt(params.id, 10) > 0 ? '编辑广告计划' : '新建广告计划'
      }
    }
  },

  // // 广告主 - 推广管理 - 广告计划 - 生成广告方案
  // {
  //   path: '/pop/plan/scheme/:id/:key',
  //   name: 'pop-plan-scheme',
  //   component: () => import('./views/pop/pages/index.vue'),
  //   meta: {
  //     authKey: 'promotion.ad-plan',
  //     authAction(route) {
  //       const id = parseInt(route.params.id, 10) || 0
  //       return id > 0 ? 'edit' : 'create'
  //     }
  //   }
  // },

  // 广告主 - 推广管理 - 广告片 - 列表
  {
    path: '/pop/film',
    name: 'pop-film',
    component: () => import('./views/pop/film/index.vue'),
    meta: {
      authKey: 'promotion.ad-video',
      authAction: 'viewList',
      authIsMenu: true,
    }
  },

  // 广告主 - 推广管理 - 广告片 - 创建、编辑（存在 id 为编辑，否则为创建）
  {
    path: '/pop/film/edit/:id?',
    name: 'pop-film-edit',
    component: () => import('./views/pop/film/edit.vue'),
    meta: {
      authKey: 'promotion.ad-video',
      authAction(route) {
        const id = parseInt(route.params.id, 10) || 0
        return id > 0 ? 'edit' : 'create'
      }
    }
  },

  // 广告主 - 推广管理 - 广告片 - 查看
  {
    path: '/pop/film/detail/:id',
    name: 'pop-film-detail',
    component: () => import('./views/pop/film/detail.vue'),
    meta: {
      authKey: 'promotion.ad-video',
      authAction: 'view',
    }
  },

  // 广告主 - 广告单管理 - 广告单列表
  {
    path: '/order/dispatch',
    name: 'order-dispatch',
    component: () => import('./views/order/dispatch/index.vue'),
    meta: {
      authKey: 'adOrderManage.order',
      authAction: 'view',
      authIsMenu: true,
    }
  },
  // 资源方-广告单-广告详情
  {
    path: '/order/dispatch-details/:id',
    name: 'order-dispatch-details',
    component: () => import('./views/order/dispatch/details.vue'),
    meta: {
      authKey: '',
      authAction: 'view',
      authIsMenu: true,
    }
  },

  // TODO: 下面的两个页面应该合并

  // 广告主 - 广告单管理 - 执行单列表
  {
    path: '/order/execute',
    name: 'order-execute',
    component: () => import('./views/order/execute/index.vue'),
    meta: {
      authKey: 'adOrderManage.execute',
      authAction: 'view',
      authIsMenu: true,
    }
  },

  {
    path: '/order/execute/:id',
    name: 'order-execute-xq',
    component: () => import('./views/order/execute/index.vue'),
    meta: {
      authKey: 'adOrderManage.execute',
      authAction: 'view',
    }
  },

  // 资源方 - 广告单管理 - 上刊管理
   {
    path: '/order/lastissue',
    name: 'order-lastissue',
    component: () => import('./views/order/lastissue/index.vue'),
    meta: emptyAuth,
  },

  // 资源方 - 广告单管理 - 监播管理
   {
    path: '/order/supervision',
    name: 'order-supervision',
    component: () => import('./views/order/supervision/index.vue'),
    meta: emptyAuth,
  },

  // 广告主 - 广告单管理 - DCP包列表
  {
    path: '/order/dcp',
    name: 'order-dcp',
    component: () => import('./views/order/dcp/index.vue'),
    meta: {
      authKey: 'adOrderManage.dcp',
      authAction: 'view',
      authIsMenu: true,
    }
  },

  // 广告主 - 广告单管理 - DCP包下载
  {
    path: '/order/dcp/detail/:id',
    name: 'order-dcp-detail',
    component: () => import('./views/order/dcp/detail.vue'),
    meta: {
      authKey: 'adOrderManage.dcp',
      authAction: 'download',
    }
  },

  // 广告主 - 数据报表 - 投放成效报告
  {
    path: '/report/plan/:id?',
    name: 'report-plan',
    component: () => import('./views/report/plan/index.vue'),
    meta: {
      authKey: 'data-report',
      authAction: 'view',
      authIsMenu: true,
    }
  },

  // 资源方 - 财务管理 - 财务信息
  {
    path: '/resfinance/info',
    name: 'resfinance-info',
    component: () => import('./views/resFinance/info/index.vue'),
    meta: {
      authKey: 'financeManage.info',
      authAction: 'viewSummary',
      authIsMenu: true,
    }
  },

  // 资源方 - 效果报表 - 成效报表
   {
    path: '/reseport/info',
    name: 'resreport-info',
    component: () => import('./views/resReport/info/index.vue'),
    meta: emptyAuth,
  },

  // TODO: 下面的两个先不做了

  // 资源方 - 财务管理 - 收益账单
  // {
  //   path: '/resfinance/profitbill',
  //   name: 'resfinance-profitbill',
  //   component: () => import('./views/resFinance/profItBill/index.vue'),
  //   meta: {
  //     authKey: 'financeManage',
  //     authAction: 'viewList',
  //   }
  // },

  // {
  //   path: 'resfinance/mouthbill',
  //   name: 'resfinance-mouthbill',
  //   component: () => import('./views/resFinance/mouthBill/index.vue')
  // },

  // 广告主 - 客户管理 - 客户列表
  {
    path: '/customer/list',
    name: 'customer-list',
    component: () => import('./views/customer/list/index.vue'),
    meta: {
      authKey: 'customer-manage',
      authAction: 'viewList',
      authIsMenu: true,
    }
  },

  // 广告主 - 客户管理 - 新建编辑客户
  {
    path: '/customer/list/edit/:id?',
    name: 'customer-edit',
    component: () => import('./views/customer/list/edit.vue'),
    meta: {
      authKey: 'customer-manage',
      authAction(route) {
        const id = parseInt(route.params.id, 10) || 0
        return id > 0 ? 'edit' : 'create'
      }
    }
  },

  // 广告主 - 客户管理 - 客户详情
  {
    path: '/customer/list/detail/:id',
    name: 'customer-detail',
    component: () => import('./views/customer/list/detail.vue'),
    meta: {
      authKey: 'customer-manage',
      authAction: 'view',
    }
  },


  // 示例，没有实际用处
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */'./views/about.vue'),
    meta: emptyAuth,
  },

  // kol - koll列表
  {
    path: '/kol/kollist',
    name: 'kol-kollist',
    component: () => import('./views/kol/kollist/index.vue'),
    meta: emptyAuth
  },
   // KOL - KOl 订单
   {
    path: '/kol/orderlist',
    name: 'kol-orderlist',
    component: () => import('./views/kol/order/index.vue'),
    meta: emptyAuth
  },

  // KOL - KOL 草稿
  {
      path: '/kol/draft',
      name: 'kol-draft',
      component: () => import('./views/kol/order/draft.vue'),
      meta: emptyAuth
  },

  // kol - KOL详情更多页 - 合作品牌
  {
    path: '/kol/detailMoreInfo/colbrand',
    name: 'kol-detailMoreInfo-colbrand',
    component: () => import('./views/kol/detailMoreInfo/collaborateBrand.vue'),
    meta: emptyAuth
  },

  // kol - KOL详情更多页 - 主要作品
  {
    path: '/kol/detailMoreInfo/masterwork',
    name: 'kol-detailMoreInfo-masterwork',
    component: () => import('./views/kol/detailMoreInfo/masterWork.vue'),
    meta: emptyAuth
  },

  // kol - koll列表
  {
    path: '/kol/shopping',
    name: 'kol-shopping',
    component: () => import('./views/kol/shopping/index.vue'),
    meta: emptyAuth
  },

  // kol - KOL详情更多页 - 平台运营
  {
    path: '/kol/detailMoreInfo/platformInfoData',
    name: 'kol-detailMoreInfo-platformInfoData',
    component: () => import('./views/kol/detailMoreInfo/platformInfoData.vue'),
    meta: emptyAuth
  },
  // KOL - KOL详情更多页 - 口碑评论
  {
    path: '/kol/detailMoreInfo/comment',
    name: 'kol-detailMoreInfo-comment',
    component: () => import('./views/kol/detailMoreInfo/comment.vue'),
    meta: emptyAuth
  },
  // KOL - KOL详情更多页 - 受众匹配
  {
    path: '/kol/detailMoreInfo/matching',
    name: 'kol-detailMoreInfo-matching',
    component: () => import('./views/kol/detailMoreInfo/matching.vue'),
    meta: emptyAuth
  },
  // KOL - KOL详情更多页 - 粉丝画像
  {
    path: '/kol/detailMoreInfo/fans',
    name: 'kol-detailMoreInfo-fans',
    component: () => import('./views/kol/detailMoreInfo/fans.vue'),
    meta: emptyAuth
  },
  // KOL - KOL详情更多页 - 热度趋势
  {
    path: '/kol/detailMoreInfo/trend',
    name: 'kol-detailMoreInfo-trend',
    component: () => import('./views/kol/detailMoreInfo/trend.vue'),
    meta: emptyAuth
  },

  // kol - 详情
  {
    path: '/kol/order/detail/:id',
    name: 'kol-order-detail',
    component: () => import('./views/kol/order/detail.vue'),
    meta: emptyAuth,
  },

  // kol - 检测
  {
    path: '/kol/order/taskDetection/:id',
    name: 'order-order-taskDetection',
    component: () => import('./views/kol/order/taskDetection.vue'),
    meta: emptyAuth,
  },

  // 影片详情 - 主创阵容
  {
    path: '/film/mainLineup/:id',
    name: 'film-mainLineup',
    component: () => import('./views/film/filmorder/mainLineup.vue'),
    meta: emptyAuth,
  },
  // 影片详情 - 详细资料
  {
    path: '/film/detailInfo/:id',
    name: 'film-detailInfo',
    component: () => import('./views/film/filmorder/detailInfo.vue'),
    meta: emptyAuth,
  },
  // 影片 - 影片合作订单列表
  {
    path: '/film/movielist',
    name: 'film-movielist',
    component: () => import('./views/film/filmorder/movielist.vue'),
    meta: emptyAuth,
  },
  // 影片 - 影片合作订单列表添加
  {
    path: '/film/addmovielist',
    name: 'film-addmovielist',
    component: () => import('./views/film/filmorder/addmovielist.vue'),
    meta: emptyAuth,
  },
  // 影片 - 影片合作订单详情
  {
    path: '/film/movielist/detail',
    name: 'film-movielist-detail',
    component: () => import('./views/film/filmorder/moviedetail.vue'),
    meta: emptyAuth,
  },

  // kol - 订单填写
  {
    path: '/kol/orderfill/:id',
    name: 'order-orderfill',
    component: () => import('./views/kol/orderfill/index.vue'),
    meta: emptyAuth,
  },
  // 影片（film）- 影人更多详情 - 合作品牌
  {
    path: '/film/filmmakerdetail/cobrand',
    name: 'film-filmmakerdetail-cobrand',
    component: () => import('./views/film/filmmakerDetails/coBrand.vue'),
    meta: emptyAuth
  },
  // 影片 - 影人更多详情 - 主要作品
  {
    path: '/film/filmmakerdetail/masterwork',
    name: 'film-filmmakerdetail-masterwork',
    component: () => import('./views/film/filmmakerDetails/masterWork.vue'),
    meta: emptyAuth
  },
  // 影片 - 影人更多详情 - 更多资料
  {
    path: '/film/filmmakerdetail/moreinformation',
    name: 'film-filmmakerdetail-moreinformation',
    component: () => import('./views/film/filmmakerDetails/moreInformation.vue'),
    meta: emptyAuth
  }
] // end of mainLayoutRoutes

const errorRoutes: RouteConfigEnhance[] = [
  {
    path: '*',
    name: '404',
    component: Error,
    props: { code: 404 },
    meta: unauth
  },
]

// 将「没有权限」注入到 mainLayoutRoutes 中，目前只支持第一级
const mainLayoutRoutesWith403 = mainLayoutRoutes.map(it => {
  // 暂时不对含有 components 的组件进行操作
  if (it.components != null) {
    devError(`[config] ${it.name} has components, pass`)
    return it
  }

  const components: any = {
    default: it.component,
    403: Error,
  }

  const result: RouteConfigEnhance = {
    ...it,
    components,
    props: {
      default: it.props || {},
      403: { code: 403 }
    }
  }
  delete result.component

  return result
})

const routes: RouteConfig[] = [
  ...singleRoutes,
  {
    path: '/',
    component: MainLayout,
    children: mainLayoutRoutesWith403,
  },
  ...errorRoutes,
]

export default routes
