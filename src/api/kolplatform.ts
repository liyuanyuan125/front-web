import { get , post , put, del } from '@/fn/ajax'

// 查询KOL运营状况
export async function kolPlanflans(id: any, data: any) {
  const res = await get(`/kol/accounts/${id}/trends`, data)
  return res
}
