import { get , post , put } from '@/fn/ajax'

// 数据统计
export async function cinemadata(query: any) {
  const res = await get('/xadvert/plans/alldata' , query)
  return res
}

// 单步成效数据统计
export async function querylist(query: any) {
    const res = await get('/xadvert/plans/single-effect' , query)
    return res
  }


