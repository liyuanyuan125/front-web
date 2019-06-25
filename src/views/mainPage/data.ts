import { get } from '@/fn/ajax'
import { at, keyBy, sumBy } from 'lodash'
import { KeyText, MapType } from '@/util/types'
import { slice } from '@/fn/object'
import { dayOffsetRange } from '@/util/date'
import { percent, dot, intDate } from '@/util/dealData'

const getNames = (keys: string[], list: KeyText[]) => {
  const map = keyBy(list, 'key')
  const names = (keys || []).map((it: any) => dot(map[it], 'text') as string)
  return names
}

const monthDate = (date: number) => String(date).replace(/(\d{4})(\d{2})(\d{2})/, '$2-$3')

const hotChannelMap: MapType = {
  weibo: '微博',
  toutiao: '头条',
  wechat: '微信',
  baidu: '百度',
}

const hotData = (items: any[]) => {
  const list = (items || []).map(it => {
    const date = monthDate(it.date)
    const legends = (it.channels as any[] || [])
    .map((sub, i) => {
      return {
        name: sub.name || hotChannelMap[sub.chanelCode] || sub.chanelCode,
        no: `No.${sub.ranking}`,
        inc: sub.trend,
      }
    })

    return {
      name: date,
      value: it.count,
      rank: it.ranking,
      legends,
    }
  })

  return list
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
      item: {
        name,
        photo,
        jyIndex,
        ranking,
        tags,
        categoryRanking,
        accountCategoryCode,
        fansCounts,
        settlementPrices
      },

      accountCategoryList,
      channelList,
      fans,
      cooperateBrands,
      comments,

      indexes,
      works,
    }
  } = await get(`/kol/accounts/${id}`, { channelCode: channel })

  const cate = accountCategoryList.find((it: any) => it.key == accountCategoryCode)

  const fansTotal = sumBy(fansCounts, 'count')

  const channelMap = keyBy(channelList, 'key')

  const fansList = ((fansCounts || []) as any[]).map(it => ({
    icon: it.channelCode,
    name: dot(channelMap[it.channelCode], 'text'),
    percent: it.count * 100 / fansTotal,
    count: it.count
  }))

  const fansRate = keyBy(fans, 'k')

  const brandList = (cooperateBrands || []).map((it: any) => ({
    id: it.brandId,
    name: it.brandName,
    logo: it.brandLogo,
  }))

  const result = {
    bubbleList: tags || [],

    basic: {
      id,
      name,
      title: cate && cate.text,
      figure: photo,
      rankNo: percent(jyIndex, 2),
      rankTitle: [
        `全网排名：${ranking}`,
        cate ? `${cate.text}：${categoryRanking}` : ''
      ].filter(it => !!it).join('<br>')
    },

    fansRate: {
      man: percent(dot(fansRate.male, 'r')),
      woman: percent(dot(fansRate.female, 'r')),
    },

    fansList,

    navList: fansList.map(it => slice(it, 'icon,name')) as any[],

    brandData: brandList.length > 0 ? {
      list: brandList,
      more: {
        name: 'kol-detail-brand',
        params: { id }
      }
    } : null,

    commentData: comments && comments.length > 0 ? (() => {
      const map = keyBy(comments, 'code')
      return [
        { name: '正面', value: percent(dot(map.positive, 'rate')), color: '#ca7273' },
        { name: '中立', value: percent(dot(map.neutral, 'rate')), color: '#f3d872' },
        { name: '负面', value: percent(dot(map.passive, 'rate')), color: '#57b4c9' },
      ]
    })() : null,

    hotData: indexes && indexes.length > 0 ? (() => {
      const channelName = dot(channelMap[channel], 'text')
      const list = (indexes || []).map((it: any) => {
        const date = monthDate(it.date)
        const item = (it.channels || []).find((tt: any) => tt.code == channel)
        return item && {
          name: date,
          value: item.count,
          rank: item.ranking,
          trend: item.trend
        }
      })
      .filter((it: any) => it != null)
      return list.length > 0 ? {
        title: `近30日${channelName}微博指数`,
        list,
        category: cate && cate.text
      } : null
    })() : null,

    opusData: works && works.map((it: any) => {
      return {
        id: it.id,
        cover: it.coverPic,
        title: it.title,
        praise: it.likeCount,
        comment: it.commentCount,
        url: it.url,
        channelCode: it.channelCode,
      }
    }),

    offerData: settlementPrices && settlementPrices.length > 0
      ? {
        title: '投放报价',
        price: settlementPrices.map(({ categoryName, settlementPrice }: any) => {
          return `${categoryName}：¥${settlementPrice} 起`
        }).join('<br>')
      }
      : null
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

      searchKeywords,
      fansPortrait,

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
    bubbleList: searchKeywords || [],

    basic: {
      id,
      name,
      subName: nameEn,
      figure: mainPic,
      rankNo: percent(jyIndex, 2),
      rankTitle: `同档期：第${jyIndexSamePeriodRanking || 0}`,
    },

    hasShow,

    movie: {
      preview: trailers && trailers[0],
      director: dot(personMap, 'Director[0].name'),
      type: getNames(types, typeList).join('/'),
      date: intDate(releaseDate),
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

    fansRate: {
      man: percent(dot(fansPortrait, 'male')),
      woman: percent(dot(fansPortrait, 'female')),
    },

    boxToday: {
      title: hasShow ? '今日实时票房' : '累计想看人数',
      main: (hasShow ? boxofficeTodayCount : wantToSeeTotalCount) || 0,
      sub: `同档期排名 ${(hasShow ? boxofficeTodayRanking : wantToSeeSamePeriodRanking) || 0}`,
    },

    boxTotal: {
      title: hasShow ? '累计票房' : '预估票房',
      main: hasShow ? boxofficeTotalCount : predict
    },
  }

  return result
}

