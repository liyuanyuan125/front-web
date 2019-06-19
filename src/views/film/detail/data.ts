import { get } from '@/fn/ajax'

/**
 * 影片详情
 * https://yapi.aiads-dev.com/project/161/interface/api/4751
 */
export async function getMovie(id: number) {
  const {
    data: {
      name,
      mainPic,
    }
  } = await get(`/movie/${id}`)

  const result = {
    name,
    figure: mainPic,
  }

  return result
}
