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


