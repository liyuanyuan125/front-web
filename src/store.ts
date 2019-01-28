/**
 * 全部数据结构，这里做了简化，暂不使用 Vuex
 */

import tryParseJson from '@/fn/tryParseJson'
import cookie from 'js-cookie'
import { logout as postLogout } from '@/api/auth'
import { SystemCode } from '@/util/types'
import innerAccess, { AccessToken } from '@/fn/innerAccess'
import event from '@/fn/event'
import { systemSwitched, SystemSwitchedEvent } from '@/util/globalEvents'

const accessToken: AccessToken = { can: false }

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

const KEY_TOKEN = 'X-API-TOKEN'

const COOKIE_OPTIONS = {
  path: '/',
  domain: location.hostname === 'localhost' ? '' : '.aiads.com',
}

let theUser: User | null = null

const saveUser = () => localStorage.user = JSON.stringify(theUser)

const restoreUser = (): User | null => {
  const token = cookie.get(KEY_TOKEN)
  const user = tryParseJson(localStorage.user)
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
  delete localStorage.user
  theUser = null
  postLogout()
}
