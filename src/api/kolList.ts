import { get , post , put, del } from '@/fn/ajax'

/**
 * KOL搜索表单
 */
export async function titleMsgList(channelCode: any) {
  const res = await get(`/kol/search-forms/${channelCode}`)
  return res
}

/**
 * 加入购物车
 */
export async function addShopIng(query: any) {
  const res = await post(`/kol/carts`, query)
  return res
}

/**
 * 加入收藏
 */
export async function addcollet(query: any) {
  const res = await post(`/customer/favorites`, query)
  return res
}

/**
 * 取消收藏
 */
export async function cancelcollect(query: any) {
  const res = await post(`/customer/favorites`, query)
  return res
}

/**
 * KOL搜索表单
 */
export async function queryList(channelCode: any) {
  const res = await get(`/kol/search-forms/${channelCode}`)
  return res
}

/**
 * KOL搜索表单
 */
export async function allcollect(query: any) {
  const res = await get(`/kol/channel-accounts/collections`, query)
  return res
}

/**
 * 指定区域
 */
export async function areaList(query: any) {
  const res = await get(`/basis/districts`, query)
  return res
}
/**
 * KOl搜索列表
 */
export async function kolmsglist(query: any) {
  const res = await get('/kol/search', query)
  return res
}

/**
 * 查询某公司账号下的购物车
 */
export async function kolShoppingCar() {
  const res = await get('/kol/carts')
  return res
}

/**
 * 删除购物车平台下的kol
 */
export async function delShopping(query: any) {
  const res = await del('/kol/carts', query)
  return res
}

/**
 * 清空购物车
 */
export async function delall(id: any) {
  const res = await del(`/kol/carts/clean/${id}`)
  return res
}

/**
 * 获取更新时间
 */
export async function updatetime(id: any) {
  const res = await get(`/kol/search/update-time`)
  return res
}
