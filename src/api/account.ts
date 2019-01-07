import { get , post , put } from '@/fn/ajax'

 /**
  * 主账号详情接口
  * @param data 接口数据
  */
 export async function accountDetail(data: any) {
    const res = get(`/customer/accounts/${data.id}`, data)
    return res
 }

 /**
  * 主账号编辑获取登录邮箱
  * @param email 接口数据
  */
export async function getLoginEmail(email: string) {
   // const res = get(`/customer/captchas/email/reset-email-captcha`, email)
}
