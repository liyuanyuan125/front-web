import { get , post , put, del } from '@/fn/ajax'

/**
 * 获取电影收藏列表
 */
export async function getmovies() {
  const res = await get('/customer/favorites/movies')
  return res
}

/**
 * 获取收藏的影人列表
 */
export async function getpersons() {
  const res = await get('/customer/favorites/persons')
  return res
}

/**
 * 取消收藏
 */
export async function delcollect(query: any) {
  const res = await del('/customer/favorites', query)
  return res
}
