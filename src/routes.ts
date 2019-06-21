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
import { MapType } from './util/types'
import { stringToBoolean } from './fn/typeCast'

/**
 * 处理 route 中的参数类型
 * @param config 配置
 */
const paramTypes = (
  config: MapType<NumberConstructor | BooleanConstructor | StringConstructor>
) => {
  return ({ params }: Route) => {
    const props = Object.entries(config).reduce((map, [key, type]) => {
      const strVal = params[key]
      const value = type === Number
        ? (+strVal || 0)
        : type === Boolean
        ? stringToBoolean(strVal)
        : strVal
      map[key] = value
      return map
    }, {} as MapType<any>)
    return props
  }
}

const idProps = paramTypes({ id: Number })

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

  /**
   * 是否使用沉浸式 header，默认为 false，只能设置为 true 或不设置
   */
  immersionHeader?: true
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
  // {
  //   path: '/home/resoverview',
  //   name: 'home-resoverview',
  //   component: () => import('./views/home/resoverview/index.vue'),
  //   meta: {
  //     ...emptyAuth,
  //     breadcrumbs: [{ label: '首页' }]
  //   }
  // },

  // TODO: 临时解决方案
  {
    path: '/home/resoverview',
    name: 'home-resoverview',
    component: () => import('./views/resReport/info/index.vue'),
    meta: {
      authKey: 'data-report',
      authAction: 'EMPTY',
      breadcrumbs: [{ label: '首页' }]
    }
  },

  // 搜索
  {
    path: '/search/:keyword/:type?',
    name: 'search',
    component: () => import('./views/search/index.vue'),
    meta: {
      ...emptyAuth,
    },
    props: true,
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
      },
      title(route) {
        const id = route.params.id
        return id ? '编辑' : '添加'
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
      title() {
        return '查看'
      }
    },
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
    component: () => import('./views/pop/plan/default/index.vue'),
    meta: {
      authKey: 'promotion.ad-plan',
      authAction: 'view',
      title() {
        return '详情'
      }
    }
  },

  // 广告主 - 推广管理 - 广告计划 - 详情（其他状态下）
  {
    path: '/pop/planlist/defaultpayment/:id',
    name: 'pop-planlist-defaultpayment',
    component: () => import('./views/pop/plan/default/index.vue'),
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
    path: '/pop/planlist/add/:id?/:setid?',
    name: 'pop-planlist-add',
    component: () => import('./views/pop/plan/index.vue'),
    meta: {
      authKey: 'promotion.ad-plan',
      authAction: 'edit',
      title() {
        return '创建'
      }
    }
  },

  // 广告主 - 推广管理 - 广告计划 - 编辑广告计划
  {
    path: '/pop/planlist/edit/:id/:setid',
    name: 'pop-planlist-edit',
    component: () => import('./views/pop/plan/index.vue'),
    meta: {
      authKey: 'promotion.ad-plan',
      authAction: 'edit',
      title() {
        return '编辑'
      }
    }
  },

  // // 广告主 - 推广管理 - 广告计划 - 编辑广告计划
  // {
  //   path: '/pop/planlist/set/:id?/:setid?',
  //   name: 'pop-planlist-set',
  //   component: () => import('./views/pop/plan/index.vue'),
  //   meta: emptyAuth
  // },
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
      title: ''
    }
  },

  // 广告主 - 推广管理 - 广告片 - 创建、编辑（存在 id 为编辑，否则为创建）
  {
    path: '/pop/film/edit/:id?',
    name: 'pop-film-edit',
    component: () => import('./views/pop/film/edit.vue'),
    meta: {
      authKey: 'promotion.ad-video',
      title({params}) {
        return params.id as any > 0 ? '编辑' : '新建'
      },
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
      title: '查看'
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
    meta: {
      authKey: 'adOrderManage.issue',
      authAction: 'EMPTY',
      authIsMenu: true,
    },
  },

  // 资源方 - 广告单管理 - 监播管理
   {
    path: '/order/supervision',
    name: 'order-supervision',
    component: () => import('./views/order/supervision/index.vue'),
    meta: {
      authKey: 'adOrderManage.supervision',
      authAction: 'EMPTY',
      authIsMenu: true,
    },
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
  // {
  //   path: '/report/plan/:id?',
  //   name: 'report-plan',
  //   component: () => import('./views/report/plan/index.vue'),
  //   meta: {
  //     authKey: 'data-report',
  //     authAction: 'view',
  //     authIsMenu: true,
  //   }
  // },

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
    path: '/resreport/info',
    name: 'resreport-info',
    component: () => import('./views/resReport/info/index.vue'),
    meta: {
      authKey: 'data-report',
      authAction: 'EMPTY',
      authIsMenu: true,
    },
  },

  // 广告主 - 效果报表
  {
    path: '/reseport/effect-report',
    name: 'effect-report',
    component: () => import('./views/resReport/effectReport/index.vue'),
    meta: {
      authKey: 'promotion.report',
      authAction: 'EMPTY',
      authIsMenu: true
    },
  },

  // 第三方 - 效果报表
  {
    path: '/reseport/effect-report-third',
    name: 'effect-report-third',
    component: () => import('./views/resReport/effectReportThird/index.vue'),
    meta: unauth,
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
      },
      title(route) {
        const id = route.params.id
        return id ? '客户管理 - 编辑信息' : '客户管理 - 添加信息'
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
  // KOL - KOL 对比
  {
    path: '/kol/compare/:id/:ids',
    name: 'kol-compare',
    component: () => import('./views/kol/compare/index.vue'),
    meta: emptyAuth
  },

   // KOL - KOl 订单管理
   {
    path: '/kol/orderlist',
    name: 'kol-orderlist',
    component: () => import('./views/kol/order/index.vue'),
    meta: {
      authKey: 'kol.order',
      authAction: 'EMPTY',
      authIsMenu: true,
    }
  },

  // KOL - KOL 草稿
  {
      path: '/kol/draft',
      name: 'kol-draft',
      component: () => import('./views/kol/order/draft.vue'),
      meta: emptyAuth
  },

  // kol - koll列表
  {
    path: '/kol/shopping/:id?',
    name: 'kol-shopping',
    component: () => import('./views/kol/shopping/index.vue'),
    meta: {
      authKey: '',
      authAction: '',
      title() {
        return '购物车'
      }
    }
  },

   // kol - 订单详情
   {
    path: '/kol/order/detail/:id',
    name: 'kol-order-detail',
    component: () => import('./views/kol/order/detail.vue'),
    meta: emptyAuth,
    props: idProps,
  },

  // kol - 检测
  {
    path: '/kol/order/taskDetection/:id',
    name: 'order-order-taskDetection',
    component: () => import('./views/kol/order/taskDetection.vue'),
    meta: emptyAuth,
  },

  // kol - 检测详情
  {
    path: '/kol/order/taskDetection/detail/:id',
    name: 'order-order-taskDetection-detail',
    component: () => import('./views/kol/order/taskdet.vue'),
    meta: emptyAuth,
  },

  // KOL - 申请发票列表
   {
    path: '/kol/applyTicket',
    name: 'kol-applyTicket',
    component: () => import('./views/kol/applyTicket/index.vue'),
    meta: emptyAuth
  },

  // KOL - 申请发票填写
   {
    path: '/kol/applyTicket/addticket/:edit/:key',
    name: 'kol-applyTicket-addticket',
    component: () => import('./views/kol/applyTicket/addticket.vue'),
    meta: emptyAuth
  },

  // KOL - 查看开票历史
   {
    path: '/kol/applyTicket/ticketHis',
    name: 'kol-applyTicket-ticketHis',
    component: () => import('./views/kol/applyTicket/ticketHis.vue'),
    meta: emptyAuth
  },

  // KOL - 查看开票详情
   {
    path: '/kol/applyTicket/detail/:id',
    name: 'kol-applyTicket-detail',
    component: () => import('./views/kol/applyTicket/detail.vue'),
    meta: emptyAuth
  },

  // kol - koll列表
  {
    path: '/kol/kollist',
    name: 'kol-kollist',
    component: () => import('./views/kol/kollist/index.vue'),
    meta: {
      authKey: 'kol.list',
      authAction: 'EMPTY',
      authIsMenu: true,
    }
  },

  // KOL - 概览
  {
    path: '/kol/figure/:id/:channel?',
    name: 'kol-figure',
    component: () => import('./views/mainPage/kol.vue'),
    meta: {
      ...emptyAuth,
      immersionHeader: true,
      title: 'kol-详情页'
    },
    props: ({ params: { id, channel } }: Route) => {
      return {
        id: +id,
        channel,
      }
    },
  },

  // KOL - 更多详情
  {
    path: '/kol/detail/:id',
    name: 'kol-detail-layout',
    component: () => import('./views/kol/detail/layout.vue'),
    meta: {
      ...emptyAuth,
    },
    props: idProps,
    children: [
      // kol - KOL详情更多页 - 平台运营
      {
        path: 'platform',
        name: 'kol-detail-platform',
        component: () => import('./views/kol/detail/platform.vue'),
        meta: {
          ...emptyAuth,
          title: '平台运营'
        },
        props: idProps,
      },

      // KOL - KOL详情更多页 - 热度趋势
      {
        path: 'trend',
        name: 'kol-detail-trend',
        component: () => import('./views/kol/detail/trend.vue'),
        meta: {
          ...emptyAuth,
          title: '热度趋势'
        },
        props: idProps,
      },

      // KOL - KOL详情更多页 - 投放价格
      {
        path: 'price',
        name: 'kol-detail-price',
        component: () => import('./views/kol/detail/price.vue'),
        meta: {
          ...emptyAuth,
          title: '投放价格'
        },
        props: idProps,
      },

      // KOL - KOL详情更多页 - 粉丝画像
      {
        path: 'fans',
        name: 'kol-detail-fans',
        component: () => import('./views/kol/detail/fans.vue'),
        meta: {
          ...emptyAuth,
          title: 'emptyAuth'
        },
        props: idProps,
      },

      // KOL - KOL详情更多页 - 粉丝画像 - 受众匹配
      {
        path: 'matching/:brandId',
        name: 'kol-detail-matching',
        component: () => import('./views/kol/detail/matching.vue'),
        meta: {
          ...emptyAuth,
          nav: 'kol-detail-fans',
          title: '粉丝画像'
        },
        props: idProps,
      },

      // KOL - KOL详情更多页 - 口碑评论
      {
        path: 'comment',
        name: 'kol-detail-comment',
        component: () => import('./views/kol/detail/comment.vue'),
        meta: {
          ...emptyAuth,
          title: '口碑评论'
        },
        props: idProps,
      },

      // kol - KOL详情更多页 - 主要作品
      {
        path: 'opus',
        name: 'kol-detail-opus',
        component: () => import('./views/kol/detail/opus.vue'),
        meta: {
          ...emptyAuth,
          title: '主要作品'
        },
        props: idProps,
      },

      // kol - KOL详情更多页 - 合作品牌
      {
        path: 'brand',
        name: 'kol-detail-brand',
        component: () => import('./views/kol/detail/brand.vue'),
        meta: {
          ...emptyAuth,
          title: '合作品牌'
        },
        props: idProps,
      },
    ]
  },

  // 影片
  {
    path: '/film/movie/:id',
    name: 'film-movie',
    component: () => import('./views/mainPage/movie.vue'),
    meta: {
      ...emptyAuth,
      immersionHeader: true,
      title: '影片详情页'
    },
    props: idProps,
  },

  // 影片更多详情页
  {
    path: '/film/detail/:id',
    name: 'film-detail-layout',
    component: () => import('./views/film/detail/layout.vue'),
    meta: {
      ...emptyAuth,
    },
    props: idProps,
    children: [
      // 影片 - 更多详情 - 主创阵容
      {
        path: 'creator',
        name: 'film-detail-creator',
        component: () => import('./views/film/detail/creator.vue'),
        meta: {
          ...emptyAuth,
          title: '主创阵容'
        },
        props: idProps,
      },
      // 影片 - 更多详情 - 详细资料
      {
        path: 'information',
        name: 'film-detail-information',
        component: () => import('./views/film/detail/information.vue'),
        meta: {
          ...emptyAuth,
          title: '详细资料'
        },
        props: idProps,
      },
      // 影片 - 更多详情 - 粉丝画像
      {
        path: 'fans',
        name: 'film-detail-fans',
        component: () => import('./views/film/detail/fans.vue'),
        meta: {
          ...emptyAuth,
          title: '用户画像'
        },
        props: idProps,
      },
      // 影片 - 更多详情 - 粉丝画像 - 匹配度
      {
        path: 'matching/:brandId',
        name: 'film-detail-matching',
        component: () => import('./views/film/detail/matching.vue'),
        meta: {
          ...emptyAuth,
          title: '用户画像'
        },
        props: idProps,
      },
      // 影片 - 更多详情 - 观影趋势
      {
        path: 'trend',
        name: 'film-detail-trend',
        component: () => import('./views/film/detail/trend.vue'),
        meta: {
          ...emptyAuth,
          title: '观影趋势'
        },
        props: idProps,
      },
      // 影片 - 更多详情 - 全网热度
      {
        path: 'hot',
        name: 'film-detail-hot',
        component: () => import('./views/film/detail/hot.vue'),
        meta: {
          ...emptyAuth,
          title: '全网热度'
        },
        props: idProps,
      },
    ]
  },

  // 影人
  {
    path: '/film/figure/:id',
    name: 'film-figure',
    component: () => import('./views/mainPage/figure.vue'),
    meta: {
      ...emptyAuth,
      immersionHeader: true,
      title: '影人详情页',
    },
    props: idProps,
  },

  // 影人详情页
  {
    path: '/film/figure/detail/:id',
    name: 'film-figure-detail-layout',
    component: () => import('./views/film/figure/detail/layout.vue'),
    meta: {
      ...emptyAuth,
    },
    props: idProps,
    children: [
      // 影人详情页 - 作品列表
      {
        path: 'works',
        name: 'film-figure-detail-works',
        component: () => import('./views/film/figure/detail/works.vue'),
        meta: {
          ...emptyAuth,
          title: '作品列表'
        },
        props: idProps,
      },
      // 影人详情 - 合作品牌
      {
        path: 'brand',
        name: 'film-figure-detail-brand',
        component: () => import('./views/film/figure/detail/brand.vue'),
        meta: {
          ...emptyAuth,
          title: '合作品牌'
        },
        props: idProps,
      },
      // 影人详情 - 更多资料
      {
        path: 'information',
        name: 'film-figure-detail-information',
        component: () => import('./views/film/figure/detail/information.vue'),
        meta: {
          ...emptyAuth,
          title: '更多资料'
        },
        props: idProps,
      },
      // 影人详情 - 粉丝画像
      {
        path: 'fans',
        name: 'film-figure-detail-fans',
        component: () => import('./views/film/figure/detail/fans.vue'),
        meta: {
          ...emptyAuth,
          title: '粉丝画像'
        },
        props: idProps,
      },
      // 影人详情 - 粉丝画像 - 受众匹配
      {
        path: 'matching/:brandId',
        name: 'film-figure-detail-matching',
        component: () => import('./views/film/figure/detail/matching.vue'),
        meta: {
          ...emptyAuth,
          title: '粉丝画像'
        },
        props: idProps,
      },
      // 影人详情 - 口碑评论
      {
        path: 'comment',
        name: 'film-figure-detail-comment',
        component: () => import('./views/film/figure/detail/comment.vue'),
        meta: {
          ...emptyAuth,
          title: '口碑评论'
        },
        props: idProps,
      },
      // 影人详情 - 全网热度
      {
        path: 'hot',
        name: 'film-figure-detail-hot',
        component: () => import('./views/film/figure/detail/hot.vue'),
        meta: {
          ...emptyAuth,
          title: '全网热度'
        },
        props: idProps,
      },
      // 影人详情 -  平台运营
      {
        path: 'platform',
        name: 'film-figure-detail-platform',
        component: () => import('./views/film/figure/detail/platform.vue'),
        meta: {
          ...emptyAuth,
          title: '平台运营'
        },
        props: idProps,
      },
    ]
  },

  // 影片（film）- 影片合作 - 列表
  {
    path: '/film/cooperation/list',
    name: 'film-cooperation-list',
    component: () => import('./views/film/cooperation/list.vue'),
    meta: {
      authKey: 'film-cooperation.list',
      authAction: 'EMPTY',
      authIsMenu: true,
    }
  },

  // 影片 - 影片合作订单列表
  {
    path: '/film/filmorder/movielist',
    name: 'film-filmorder-movielist',
    component: () => import('./views/film/filmorder/movielist.vue'),
    meta: {
      authKey: 'film-cooperation.order',
      authAction: 'EMPTY',
      authIsMenu: true,
    },
  },
  // 影片 - 影片合作订单列表添加
  {
    path: '/film/filmorder/addmovielist/:id',
    name: 'film-filmorder-addmovielist',
    component: () => import('./views/film/filmorder/addmovielist.vue'),
    meta: emptyAuth,
  },
  // 影片 - 影片合作订单详情
  {
    path: '/film/filmorder/movielist/detail/:id',
    name: 'film-filmorder-movielist-detail',
    component: () => import('./views/film/filmorder/moviedetail.vue'),
    meta: emptyAuth,
  },

  // kol - 订单填写
  {
    path: '/kol/orderfill/:code?/:id?',
    name: 'order-orderfill',
    component: () => import('./views/kol/orderfill/index.vue'),
    meta: {
      authKey: '',
      authAction: '',
      title() {
        return '订单填写'
      }
    },
  },
  // kol - 我的收藏
  {
    path: '/kol/collect/:id',
    name: 'kol-collect',
    component: () => import('./views/kol/collect/index.vue'),
    meta: {
      authKey: '',
      authAction: '',
      title() {
        return '我的收藏'
      }
    },
  },

  // 品牌 - 首页
  {
    path: '/brand/home/:id',
    name: 'brand-home',
    component: () => import('./views/brand/home/index.vue'),
    meta: {
      authKey: '',
      authAction: '',
      title: '品牌',
    },
    props: idProps,
  },
  // 品牌 - 首页 - 详情页
  {
    path: '/brand/homedetail/:id',
    name: 'brand-homedetail-layout',
    component: () => import('./views/brand/detailHome/layout.vue'),
    meta: {
      ...emptyAuth,
    },
    props: idProps,
    children: [
      // 品牌 - 详情页 - 用户画像
      {
        path: 'fans',
        name: 'brand-homedetail-fans',
        component: () => import('./views/brand/detailHome/fans.vue'),
        meta: {
          ...emptyAuth,
          title: '用户画像'
        },
        props: idProps,
      },
      // 品牌 - 详情页 - 口碑评论
      {
        path: 'comment',
        name: 'brand-homedetail-comment',
        component: () => import('./views/brand/detailHome/comment.vue'),
        meta: {
          ...emptyAuth,
          title: '口碑评论'
        },
        props: idProps,
      },
      // 品牌 - 详情页 - 全网热度
      {
        path: 'trend',
        name: 'brand-homedetail-trend',
        component: () => import('./views/brand/detailHome/trend.vue'),
        meta: {
          ...emptyAuth,
          title: '全网热度'
        },
        props: idProps,
      },
    ]
  },

  // 品牌 - 产品 - 首页
  {
    // brandId 为品牌 id，id 为产品 id
    // TODO: brandId 可能是多余的，若 id 能唯一确认，就将 brandId 去掉
    path: '/brand/:brandId/item/:id',
    name: 'brand-item',
    component: () => import('./views/brand/home/item.vue'),
    meta: {
      authKey: '',
      authAction: '',
      title: '产品',
    },
    props: paramTypes({
      id: Number,
      brandId: Number
    })
  },

  // 品牌 - 产品 - 详情页
  {
    path: '/brand/detailpro/:id',
    name: 'brand-detailpro-layout',
    component: () => import('./views/brand/detailPro/layout.vue'),
    meta: {
      ...emptyAuth,
    },
    props: idProps,
    children: [
      // 产品 - 详情页 - 用户画像
      {
        path: 'fans',
        name: 'brand-detailpro-fans',
        component: () => import('./views/brand/detailPro/fans.vue'),
        meta: {
          ...emptyAuth,
          title: '用户画像'
        },
        props: idProps,
      },
      // 产品 - 详情页 - 口碑评论
      {
        path: 'comment',
        name: 'brand-detailpro-comment',
        component: () => import('./views/brand/detailPro/comment.vue'),
        meta: {
          ...emptyAuth,
          title: '口碑评论'
        },
        props: idProps,
      },
      // 产品 - 详情页 - 全网热度
      {
        path: 'trend',
        name: 'brand-detailpro-trend',
        component: () => import('./views/brand/detailPro/trend.vue'),
        meta: {
          ...emptyAuth,
          title: '全网热度'
        },
        props: idProps,
      },
    ]
  },

   // [直客] 品牌管理（详情页）登录判断
   {
    path: '/brand/list',
    name: 'brand-list',
    component: () => import('./views/brand/list.vue'),
    meta: {
      authKey: 'brand',
      authAction: 'EMPTY',
      authIsMenu: true,
      title: '品牌管理',
    }
  },

  // 品牌列表（有多个品牌则默认跳转品牌列表）登录判断
  {
    path: '/brand/moredetail/:id/:brandId',
    name: 'brand-moredetail',
    redirect: '/brand/moredetail/:id/:brandId/base',
    component: () => import('./views/brand/moreDetail.vue'),
    meta: {
      authKey: '',
      authAction: '',
      title: '品牌管理详情页',
    },
    props: paramTypes({
      id: Number,
      brandId: Number
    }),
    children: [
      // 品牌详情 - 基础信息
      {
        path: 'base',
        name: 'brand-moredetail-base',
        component: () => import('./views/brand/details/base.vue'),
        meta: {
          authKey: '',
          authAction: '',
          title: '基础信息',
        },
        props: paramTypes({
          id: Number,
          brandId: Number
        }),
      },
      // 品牌详情 - 门店
      {
        path: 'shop',
        name: 'brand-moredetail-shop',
        component: () => import('./views/brand/details/shop.vue'),
        meta: {
          authKey: '',
          authAction: '',
          title: '门店',
        },
        props: paramTypes({
          id: Number,
          brandId: Number
        }),
      },
      // 品牌详情 - 媒体平台
      {
        path: 'media',
        name: 'brand-moredetail-media',
        component: () => import('./views/brand/details/media.vue'),
        meta: {
          authKey: '',
          authAction: '',
          title: '媒体平台',
        },
        props: paramTypes({
          id: Number,
          brandId: Number
        }),
      },
      // 品牌详情 - 产品信息
      {
        path: 'product',
        name: 'brand-moredetail-product',
        component: () => import('./views/brand/details/product.vue'),
        meta: {
          authKey: '',
          authAction: '',
          title: '产品信息',
        },
        props: paramTypes({
          id: Number,
          brandId: Number
        }),
      },
    ]
  },

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
