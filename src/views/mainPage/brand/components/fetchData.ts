/**
 * 品牌 & 产品详情相关接口
 * 由于需要根据本页面，进行数据格式的转换，具有一定的特殊性，所以单独放在这里，而不是 api 中
 */
import { get } from '@/fn/ajax'
import { keyBy } from 'lodash'
import { dayOffsetRange } from '@/util/date'
import { Type } from './types'
import { MapType } from '@/util/types'
import moment from 'moment'
import { groupBy } from 'lodash'
import { percent, readableNumber } from '@/util/dealData'

const urlMapStore = {
  // 品牌接口
  brand: {
    // https://yapi.aiads-dev.com/project/152/interface/api/4030
    home: (id: number) => `/brand/brands/${id}/home01`,

    // https://yapi.aiads-dev.com/project/152/interface/api/4054
    index: (id: number) => `/brand/brands/${id}/index`,

    // https://yapi.aiads-dev.com/project/152/interface/api/4470
    track: (id: number) => `/brand/brands/${id}/track`,
  },

  // 产品接口
  item: {
    // https://yapi.aiads-dev.com/project/152/interface/api/3990
    home: (id: number) => `/brand/products/${id}/home`,

    // https://yapi.aiads-dev.com/project/152/interface/api/4006
    index: (id: number) => `/brand/products/${id}/index`,

    // https://yapi.aiads-dev.com/project/152/interface/api/4479
    track: (id: number) => `/brand/products/${id}/track`,
  }
}

const cloudData = (title: string, color: string, words: string[]) => {
  return {
    title,
    titleTips: '',
    initDone: true,
    foreColor: [color],
    currentTypeIndex: 0,
    dict1: [],
    chartHeight: 100,
    dataList: [
      (words || []).map((name, i) => ({ name, value: Math.max(12, 20 - i) }))
    ]
  }
}

export default class FetchData {
  urlMap: MapType<string>

  constructor(private type: Type, private id: number) {
    this.urlMap = Object.entries(urlMapStore[type]).reduce((map, [key, val]) => {
      map[key] = val(id)
      return map
    }, {} as MapType<string>)
  }

  get isBrand() {
    return this.type == 'brand'
  }

  get isItem() {
    return this.type == 'item'
  }

  /**
   * 首页需要的一些基本数据
   */
  async getHome() {
    const {
      data: {
        item: {
          name,
          logoUrl,
          jyIndex,
          jyTrend,
          malePercent,
          femalePercent,
          comments,
          imgsUrl,

          unpay,
          onexecute,
          finish,

          // TODO: 假设 bigFigure 是大图字段的名称，请根据实际情况进行更改
          bigFigure,

          movies,
        }
      }
    } = await get(this.urlMap.home)

    const { positive = {}, passive = {}, neutral = {} } = keyBy(comments, 'code')

    // 产品图片列表
    const imgList = imgsUrl || []
    const figure = this.isItem ? imgList[0] : bigFigure

    const result = {
      item: {
        name,
        logoUrl,
        figure,
        jyIndex,
        jyTrend,
        malePercent: percent(malePercent),
        femalePercent: percent(femalePercent),

        unpay,
        onexecute,
        finish,
      },

      commentData: [
        { name: '正面', value: percent(positive.rate, 1), color: '#ca7273' },
        { name: '中立', value: percent(neutral.rate, 1), color: '#f3d872' },
        { name: '负面', value: percent(passive.rate, 1), color: '#57b4c9' },
      ],

      hotFilmGroup: movies && movies.length > 0
        ? (() => {
          const list = (movies as any[]).map(it => {
            const mdate = moment(String(it.releaseDate))
            const hasShow = it.releaseStatus >= 3
            const { custom, customPredict } = it
            return {
              ...it,
              date: mdate.format('MM月DD日'),
              month: mdate.month() + 1,
              // 是否已上映，上映状态描述在 https://yapi.aiads-dev.com/project/161/interface/api/4974
              hasShow,
              // 上映天数
              showDays: moment.duration(moment.now() - Number(mdate)).days(),
              boxOffice: readableNumber(hasShow ? custom : customPredict),
            }
          })
          const group = groupBy(list, 'month')
          const m = moment().month() + 1
          const ret = [m, m + 1, m + 2].map(it => ({
            name: `${it}月`,
            list: group[it]
          }))
          .filter(it => it.list != null)
          return ret
        })()
        : null,
    }

    return result
  }

  /**
   * 获取全网热度
   */
  async getIndex({
    beginDate,
    endDate
  }: any) {
    const { data } = await get(this.urlMap.index, {
      beginDate,
      endDate
    })
    return data
  }

  // 获取过去几天的，全网趋势纯数据
  async lastDaysIndex(days = 30) {
    const [beginDate, endDate] = dayOffsetRange(-days)
    const { items } = await this.getIndex({
      beginDate,
      endDate
    })
    const result = (items || []).map((it: any) => it.count || 0)
    return result
  }

  /**
   * 获取产品列表，只有品牌才有
   * https://yapi.aiads-dev.com/project/152/interface/api/3958
   */
  async getSubList() {
    const query = {
      brandId: this.id,
      pageIndex: 1,
      pageSize: 888
    }
    const { data: { items } } = await get('/brand/products', query)
    return items
  }

  /**
   * 计划跟踪效果（广告投放）
   */
  async getTrack(days = 20) {
    const [beginDate, endDate] = dayOffsetRange(-days)
    const { data: { items } } = await get(this.urlMap.track, {
      beginDate,
      endDate
    })
    const result = (items || []).map((it: any) => ({
      ...it,
      date: String(it.date).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'),
    }))
    return result
  }
}
