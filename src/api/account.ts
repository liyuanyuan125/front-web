import { get, post, put } from '@/fn/ajax'
import { getUser } from '@/store'
// const getUseId: any = getUser()

// 主账户id
const getUseId = { id: 1272 }
/**
 * 主账号详情接口
 * @param data 接口数据
 */
export async function accountDetail() {
  const res = get('/customer/accounts/detail')
  return res
}
/**
 * 主账号编辑获取登录邮箱
 * @param email 接口数据
 */
export async function getLoginEmail(email: string) {
  const res = get(`/customer/captchas/email/reset-email-captcha`, { email })
}

/**
 * 未审核更新账号和公司信息
 * @param data
 */
export async function pendingAudit(data: any) {
  const res = put(`/customer/accounts/${getUseId.id}/company`, data)
}
