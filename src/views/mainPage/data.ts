import { get } from '@/fn/ajax'

/**
 * KOL详情
 * https://yapi.aiads-dev.com/project/144/interface/api/4686
 */
export async function getKol({
  id,
  channel,
}: any) {
  const {
    data: {
    }
  } = await get(`/kol/accounts/${id}`, { channelCode: channel })
  const result = {
  }
  return result
}

/**
 * 影片详情
 * https://yapi.aiads-dev.com/project/161/interface/api/4751
 */
export async function getMovie(id: number) {
  const {
    data: {
    }
  } = await get(`/movie/${id}`)

  const result = {
    basic: {

    }
  }

  return result
}
