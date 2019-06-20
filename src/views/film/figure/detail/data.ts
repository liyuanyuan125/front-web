import { get } from '@/fn/ajax'

/**
 * 影人详情
 * https://yapi.aiads-dev.com/project/148/interface/api/3254
 */
export async function getFigure(id: number) {
  const {
    data: {
      item: {
        name,
        headImgSmall,
      }
    }
  } = await get(`/person/${id}`)

  const result = {
    name,
    figure: headImgSmall,
  }

  return result
}
