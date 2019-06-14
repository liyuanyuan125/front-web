
// import { get } from '@/fn/ajax'
import { get , post , put , del } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

//  任务检测列表
export async function queryList(id: any) {
  const data = await get(`/kol/orders/task/${id}` )
  return data
}

//  任务检测详情列表
export async function itemlist(id: any) {
  const data = await get(`/kol/orders/task-details/${id}` )
  return data
}



