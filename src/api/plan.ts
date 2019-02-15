import { get , post , put, del } from '@/fn/ajax'

/**
 * 推广管理 - 广告计划 - 列表
 * @param data
 */
export async function planList(data: any) {
  const res = await get('xadvert/plans', data)
  return res
}

/**
 * 推广管理 - 广告计划 - 批量删除
 * @param data
 */
export async function delCheckPlanList(query: any) {
  const res = await del('xadvert/plans', query)
  return res
}

/**
 * 推广管理 - 广告计划 - 关联广告片确定提交
 * @param data
 */
export async function relevanceVideo(data: any) {
  const res = await put('xadvert/plans/relevance-video', data)
  return res
}

/**
 * 推广管理 - 广告计划 - 关联广告片list
 * @param data
 */
export async function queryRelevanceList(data: any) {
  const res = await get('xadvert/videos')
  return res
}

/**
 * 推广管理 - 广告计划 - 查看详情
 * @param id
 */
export async function planDefault(id: any) {
  const res = await get(`xadvert/plans/${id}`)
  return res
}

/**
 * 推广管理 - 广告计划 - 根据广告计划id查询影院列表
 * @param data
 */
export async function cinemaList(data: any) {
  const res = await get('xadvert/plans/cinemas', data)
  return res
}

/**
 * 推广管理 - 广告计划 - 详情提交审核
 * @param id
 */
export async function subExamine(id: any) {
  const res = await put(`xadvert/plans/${id}/submit`)
  return res
}

/**
 * 推广管理 - 广告计划 - 支付
 * @param id
 */
export async function planPayment(id: any) {
  const res = await put(`xadvert/plans/${id}/pay`)
  return res
}

/**
 * 推广管理 - 广告计划 - 取消广告计划
 * @param id
 */
export async function planCancel(id: any) {
  const res = await put(`xadvert/plans/${id}/cancel`)
  return res
}

/**
 * 分页查询影院列表
 * @param data 查询数据
 * https://yapi.aiads.com/project/103/interface/api/1571
 */
export async function queryCinema(data: any) {
  const res = await post('/theater/cinemas/page-query', data)
  return res
}
