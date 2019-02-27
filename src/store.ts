///
/// 全局数据结构，这里做了简化，暂不使用 Vuex
///
import tryParseJson from '@/fn/tryParseJson'
import cookie from 'js-cookie'
import { logout as postLogout } from '@/api/auth'
import { SystemCode, systemList, PermPage, MapType } from '@/util/types'
import innerAccess, { AccessToken } from '@/fn/innerAccess'
import event from '@/fn/event'
import { systemSwitched, SystemSwitchedEvent } from '@/util/globalEvents'
import { getMenus } from '@/api/customer'
import { walkTree } from '@/fn/tree'
import { RouteMetaUnauth, RouteMetaAuth } from './routes'
import { Route } from 'vue-router'
import { devInfo, devError } from '@/util/dev'

const accessToken: AccessToken = { can: false }

// 权限缓存，刷新、重新登录、退出丢失
// TODO: 实现重新登录清空权限缓存
const permCache: MapType<Promise<PermResult>> = {}

/** 用户类型 */
export interface User {
  /** 用户 ID */
  id: number
  /** 用户显示名，若今后有昵称，则显示昵称，目前为 email */
  name: string
  /** 用户邮箱，也是账号 */
  email: string
  /** 是否为主账号 */
  isAdmin: boolean

  /** 当前系统 */
  systemCode: SystemCode
  /** 所拥有的系统列表 */
  systems: SystemCode[]

  /** 所属公司 ID */
  companyId: number
  /** 所属公司名 */
  companyName: string
  /** 主子账户类型 */
  accountType: number
  /** 权限列表 */
  perms: string[]
}

const KEY_USER = 'user@www.aiads.com'
const KEY_TOKEN = 'X-API-TOKEN'

const COOKIE_OPTIONS = {
  path: '/',
  domain: location.hostname === 'localhost' ? '' : '.aiads.com',
}

let theUser: User | null = null

const saveUser = () => localStorage[KEY_USER] = JSON.stringify(theUser)

const restoreUser = (): User | null => {
  const token = cookie.get(KEY_TOKEN)
  const user = tryParseJson(localStorage[KEY_USER])
  return token && user ? user : null
}

/**
 * 获取当前登录用户
 */
export function getUser() {
  if (theUser == null) {
    theUser = restoreUser()
  }

  if (theUser != null && VAR.env == 'dev') {
    theUser = innerAccess(theUser, accessToken)
  }

  return theUser
}

/**
 * 设置用户
 * @param user 用户
 */
export function setUser(user: User) {
  theUser = user
  saveUser()
}

// 简单的断言
const assert = (expression: any, errorMessage: string) => {
  if (!!expression === false) {
    throw new Error(errorMessage)
  }
}

/** 检查用户信息完成性，若不完整，则清空，退出  */
export function checkUser() {
  const user = getUser()
  if (user != null) {
    try {
      assert(user.id > 0, '用户 ID 必须大于 0')
      assert((user.email || '').trim(), '邮箱不能为空')
      assert('isAdmin' in user, '必须存在 isAdmin')
      const codeList = systemList.map(it => it.code)
      assert(codeList.includes(user.systemCode), '角色不正确')
      assert(user.systems && user.systems.length > 0, '没有角色')
      assert(user.companyId > 0, '没有所属公司')
      assert(user.accountType > 0, '没有子账户类型')
      assert(user.perms && user.perms.length > 0, '没有权限列表')
    } catch (ex) {
      devError(`用户信息不完整：${ex.message}，退出重新登录`)
      logout()
    }
  }
}

/**
 * 切换系统
 * @param systemCode 系统
 */
export function switchSystem(systemCode: SystemCode) {
  if (theUser != null && theUser.systemCode !== systemCode) {
    const oldSystemCode = theUser.systemCode
    accessToken.can = true
    theUser.systemCode = systemCode
    accessToken.can = false

    saveUser()

    const ev: SystemSwitchedEvent = { systemCode, oldSystemCode }
    event.emit(systemSwitched, ev)
  }
}

/**
 * 更新当前用户的邮箱
 * @param email 邮箱地址
 */
export function updateEmail(email: string) {
  if (theUser != null) {
    accessToken.can = true
    theUser.email = email
    accessToken.can = false
    saveUser()
  }
}

