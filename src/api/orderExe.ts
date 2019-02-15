import { get , post , put } from '@/fn/ajax'

// 数据列表
export async function querylist(query: any) {
  const res = await get('/xadvert/execute-orders' , query)
  return res
}

// 数据统计
export async function nums() {
  const res = await get('/xadvert/execute-orders/statistics')
  return res
}
