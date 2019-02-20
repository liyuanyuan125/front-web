import { get , post , put , del } from '@/fn/ajax'

// 充值记录
export async function subAccount(query: any) {
  const res = await get('/customer/partners', query)
  return res
}

// 根据行业获取分类列表
export async function codeList(businessCode: any) {
  const res = await get(`/customer/partners/business/${businessCode}`)
  return res
}

