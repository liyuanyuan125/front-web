/**
 * 品牌 & 产品详情相关接口
 * 由于需要根据本页面，进行数据格式的转换，具有一定的特殊性，所以单独放在这里，而不是 api 中
 */
import { get } from '@/fn/ajax'
import { keyBy } from 'lodash'
import { dayOffsetRange } from '@/util/date'
import { Type } from './types'
import { MapType } from '@/util/types'

// 将后台的万分率转成百分率
const percent = (rate: number, digits = 0) => +((rate || 0) / 100).toFixed(digits)

const urlMapStore = {
  // 品牌接口
  brand: {
    // https://yapi.aiads-dev.com/project/152/interface/api/4030
    home: (id: number) => `/brand/brands/${id}/home`,

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
          planOnExecuteCount,
          comments,
          imgsUrl,

          // TODO: 假设 bigFigure 是大图字段的名称，请根据实际情况进行更改
          bigFigure,

          kolHandleCount,
          kolOnExecuteCount,
          kols,
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
        planOnExecuteCount
      },

      // 评论分析
      analyze: {
        positive: percent(positive.rate, 1),
        negative: percent(passive.rate, 1),
        neutral: percent(neutral.rate, 1),
        negativeTrend: percent(passive.trend, 1)
      },

      kol: {
        pendCount: kolHandleCount,
        runningCount: kolOnExecuteCount,
        recommendList: (kols || []).map((it: any) => ({
        }))
      }
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
