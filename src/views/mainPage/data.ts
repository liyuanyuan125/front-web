import { get } from '@/fn/ajax'
import { keyBy, sumBy } from 'lodash'
import { KeyText, MapType, MovieStatus } from '@/util/types'
import { slice } from '@/fn/object'
import { dayOffsetRange } from '@/util/date'
import { percent, dot, intDate, readableThousands, readableNumber } from '@/util/dealData'
import store from '@/store'

const { defaultAvatar } = store.state

const getNames = (keys: string[], list: KeyText[]) => {
  const map = keyBy(list, 'key')
  const names = (keys || []).map((it: any) => dot(map[it], 'text') as string)
  return names
}

const fullDate = (date: number) => String(date).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')

const monthDate = (date: number) => String(date).replace(/(\d{4})(\d{2})(\d{2})/, '$2-$3')

const hotChannelMap: MapType = {
  weibo: '微博',
  toutiao: '头条',
  wechat: '微信',
  baidu: '百度',
}

const hotData = (items: any[]) => {
  const list = (items || []).map(it => {
    const date = fullDate(it.date)
    const mdate = monthDate(it.date)
    const legends = (it.channels as any[] || [])
    .map(sub => {
      return {
        name: sub.name || hotChannelMap[sub.chanelCode] || sub.chanelCode,
        no: sub.ranking ? `No.${sub.ranking}` : '-',
        inc: sub.trend,
        incShow: readableThousands(Math.abs(sub.trend))
      }
    })

    return {
      name: mdate,
      value: it.count,
      date,
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
        description,
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
    count: readableNumber(it.count)
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
      title: description,
      figure: photo,
      rankNo: percent(jyIndex, 2),
      rankTitle: [
        `全网排名：${ranking || '-'}`,
        cate ? `${cate.text}：${categoryRanking || '-'}` : ''
      ].filter(it => !!it).join('<br>')
    },

    fansRate: {
      man: percent(dot(fansRate.male, 'r'), 2),
      woman: percent(dot(fansRate.female, 'r'), 2),
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

    commentData: (() => {
      if (comments == null || comments.length == 0) {
        return []
      }
      const map = keyBy(comments, 'code')
      const ret = [
        {
          name: '正面',
          value: percent(dot(map.positive, 'rate')),
          trend: +dot(map.positive, 'trend') || 0,
          color: '#ca7273'
        },

        {
          name: '中立',
          value: percent(dot(map.neutral, 'rate')),
          trend: +dot(map.neutral, 'trend') || 0,
          color: '#f3d872'
        },

        {
          name: '负面',
          value: percent(dot(map.passive, 'rate')),
          trend: +dot(map.passive, 'trend') || 0,
          color: '#57b4c9'
        },
      ]
      const allZero = ret.every(it => it.value == 0)
      return allZero ? [] : ret
    })(),

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
        title: `近30日${channelName}指数`,
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

    offerData: {
      title: '投放报价',
      priceList: (settlementPrices || []).map(({ categoryName, settlementPrice }: any) => {
        const price = readableThousands(settlementPrice)
        return {
          name: categoryName,
          value: price != '-' ? `¥${price} 起` : price
        }
      })
    }
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

      tags,
      genders,

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
  const status = (releaseStatus || 0) as MovieStatus

  const genderMap = keyBy(genders, 'gender')

  const result = {
    bubbleList: tags || [],

    basic: {
      id,
      name,
      // 产品要去，如果英文名与 name 一致，则不显示
      subName: nameEn == name ? '' : nameEn,
      figure: mainPic,
      rankNo: percent(jyIndex, 2),
      rankTitle: `同档期：第${jyIndexSamePeriodRanking || '-'}`,
    },

    hasShow,
    status,

    movie: {
      preview: trailers && trailers[0],
      director: dot(personMap, 'Director[0].name') || '-',
      type: getNames(types, typeList).join('/') || '-',
      date: intDate(releaseDate) || '-',
      address: (countries || []).join('/') || '-'
    },

    actorData: {
      star: celebrityRating,
      list: (dot(personMap, 'Actor') as any[] || [])
        .filter(it => it != null)
        .slice(0, 3)
        .map((it: any) => ({
          id: it.id,
          name: it.name,
          avatar: it.headImg || defaultAvatar
        })),
      more: {
        name: 'film-detail-creator',
        params: { id }
      }
    },

    fansRate: {
      man: percent(dot(genderMap, '1.rate') * 100, 2),
      woman: percent(dot(genderMap, '2.rate') * 100, 2),
    },

    boxToday: {
      title: hasShow ? '今日实时票房' : '累计想看人数',
      main: hasShow
        ? readableNumber(boxofficeTodayCount)
        : readableThousands(wantToSeeTotalCount),
      sub: (status == MovieStatus.coming ? '同档期' : '')
        + `排名 ${(hasShow ? boxofficeTodayRanking : wantToSeeSamePeriodRanking) || '-'}`,
    },

    boxTotal: {
      title: hasShow ? '累计票房' : '预估票房',
      main: readableNumber(hasShow ? boxofficeTotalCount : predict)
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
    const ret = (list || [])
    .sort((a, b) => a.date - b.date)
    .map(it => {
      const name = monthDate(it.date)
      const value = dot(it, path) || 0
      const date = fullDate(it.date)
      return { name, value, date }
    })
    return ret
  }

  const result = hasShow
    ? dealList(data, 'view.trend')
    : dealList(data.items, 'trend')

  return result
}

/**
 * 获取影片全网热度
 * https://yapi.aiads-dev.com/project/161/interface/api/4904
 * @param id 影片 id
 */
export async function getVideoHot(id: number) {
  const [beginDate, endDate] = dayOffsetRange(-30)
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
      man: percent(parseFloat(dot(fans, '男')) * 100, 2),
      woman: percent(parseFloat(dot(fans, '女')) * 100, 2)
    },

    opusData: movies && movies.length > 0 ? {
      list: (movies as any[]).map(it => ({
        title: it.name,
        count: readableNumber(it.boxOffice)
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

    commentData: (() => {
      if (comments == null || comments.length == 0) {
        return []
      }
      const map = keyBy(comments, 'code')
      return [
        {
          name: '正面',
          value: +dot(map.positive, 'rate') || 0,
          trend: +dot(map.positive, 'trend') || 0,
          color: '#ca7273'
        },

        {
          name: '中立',
          value: +dot(map.neutral, 'rate') || 0,
          trend: +dot(map.neutral, 'trend') || 0,
          color: '#f3d872'
        },

        {
          name: '负面',
          value: +dot(map.passive, 'rate') || 0,
          trend: +dot(map.passive, 'trend') || 0,
          color: '#57b4c9'
        },
      ]
    })(),
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
