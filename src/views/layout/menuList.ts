import { SystemCode, MapType, PermPage } from '@/util/types'
import { walkTree } from '@/fn/tree'
import routes, { RouteConfigEnhance, RouteMetaAuth } from '@/routes'

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
}

let menuRouteMapCache: MapType<RouteConfigEnhance> | null = null

// 获取 routes 中被标记为 authIsMenu 的 route 项
const getMenuRouteMap = () => {
  if (menuRouteMapCache != null) {
    return menuRouteMapCache
  }

  const map: MapType<RouteConfigEnhance> = {}

  walkTree(routes as RouteConfigEnhance[], {
    onEachBefore(route) {
      const meta = (route.meta || {}) as RouteMetaAuth
      const isMenu = !!meta.authIsMenu
      const key = (meta.authKey || '').toLowerCase()
      isMenu && (map[key] = route)
    }
  })

  // 在开发环境不缓存
  VAR.env !== 'dev' && (menuRouteMapCache = map)

  return map
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
  'resource.financemanage': 'resfinance',
  'resource.account-manage': 'account',
}

/**
 * 获取菜单项
 * @param permMenu 后端获取过来的菜单配置
 * @param systemCode 系统 code
 */
export function getMenuList(permMenu: PermPage[], systemCode: SystemCode) {
  const menuRouteMap = getMenuRouteMap()

  const prefix = new RegExp(`^${systemCode}\\.`, 'i')

  const result: SiderMenuItem[] = walkTree(permMenu, {
    childrenKey: 'subPages',
    onEachBefore(menu) {
      const key = menu.key.toLowerCase()
      const noPrefixKey = key.replace(prefix, '')
      const route = menuRouteMap[noPrefixKey]
      const routeName = route && route.name
      const name = authKeyToMenuNameMap[key] || routeName || noPrefixKey
      const item: SiderMenuItem = {
        name,
        label: menu.name,
        route: routeName,
      }
      return item
    }
  })

  return result
}