/**
 * 获取是否已登录
 */
export function hasLogin() {
  return getUser() !== null
}

/**
 * 退出
 */
export function logout() {
  cookie.remove(KEY_TOKEN, COOKIE_OPTIONS)
  delete localStorage[KEY_USER]

  // 清除权限缓存
  if (theUser != null) {
    systemList.forEach(({ code }) => {
      const permKey = `${theUser!.id}-${code}`
      delete permCache[permKey]
    })
  }

  theUser = null
  postLogout()
}

export interface PermResult {
  menu: PermPage[]
  permMap: MapType<number>
}

/**
 * 获取当前菜单与权限，带缓存，刷新、重新登录、退出丢失
 */
export async function getCurrentPerms() {
  const user = getUser()
  if (user != null) {
    // 先从缓存中查找
    const permKey = `${user.id}-${user.systemCode}`
    const cached = permCache[permKey]
    if (cached != null) {
      return cached
    }

    const promise = getMenus(user.systemCode, 2).then(({ data }) => {
      const tree = data as PermPage
      const permMap: MapType<number> = {}
      const menu: PermPage[] = walkTree(tree.subPages || [], {
        childrenKey: 'subPages',

        onEachBefore(node) {
          // 预防 actions、subPages 为 null
          node.actions = (node.actions || []).filter(it => it.check)
          node.subPages = node.subPages || []
        },

        onEachAfter(node: PermPage, parentNodes) {
          // 目前只支持 2 级菜单，取 tree 的 2、3 级别，其他忽略
          if (parentNodes.length > 1) {
            // 明确返回 false，删除该节点，参见 walkTree 实现
            return false
          }

          const key = node.key.toLowerCase()

          // 首先，页面本身也是一种权限，即本页面的查看权限（打开该页面的权限）
          permMap[key] = 1

          // 其次，将每个 action 作为单独的权限
          node.actions.forEach(({ code }) => permMap[`${key}#${code}`.toLowerCase()] = 1)
        }
      })

      const result: PermResult = { menu, permMap }

      devInfo('permMenu', menu)
      devInfo('permMap', permMap)

      return result
    })
    .catch(() => {
      // 如果遇到错误，则清空相应的 permCache，以便下次可以重试
      delete permCache[permKey]
      // 返回一个空的 PermResult，以便消除上层代码的错误？
      return { menu: [], permMap: {} } as PermResult
    })

    permCache[permKey] = promise

    return promise
  }
}

/**
 * 判断当前用户是否有相应的权限
 * @param perm
 */
export async function hasPerm(perm: string) {
  const { permMap = {} } = await getCurrentPerms() || {}
  const lower = (perm || '').toLowerCase()
  const has = lower in permMap
  !has && devError(`[perm] ${lower} not in permMap`)
  return has
}

/**
 * 验证当前用户是否有指定路由的访问权限
 * @param route 页面路由
 */
export async function hasRoutePerm(route: Route) {
  if (route.meta == null) {
    devError('路由配置错误，必须含有 meta 信息')
    return false
  }

  // 不需要登录的，认为具有任何权限
  if ((route.meta as RouteMetaUnauth).unauth) {
    return true
  }

  const { authKey, authAction } = route.meta as RouteMetaAuth

  // authKey 不能为 null
  if (authKey == null || authAction == null) {
    devError('路由配置错误，authKey 或 authAction 不能为 null')
    return false
  }

  const key = String(authKey).trim()

  // authKey 为空的，被认为不做权限验证
  if (key === '') {
    return true
  }

  const action = typeof authAction === 'string'
    ? authAction
    : authAction(route)

  const act = String(action).trim()

  if (act == null || act === '') {
    devError('路由配置错误，authAction 不能为空')
    return false
  }

  const user = getUser()
  const systemCode = user!.systemCode

  const fullKey = [systemCode, key].join('.')

  // 实现 routes 配置中的 EMPTY 约定
  // 参见：src/routes.ts 中 RouteMetaAuth 类型 authAction 字段的注释
  const perm = [fullKey, act].join('#').replace(/#EMPTY$/, '')

  const has = await hasPerm(perm)
  return has
}
