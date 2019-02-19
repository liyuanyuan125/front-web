import { get , post , put } from '@/fn/ajax'

export async function queryList(id: any) {
  const data = await get(`/xadvert/execute-orders/${id}/video-dcp-list`)
  return data
}
