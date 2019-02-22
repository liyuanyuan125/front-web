import { get, post, put } from '@/fn/ajax'

// 广告单影院列表
export async function queryList() {
  const res = await get('/xadvert/dispatchs')
  return res
}

// 广告单影院列表
export async function leafletList(id: any, query: any) {
  const res = await get(`/xadvert/dispatchs/${id}/cinemas`, query)
  return res
}

// 广告单 确认接单
export async function sureLeaflet(query: any) {
  const res = await post('/xadvert/dispatchs/accept', query)
  return res
}

// 执行单影院列表
export async function findCinema(id: any, query: any) {
  const res = await get(`/xadvert/dispatchs/${id}/cinemas`, query)
  return res
}

// 执行单影院列表
export async function carryList(id: any, query: any) {
  const res = await get(`/xadvert/execute-orders/${id}/cinemas`, query)
  return res
}

// 修改执行单
export async function carrySet(id: any, query: any) {
  const res = await put(`/xadvert/execute-orders/${id}/cinemas`, query)
  return res
}

// 修改执行单
export async function carryRefuse(id: any) {
  const res = await put(`/xadvert/dispatchs/${id}/refuse`)
  return res
}
