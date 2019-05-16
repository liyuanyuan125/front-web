import { get, post, put } from '@/fn/ajax'

/**
 * platformInfoData1
 * @param query
 */
export async function platformData1(query: any) {
  const res = await get('/xadvert/plans/effect' , query)
  return res
}
/**
 * platformInfoData2
 * @param data
 */
export async function platformData2(query: any) {
  const res = await get('/xadvert/plans/effectStatistics' , query)
  return res
}

