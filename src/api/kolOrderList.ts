import { get , post , put, del } from '@/fn/ajax'

// kol- 订单列表
export async function orderList(data: any) {
  const res = await get('/kol/orders', data)
  return res
}

// 订单全部品牌
export async function orderBrand(userId: any) {
  const res = await get(`/kol/orders/brand/${userId}`)
  return res
}

// 取消订单
export async function cancelOrder(orderId: any) {
  const res = await put(`/kol/orders/cancel/${orderId}`)
  return res
}

// 待支付首款
export async function firstPaymentList(data: any) {
  const res = await put('/kol/orders/pay-advance', data)
  return res
}

// 待支付尾款
export async function restPaymentList(data: any) {
  const res = await put('/kol/orders/pay-rest', data)
  return res
}

// 删除订单
export async function delOrderList(orderId: any) {
  const res = await del(`/kol/orders/${orderId}`)
  return res
}

// 确定完成任务
export async function confirmFinish(id: any) {
  const res = await put(`/kol/orders/confirm-finish/${id}`)
  return res
}

// 草稿接口
export async function draftList(id: any) {
  const res = await get(`/kol/orders/draft/${id}`)
  return res
}
