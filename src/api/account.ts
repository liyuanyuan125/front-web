import { get, post, put } from '@/fn/ajax'

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
  return res
}

/**
 * 未审核更新账号和公司信息
 * @param data
 */
export async function pendingAudit(data: any) {
  const res = put(`/customer/accounts/company`, data)
  return res
}

/**
 * 审核后修改账号信息
 * @param data
 */
export async function auditingAccount(data: any) {
  const res = put(`customer/accounts`, data)
  return res
}

/**]
 * 获取公司信息变更记录
 */
export async function accountChangeList() {
  const res = get('customer/companies/change-list')
  return res
}

/**
 * 审核成功后修改公司信息
 * @param data
 */
export async function changeCompanyList(data: any) {
  const res = put(`customer/companies/detail`, data)
  return res
}
