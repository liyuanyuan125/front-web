import { get , post , put , del } from '@/fn/ajax'

// 充值记录
export async function queryList(query: any) {
  const res = await get('/finance/recharges', query)
  return res
}

// 财产信息
export async function moneyList(companyId: any) {
  const res = await get(`/finance/advertiser/accounts/${companyId}`)
  return res
}

// 默认财务信息银行卡
export async function defaultList(query: any) {
  const res = await get('/finance/settings/default', query)
  return res
}

// 新建档期
export async function add(query: any) {
  const res = await post('/basis/calendars', query)
  return res
}

export async function dataFrom(query: any) {
  const res = await get('/basis/calendars', query)
  return res
}

// 更新档期
export async function set(query: any) {
  const res = await put(`/basis/calendars/${query.id}`, query)
  return res
}

// 删除档期
export async function dels(query: any) {
  const res = await del(`/basis/calendars/${query.id}`, query)
  return res
}


