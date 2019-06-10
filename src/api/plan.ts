import { get , post , put, del } from '@/fn/ajax'
import { mockGet, tid, title20, dateRange } from './mock'

/**
 * 推广管理 - 广告计划 - 列表
 * @param data
 */
export async function planList(data: any) {
  const res = await get('/xadvert/v1/plans', data)
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
 * 推广管理 - 广告计划 - 修改广告片
 * @param data
 */
export async function setVideo(id: any, query: any) {
  const res = await post(`/xadvert/v1/plans/${id}/video`, query)
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

/**
 * @param
 */
export async function orienteering(query: any) {
  return await mockGet(query, {
    statusList: [
      { key: 1, text: '草稿' },
      { key: 2, text: '审核' },
      { key: 3, text: '待执行' },
      { key: 4, text: '以执行' },
      { key: 5, text: '待支付' },
      { key: 6, text: '已支付' },
      { key: 7, text: '关联' },
      { key: 8, text: '取消' },
    ],
    'items|59': [{
      id: tid,
      name: title20,
      mainPicUrl: 'https://p.ssl.qhimg.com/dmfd/400_300_/t0120b2f23b554b8402.jpg',
      benginDate: dateRange(),
      endDate: dateRange(),
      budgetAmount: 3000,
      type: ['科幻', '悬疑', '惊悚'],
      sex: '男',
      age: 25,
      'status| 1-8': 1,
      viewNumber: 1234567,
      matching: 99.6,
      week: '2019/6/1~2019/6/7'
    }],
    totalCount: 50
  })
}

/**
 * 数据报表-数据  mock数据
 */
export async function dateMockList(data: any) {
  const res = await get('xadvert/plans/alldata', data)
  return res
}
