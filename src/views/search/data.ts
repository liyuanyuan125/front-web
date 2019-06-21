import { get } from '@/fn/ajax'
import { percent } from '@/util/dealData'

/**
 * 搜索影人
 * https://yapi.aiads-dev.com/project/146/interface/api/5079
 */
export async function searchFigure({
  keyword,
  pageIndex,
  pageSize
}: any) {
  const {
    data: {
      items,
      itemsTotalCount,
      similars,
      hotTops,
    }
  } = await get('/person/search', {
    keyword,
    pageIndex,
    pageSize
  })

  const result = {
    list: items || [],
    total: itemsTotalCount || 0,
    similarList: (similars as any[] || []).map(it => ({
      id: it.id,
      name: it.name,
      avatar: it.headImgSmall
    })),
    hotList: (hotTops as any[] || []).map(it => ({
      id: it.id,
      name: it.name,
      jyIndex: percent(it.jyIndex),
      // TODO: 全网热度？
      rank: it.fansRanking
    }))
  }

  return result
}

/**
 * 搜索 KOL
 * https://yapi.aiads-dev.com/project/144/interface/api/5086
 */
export async function searchKol({
  keyword,
  pageIndex,
  pageSize
}: any) {
  const {
    data: {
      items,
      totalCount
    }
  } = await get('/kol/search-kol', {
    name: '',
    pageIndex,
    pageSize
  })

  const result = {
    list: items || [],
    total: totalCount || 0,
  }

  return result
}

/**
 * 搜索影片
 * https://yapi.aiads-dev.com/project/161/interface/api/4974
 */
export async function searchFilm({
  keyword,
  pageIndex,
  pageSize
}: any) {
  const {
    data: {
      movies,
      totalCount
    }
  } = await get('/movie/search', {
    name: keyword,
    pageIndex,
    pageSize
  })

  const result = {
    list: movies || [],
    total: totalCount || 0,
  }

  return result
}
