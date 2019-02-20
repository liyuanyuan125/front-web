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

// 获取客户详细信息
export async function contact(id: any) {
  const res = await get(`/customer/partners/detail/${id}/`)
  return res
}

// 获取客户详细信息
export async function putcontact(id: any, query: any) {
  const res = await put(`/customer/partners/${id}`, query)
  return res
}

// 添加客户详细信息
export async function postcontact(query: any) {
  const res = await post(`/customer/partners`, query)
  return res
}

// 获取客户的行业列表
export async function business() {
  const res = await get(`/customer/partners/business`)
  return res
}
