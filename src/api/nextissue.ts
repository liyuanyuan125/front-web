
// import { get } from '@/fn/ajax'
import { get , post , put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

// 下刊列表
export async function queryList(query: any) {
  const res = await get('/xadvert/off-shelfs' , query)
  return res
}

// 获取影院列表
export async function movielist(query: any) {
  const res = await get('/theater/cinemas/query-for-current' , query)
  return res
}

// 获取默认影院id
export async function getcinid() {
  const res = await get('/xadvert/upper-shelfs/default-cinema')
  return res
}


// 单个设置下刊状态
export async function oneover(query: any) {
  const res = await put( `/xadvert/off-shelfs/setup` , query)
  return res
}

// 单个设置下刊状态
export async function oneout(query: any) {
  const res = await put(`/xadvert/off-shelfs/cancel` , query)
  return res
}

// 批量设置上刊状态
export async function allover(query: any) {
  const res = await put(`/xadvert/off-shelfs/batch` , query)
  return res
}


