import { get, post } from '@/fn/ajax'

export interface LoginData {
  // systemCode: string
  email: string
  password: string
  captchaId: string
  captchaCode: string
  remember: boolean
}

/**
 * 登录
 * @param data 提交数据
 * https://yapi.aiads-dev.com/project/112/interface/api/1019
 */
export async function login(data: LoginData) {
  const res = await post('/auth/login', data)
  return res
}

/**
 * 退出
 */
export async function logout() {
  const res = await post('/auth/logout')
  return res
}

/**
 * 获取登录用户信息
 */
export async function getUserInfo() {
  const res = await post('/auth/infos')
  return res
}

/**
 * 添加留言
 */
export async function getBoards(data: any) {
  const res = await post('/customer/message-boards', data)
  return res
}
