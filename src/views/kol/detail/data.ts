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
      item: {
        name,
        photo,
      },
    }
  } = await get(`/kol/accounts/${id}`, { channelCode: channel })

  const result = {
    name,
    figure: photo,
  }

  return result
}
