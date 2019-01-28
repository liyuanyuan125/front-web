import { get , post , put } from '@/fn/ajax'

export async function queryList() {
  const res = await get('/xadvert/plans/view')
  return res
}

// i新建计划
export async function addplan() {
  const res = await post('/xadvert/plans')
  return res
}

// 预估场次
export async function abcount(query: any) {
  const res = await get('/xadvert/plans/estimate-count', query)
  return res
}

// 方案价格计算
export async function pricount(query: any) {
  const res = await get('/xadvert/plans/price-calculation', query)
  return res
}

// 推荐影片
export async function tuijian(query: any) {
  const res = await get('/xadvert/plans/movie', query)
  return res
}


// 推荐影片
export async function cinemaList(query: any) {
  const res = await get('/xadvert/plans/cinemas', query)
  return res
}

