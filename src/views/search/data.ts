import { get } from '@/fn/ajax'
import { percent, intDate, textList, dot } from '@/util/dealData'

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
      totalCount,
      typeList
    }
  } = await get('/movie/search', {
    name: keyword,
    pageIndex,
    pageSize
  })

  const result = {
    list: (movies as any[] || []).map(it => {
      const { director, actor, release_date, types } = it
      return {
        ...it,
        directorName: (director || []).join('、'),
        actorName: (actor || []).join('、'),
        pubDate: intDate(release_date),
        typeName: textList(types, typeList).join('、')
      }
    }),
    total: totalCount || 0,
    similarList: [],
    hotList: []
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
      totalCount,
      similars,
      ranking
    }
  } = await get('/kol/search-kol', {
    query: keyword,
    pageIndex,
    pageSize
  })

  const result = {
    list: (items as any[] || []).map(it => {
      return {
        ...it,
        fansCount: dot(it.channelFans, '0.count'),
        fansRanking: dot(it.channelFans, '0.rank'),
      }
    }),
    total: totalCount || 0,
    similarList: (similars as any[] || []).map(it => ({
      id: it.id,
      name: it.name,
      avatar: it.photo
    })),
    hotList: (ranking as any[] || []).map(it => ({
      id: it.id,
      name: it.name,
      jyIndex: percent(it.jyIndex),
      // TODO: 全网热度？
      rank: it.hotIndex
    }))
  }

  return result
}
