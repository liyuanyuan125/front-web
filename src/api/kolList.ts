import { get , post , put } from '@/fn/ajax'

/**
 * KOL搜索表单
 */
export async function titleMsgList(channelCode: any) {
  const res = await get(`/kol/search-forms/${channelCode}`)
  return res
}

/**
 * KOL搜索表单
 */
export async function queryList(channelCode: any) {
  const res = await get(`/kol/search-forms/${channelCode}`)
  return res
}

/**
 * 指定区域
 */
export async function areaList(query: any) {
  const res = await get(`/basis/districts`, query)
  return res
}
/**
 * KOl搜索列表
 */
export async function kolmsglist(query: any) {
  const res = await get('/kol/search', query)
  return res
}
