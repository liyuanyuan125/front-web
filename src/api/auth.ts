import { get, post } from '@/fn/ajax'
import { mockGet, mockPost } from './mock'

interface LoginData {
  username: string
  password: string
  imageCode: string
}

/**
 * 登录
 * @param data 提交数据
 */
export async function login(data: LoginData) {
  const res = await mockPost(data, {
    user: {
      id: 888,
      name: data.username,
    }
  })
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
