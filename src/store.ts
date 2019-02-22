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
      // tslint:disable-next-line:no-console
      console.error(`用户信息不完整：${ex.message}，退出重新登录`)
      logout()
    }
  }
}

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
    delete permCache[theUser.id]
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
    const cached = permCache[user.id]
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

          // 提取所有权限
          const key = node.key
          node.actions.forEach(({ code }) => permMap[`${key}${code}`.toLowerCase()] = 1)
        }
      })

      const result: PermResult = { menu, permMap }

      return result
    })
    .catch(() => {
      // 如果遇到错误，则清空相应的 permCache，以便下次可以重试
      delete permCache[user.id]
      // 返回一个空的 PermResult，以便消除上层代码的错误？
      return { menu: [], permMap: {} } as PermResult
    })

    permCache[user.id] = promise

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
  return lower in permMap
}
