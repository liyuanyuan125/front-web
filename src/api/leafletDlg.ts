import { get, post } from '@/fn/ajax'

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
