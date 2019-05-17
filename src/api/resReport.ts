import { get, post, put } from '@/fn/ajax'

/**
 * 广告成效
 * @param data
 */
export async function effect(query: any) {
  const res = await get('/xadvert/plans/effect' , query)
  return res
}
export async function effectStatistics(query: any) {
  const res = await get('/xadvert/plans/effectStatistics' , query)
  return res
}

