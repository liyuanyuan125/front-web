
// import { get } from '@/fn/ajax'
import { get , post , put , del } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

// 列表
export async function queryList(query: any) {
  const res = await get('/xadvert/third-monitors' , query)
  return res
}


// 新建合作申请
export async function addlist(query: any) {
  const res = await post(`/xadvert/third-monitors`, query)
  return res
}

// 详情
export async function itemlist(id: any) {
  const res = await get(`/xadvert/third-monitors/${id}`)
  return res
}

// 编辑合作申请
export async function editlist(id: any , query: any) {
  const res = await put(`/xadvert/third-monitors/${id}`, query)
  return res
}

// 上传表格
export async function uplist( query: any) {
  const res = await post(`/xadvert/third-monitors/upload-cinemas`, query)
  return res
}


// 删除
export async function dels(id: any) {
  const res = await del(`/xadvert/third-monitors/${id}`)
  return res
}


// 数据报表
export async function report(planMonitorId: any) {
  const res = await get(`/xadvert/third-plans/${planMonitorId}/report`)
  return res
}


// 分页影院数据
export async function reportcinemas(planMonitorId: any) {
  const res = await get(`/xadvert/third-plans/${planMonitorId}/report/cinemas`)
  return res
}


// 分页城市数据
export async function reportcities(planMonitorId: any) {
  const res = await get(`/xadvert/third-plans/${planMonitorId}/report/cities`)
  return res
}


/**
 * @name 影片搜索接口
 * @description http://yapi.aiads-dev.com/project/161/interface/api/5114
 * @description http://yapi.aiads-dev.com/project/161/interface/api/4974
 */
export async function searchcinema(query: any) {
  const res = await get(`/movie/search/` , query)
  return res
}