/**
 * 获取影片近 7 日新增观影、想看人数
 * 观影分析：https://yapi.aiads-dev.com/project/161/interface/api/4911
 * 想看分析：https://yapi.aiads-dev.com/project/161/interface/api/5072
 * @param id 影片 id
 * @param hasShow 是否已上映
 */
export async function getVideoRise(id: number, hasShow = false) {
  const [beginDate, endDate] = dayOffsetRange(-7)
  const url = hasShow ? `/movie/${id}/view` : `/movie/${id}/wanttosee`
  const { data } = await get(url, {
    beginDate,
    endDate
  })

  const dealList = (list: any[], path: string) => {
    const ret = (list || []).map(it => {
      const name = monthDate(it.date)
      const value = dot(it, path) || 0
      return { name, value }
    })
    return ret
  }

  const result = hasShow
    ? dealList(data, 'view.count')
    : dealList(data.items, 'count')

  return result
}

/**
 * 获取影片全网热度（暂定 60 天）
 * https://yapi.aiads-dev.com/project/161/interface/api/4904
 * @param id 影片 id
 */
export async function getVideoHot(id: number) {
  const [beginDate, endDate] = dayOffsetRange(-60)
  const {
    data: {
      items
    }
  } = await get(`/movie/${id}/hot`, {
    beginDate,
    endDate
  })

  const result = hotData(items)

  return result
}

/**
 * 影人详情
 * https://yapi.aiads-dev.com/project/146/interface/api/4497
 * @param id 影人 id
 */
export async function getFigure(id: number) {
  const {
    data: {
      item: {
        name,
        nameEn,
        headImgSmall,
        headImgBig,
        professions,
        jyIndex,
        tags,
        tip,
        fans,
        movies,
        brands,
        comments
      },
      professions: professionList,
    }
  } = await get(`/person/${id}`)

  const titleKeys = (professions as any[] || []).map(it => it.code)
  const titleList = getNames(titleKeys, professionList)

  const result = {
    bubbleList: tags || [],

    basic: {
      id,
      name,
      subName: nameEn,
      title: titleList.join('/'),
      figure: headImgSmall,
      rankNo: percent(jyIndex, 2),
      rankTitle: tip,
    },

    bigFigure: headImgBig,

    fansRate: {
      man: parseFloat(dot(fans, '男')),
      woman: parseFloat(dot(fans, '女'))
    },

    opusData: movies && movies.length > 0 ? {
      list: (movies as any[]).map(it => ({
        title: it.name,
        count: it.boxOffice + '亿'
      })),
      more: {
        name: 'film-figure-detail-works',
        params: { id }
      }
    } : null,

    brandData: brands && brands.length > 0 ? {
      list: (brands as any[]).map(it => ({
        id: it.id,
        name: it.name,
        logo: it.logo,
      })).slice(0, 3),
      more: {
        name: 'film-figure-detail-brand',
        params: { id }
      }
    } : null,

    commentData: comments && comments.length > 0 ? (() => {
      const map = keyBy(comments, 'code')
      return [
        { name: '正面', value: +dot(map.positive, 'rate') || 0, color: '#ca7273' },
        { name: '中立', value: +dot(map.neutral, 'rate') || 0, color: '#f3d872' },
        { name: '负面', value: +dot(map.passive, 'rate') || 0, color: '#57b4c9' },
      ]
    })() : null,
  }

  return result
}

/**
 * 获取影人近 7 日活跃粉丝数
 * https://yapi.aiads-dev.com/project/146/interface/api/4542
 * @param id 影人 id
 */
export async function getFigureActiveFans(id: number) {
  const [beginDate, endDate] = dayOffsetRange(-7)
  const {
    data: {
      items
    }
  } = await get(`/person/${id}/dau`, {
    beginDate,
    endDate
  })

  const result = (items as any[] || []).map(it => {
    const name = monthDate(it.data)
    return { name, value: it.count }
  })

  return result
}

/**
 * 获取影人近 30 天全网热度
 * https://yapi.aiads-dev.com/project/146/interface/api/4560
 * @param id 影人 id
 */
export async function getFigureHot(id: number) {
  const [beginDate, endDate] = dayOffsetRange(-30)
  const {
    data: {
      items
    }
  } = await get(`/person/${id}/hot`, {
    beginDate,
    endDate
  })

  const result = hotData(items)

  return result
}
