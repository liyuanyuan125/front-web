import { get, post, put } from '@/fn/ajax'

/**
 * @export 分页查询影院列表
 * @param {*} query
 * @returns
 */
export async function cinmeaList(query: any) {
  return get('/customer/cinemas', query)
}

/**
 * @export 获取影院详情
 * @param {*} id
 * @returns
 */
export async function cinmeaId(id: any) {
  return get(`/theater/cinemas/${id}`)
}

/**
 * 查询影院统计信息
 * @param query 查询参数
 * https://yapi.aiads.com/project/103/interface/api/1538
 * 预防 GET 参数长度有限制，改为 POST 请求
 */
export async function queryStats(query: any = {}) {
  const res = post('/theater/cinemas/statistics', query)
  return res
}
