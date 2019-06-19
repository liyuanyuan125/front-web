import { get , post , put, del } from '@/fn/ajax'

/**
 * 推广管理 - 广告计划 - 列表
 * @param data
 */
export async function kolsList(data: any) {
  const res = await get('/customer/favorites/kols', data)
  return res
}

/**
 * 获取KOL账号列表
 * @param data
 */
export async function kolList(data: any) {
  const res = await get('/customer/favorites/kol-accounts', data)
  return res
}
