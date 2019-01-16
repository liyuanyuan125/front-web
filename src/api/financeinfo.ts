import { get , post , put , del } from '@/fn/ajax'

// 充值记录
export async function queryList(query: any) {
  const res = await get('/finance/recharges', query)
  return res
}

// 财产信息
export async function moneyList(companyId: any) {
  const res = await get(`/finance/xadvertiser/accounts/${companyId}`)
  return res
}

// 默认财务信息银行卡
export async function defaultList(query: any) {
  const res = await get('/finance/settings/default', query)
  return res
}

// 新建财务信息
export async function add(query: any) {
  const res = await post('/finance/recharges', query)
  return res
}

export async function dataFrom(query: any) {
  const res = await get('/finance/recharges', query)
  return res
}



