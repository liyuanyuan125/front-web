import { get , post , put } from '@/fn/ajax'


// KOL详情页 - 主要作品
export async function opusList(data: any) {
  const res = await get('/kol/accounts/works', data)
  return res
}

// KOL详情页 - 合作过的品牌
export async function brandList(id: any) {
  const res = await get(`/kol/accounts/${id}/brands`)
  return res
}
