import { get , post , put } from '@/fn/ajax'

// 数据统计
export async function nums() {
  const res = await get('/xadvert/dispatchs/statistics')
  return res
}

// 数据列表
export async function querylist(query: any) {
    const res = await get('/xadvert/dispatchs' , query)
    return res
}

/**
 * 广告单列表接口
 * @param data
 */
export async function queryOrderList(data: any) {
  const res = await get('/xadvert/orders', data)
  return res
}

/**
 * 广告单 - 拒绝接单
 * @param id
 */
export async function refuse(id: number) {
  const res = await put(`/xadvert/orders/${id}/refuse`)
  return res
}

/**
 * 广告单 - 确定接单
 * @param  data
 */
export async function reciveOrder(data: any) {
  const res = await put('/xadvert/orders/receive', data)
  return res
}

/**
 * 广告单 - 拒绝接单
 * @param  data
 */
export async function refuseOrder(data: any) {
  const res = await put('/xadvert/orders/refuse', data)
  return res
}

/**
 * 广告单 - 查看详情 确认影厅列表
 * @param  data
 * http://yapi.aiads-dev.com/project/139/interface/api/1964
 */
export async function queryDetail(id: number, data: any) {
  const res = await get(`/xadvert/orders/${id}/target-cinemas`, data)
  return res
}

/**
 * 广告单 - 指定公司下的影院列表
 * @param data
 * http://yapi.aiads-dev.com/project/128/interface/api/1526
 */
export async function queryCinemaList(data: any) {
  const res = await get('/theater/cinemas/query-for-current', data)
  return res
}

/**
 * 广告片名称查询
 * @param data
 */
export async function queryVideoName(data: any) {
  const res = await get('/xadvert/orders/video-name', data)
  return res
}

/**
 * 广告单详情
 * @param id
 */
export async function orderDetail(id: any) {
  const res = await get(`/xadvert/orders/${id}`)
  return res
}

/**
 * 广告单 - 详情页 接单影院
 * @param data
 */
export async function receiveCinemaList(id: any, data: any) {
  const res = await get(`/xadvert/orders/${id}/receive-cinemas`, data)
  return res
}

