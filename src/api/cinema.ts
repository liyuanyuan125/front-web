import { get, post, put } from '@/fn/ajax'

/**
 * @export 分页查询影院列表
 * @param {*} query
 * @returns
 */
export async function cinmeaList(query: any) {
  return get('/theater/cinemas', query)
}

/**
 * @export 获取影院详情
 * @param {*} id
 * @returns
 */
export async function cinmeaId(id: any) {
  return get(`/theater/cinemas/${id}`)
}
