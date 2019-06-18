import { get } from '@/fn/ajax'
import { at, keyBy } from 'lodash'
import { KeyText } from '@/util/types'

const dot = (object: any, path: string) => at(object, path)[0]

const getNames = (keys: string[], list: KeyText[]) => {
  const map = keyBy(list, 'key')
  const names = (keys || []).map((it: any) => dot(map[it], 'text') as string)
  return names
}

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
      name,
      nameEn,
      mainPic,
      jyIndex,
      jyIndexSamePeriodRanking,
      trailers,

      releaseStatus,
      boxofficeTodayCount,
      boxofficeTodayRanking,
      wantToSeeTotalCount,
      wantToSeeSamePeriodRanking,
      boxofficeTotalCount,
      predict,

      personMap,
      types,
      typeList,
      releaseDate,
      countries,
      countryCodeList,

      celebrityRating,
    }
  } = await get(`/movie/${id}`)

  // 是否已上映，上映状态描述在 https://yapi.aiads-dev.com/project/161/interface/api/4974
  const hasShow = releaseStatus >= 3

  const result = {
    basic: {
      id,
      name,
      subName: nameEn,
      figure: mainPic,
      rankNo: jyIndex || 0,
      rankTitle: `同档期：第${jyIndexSamePeriodRanking || 0}`,
    },

    movie: {
      preview: trailers && trailers[0],
      director: dot(personMap, 'Director[0].name'),
      type: getNames(types, typeList).join('/'),
      date: releaseDate,
      address: getNames(countries, countryCodeList).join('/')
    },

    actorData: {
      star: celebrityRating,
      list: (dot(personMap, 'Actor') || []).slice(0, 3).map((it: any) => ({
        id: it.id,
        name: it.name,
        avatar: it.headImg
      })),
      more: {
        name: 'film-detail-creator',
        params: { id }
      }
    },

    boxToday: {
      title: hasShow ? '今日实时票房' : '累计想看人数',
      main: (hasShow ? boxofficeTodayCount : wantToSeeTotalCount) || 0,
      sub: `同档期排名 ${(hasShow ? boxofficeTodayRanking : wantToSeeSamePeriodRanking) || 0}`,
    },

    boxTotal: {
      title: hasShow ? '累计票房' : '预估票房',
      main: hasShow ? boxofficeTotalCount : predict
    }
  }

  return result
}
