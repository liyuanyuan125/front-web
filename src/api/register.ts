import { get , post , put } from '@/fn/ajax'

type EmailType = 'register-email-captcha' | 'resetpwd-email-captcha'

const sendEmail = async (type: EmailType, email: string) => {
  const url = `/customer/captchas/email/${type}`
  const res = await get(url, { email })
  return res
}

/**
 * 发送注册邮箱验证码
 * @param email 邮箱
 */
export async function sendRegisterEmail(email: string) {
  return sendEmail('register-email-captcha', email)
}

/**
 * 发送重置密码邮箱验证码
 * @param email 邮箱
 */
export async function sendResetpwdEmail(email: string) {
  return sendEmail('resetpwd-email-captcha', email)
}

/**
 * 注册接口
 * @param data 接口数据
 */
export async function register(data: any) {
  const res = post('/customer/accounts/signup', data)
  return res
}

/**
 * 重置密码
 * @param data 接口数据
 */
export async function resetPassword(data: any) {
  const res = put('/customer/accounts/pwd-reset', data)
  return res
}

/**
 * 公司行业
 * @param categoryId=2720 行业列表
 */
export async function tradeList() {
  const res = get('/basis/dictionaries', {
    categoryId: 2720,
    dictionaryName: ''
  })
  return res
}

/**
 * 获取短信验证码
 * @param mobile
 * http://yapi.aiads-dev.com/project/94/interface/api/6238
 */
export async function getSms(data: any) {
  const res = post('/customer/accounts/sms', data)
  return res
}

/**
 * 检测公司是否存在
 * @param companyName
 * http://yapi.aiads-dev.com/project/94/interface/api/6238
 */
export async function isCompanyName(companyName: any) {
  const res = get('/customer/companies/name', {companyName})
  return res
}
