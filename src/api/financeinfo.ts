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

// 获取转账方式
export async function before() {
  const res = await get('/finance/lineUnderRemittances/create/before')
  return res
}

// 新(新建充值)
export async function lineUnderRemittances(query: any) {
  const res = await post('/finance/lineUnderRemittances', query)
  return res
}

// 资金账单列表
export async function bills(query: any) {
  const res = await get(`/finance/xadvertiser/account-bills` , query)
  return res
}

