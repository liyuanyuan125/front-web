import { SystemCode, MapType, PermPage } from '@/util/types'
import { walkTree } from '@/fn/tree'
import routes, { RouteConfigEnhance, RouteMetaAuth, RouteMetaBase, Breadcrumb } from '@/routes'
import { Route } from 'vue-router'

/** 边栏菜单项 */
export interface SiderMenuItem {
  /** 菜单名，一般与 route 一一对应 */
  name: string
  /** 菜单文字 */
  label: string
  /** route 名 */
  route?: string
  /** 子页面 */
  subPages?: SiderMenuItem[]
  /** 图标 */
  icon?: string
  /** 父级 nodes */
  parentNodes?: SiderMenuItem[]
}

interface RouteCache {
  menuMap: MapType<RouteConfigEnhance>
  nameMap: MapType<RouteConfigEnhance>
}

let routeCache: RouteCache | null = null

// 获取 routes 中被标记为 authIsMenu 的 route 项
const getRouteCache = () => {
  if (routeCache != null) {
    return routeCache
  }

  const cache: RouteCache = {
    menuMap: {},
    nameMap: {}
  }

  walkTree(routes as RouteConfigEnhance[], {
    onEachBefore(route) {
      const meta = (route.meta || {}) as RouteMetaAuth
      const isMenu = !!meta.authIsMenu
      const key = (meta.authKey || '').toLowerCase()
      isMenu && (cache.menuMap[key] = route)
      route.name && (cache.nameMap[route.name] = route)
    }
  })

  // 在开发环境不缓存
  VAR.env !== 'dev' && (routeCache = cache)

  return cache
}

/**
 * 将 authKey 映射为菜单 name，所有的 authKey 必须全是小写
 * 这里只映射第一级，第二级可以通过 routes 配置关联出来
 */
const authKeyToMenuNameMap: MapType = {
  // 广告主
  'ads.index': 'home',
  'ads.promotion': 'pop',
  'ads.data-report': 'report',
  'ads.customer-manage': 'customer',
  'ads.financial-manage': 'finance',
  'ads.account-manage': 'account',

  // 资源方
  'resource.index': 'home',
  'resource.adordermanage': 'order',
  'resource.data-report': 'report',
  'resource.financemanage': 'resfinance',
  'resource.account-manage': 'account',
}

/**
 * 将菜单 name 映射到 icon
 */
const nameToIconMap: MapType = {
  home: 'home',
  pop: 'diamond',
  kol: 'diamond',
  'film-cooperation': 'diamond',
  'brand-list': 'diamond',
  report: 'home',
  customer: 'user',
  finance: 'finance',
  account: 'star',

  order: 'order',
  resfinance: 'finance',
}

/**
 * 获取菜单项
 * @param permMenu 后端获取过来的菜单配置
 * @param systemCode 系统 code
 */
export function getMenu(permMenu: PermPage[], systemCode: SystemCode) {
  const { menuMap } = getRouteCache()

  const prefix = new RegExp(`^${systemCode}\\.`, 'i')

  const mapResult: MapType<SiderMenuItem> = {}

  const listResult: SiderMenuItem[] = walkTree(permMenu, {
    childrenKey: 'subPages',
    onEachBefore(menu, parentNodes: SiderMenuItem[]) {
      const key = menu.key.toLowerCase()
      const noPrefixKey = key.replace(prefix, '')
      const route = menuMap[noPrefixKey]
      const routeName = route && route.name
      const name = authKeyToMenuNameMap[key] || routeName || noPrefixKey
      const item: SiderMenuItem = {
        name,
        label: menu.name,
        route: routeName,
        icon: nameToIconMap[name],
        parentNodes
      }
      mapResult[routeName || name] = item
      return item
    }
  })

  return {
    map: mapResult,
    list: listResult
  }
}

// 从配置中获取面包屑列表
const getBreadcrumbsByMeta = (route: Route) => {
  const meta = route.meta as RouteMetaBase

  if (meta.breadcrumbs != null) {
    const list = typeof meta.breadcrumbs == 'function'
      ? meta.breadcrumbs(route)
      : meta.breadcrumbs
    return list
  }

  return null
}

// 从边栏菜单推断面包屑
const getBreadcrumbsBySiderMenu = (route: Route, siderMenuMap: MapType<SiderMenuItem>) => {
  if (route.name == null) {
    return null
  }

  const item = siderMenuMap[route.name]

  if (item == null) {
    return null
  }

  const result: Breadcrumb[] = []

  ; (item.parentNodes || []).concat(item).forEach(it => {
    result.push({
      label: it.label,
      route: it.route ? { name: it.route! } : undefined
    })
  })

  return result
}

/**
 * 获取 route 的面包屑列表
 * @param route route 项目
 * @param siderMenuList 边栏菜单列表
 */
export function getBreadcrumbsForRoute(startRoute: Route, siderMenuMap: MapType<SiderMenuItem>) {
  let result: Breadcrumb[] = []

  // 从路径中进行推断
  const { nameMap } = getRouteCache()
  for (let route = startRoute; route != null; ) {
    // 优先使用明确的 breadcrumbs 配置
    const listByMeta = getBreadcrumbsByMeta(route)
    if (listByMeta != null) {
      result = listByMeta.concat(result)
      break
    }

    // 其次从边栏菜单推断
    const listBySiderMenu = getBreadcrumbsBySiderMenu(route, siderMenuMap)
    if (listBySiderMenu != null) {
      result = listBySiderMenu.concat(result)
      break
    }

    // 最后从路径中进行推断
    const routeName = route.name || ''
    const meta = route.meta as RouteMetaBase
    const title = meta.title != null
      ? typeof meta.title == 'function'
        ? meta.title(route)
        : meta.title
      : `[${routeName}]`

    result.unshift({
      label: title,
      route: routeName in nameMap ? { name: routeName } : undefined
    })

    // 去掉最后的 -name
    const name = routeName.replace(/-?\w+$/, '')
    if (name == '' || name == routeName || !(name in nameMap)) {
      break
    }
    route = nameMap[name] as any as Route
  }

  return result
}
