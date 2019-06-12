import { get , post , put } from '@/fn/ajax'

export async function orderList(data: any) {
  const res = await get('/kol/orders', data)
  return res
}
