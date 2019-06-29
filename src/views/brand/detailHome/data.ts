import { get } from '@/fn/ajax'

/**
 * 品牌详情
 * https://yapi.aiads-dev.com/project/152/interface/api/4030
 */
export async function getBrand(id: number) {
  const {
    data: {
      item: {
        name,
        logoUrl,
      }
    }
  } = await get(`/brand/brands/${id}/home01`)

  const result = {
    name,
    figure: logoUrl,
  }

  return result
}
