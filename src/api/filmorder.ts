
// import { get } from '@/fn/ajax'
import { get , post , put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

// 列表
export async function queryList(query: any) {
  const res = await get('/movie/cooperation/' , query)
  return res
}

// 根绝id查询列表详情
export async function itemlist(id: any) {
  const res = await get(`/movie/cooperation/${id}`)
  return res
}

// 新建合作申请
export async function addlist(query: any) {
  const res = await post(`/movie/cooperation/`, query)
  return res
}

// 根绝id查询影片详情/movie/{id}
export async function filmlist(id: any) {
  const res = await get(`/movie/${id}`)
  return res
}

// img
export async function imgs(id: any , query: any) {
  const res = await put(`/movie/cooperation/${id}`, query)
  return res
}

// img
export async function mains(id: any ) {
  const res = await get(`/movie/${id}` )
  return res
}

/**
 * 全网热度
 * @param data
 * @description http://yapi.aiads-dev.com/project/161/interface/api/4904
 */
export async function trend(query: any, id: number | string = '') {
  const res = await get(`/movie/${id}/hot` , query)
  return res
}
