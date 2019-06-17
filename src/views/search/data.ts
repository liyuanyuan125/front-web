import { get } from '@/fn/ajax'

/**
 * 搜索影人
 * https://yapi.aiads-dev.com/project/148/interface/api/3286
 */
export async function searchFigure({
  keyword,
  pageIndex,
  pageSize
}: any) {
  const {
    data: {
      items,
      totalCount
    }
  } = await get('/person/search', {
    name: keyword,
    pageIndex,
    pageSize
  })

  const result = {
    list: items || [],
    totalCount,
  }

  return result
}
