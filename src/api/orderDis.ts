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
 * 广告单 - 查看详情 确认影厅列表
 * @param  data
 */
export async function queryDetail(id: number, data: any) {
  const res = await put(`/xadvert/orders/${id}/target-cinemas`, data)
  return res
}



