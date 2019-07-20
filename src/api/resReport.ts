import { get, post, put } from '@/fn/ajax'
import { mockGet, typeTitle, tid, title20, dateRange, typeInt } from './mock'

/**
 * 广告成效
 * @param data
 */
export async function effect(query: any) {
  const res = await get('/xadvert/plans/effect', query)
  return res
}

export async function effectStatistics(query: any) {
  const res = await get('/xadvert/plans/effectStatistics', query)
  return res
}

/**
 * 资源方效果报表
 * @param query
 * @description http://yapi.aiads-dev.com/project/139/interface/api/4614
 */
export async function getTrend(id: number) {
  const res = await get(`/xadvert/orders/${id}/report` )
  return res
}

/**
 * 广告单列表接口
 * need status : 执行中、待结算、已完成
 * {text: "执行中", key: 3},{text: "待结算", key: 6},{text: "已完成", key: 7}
 * @param data
 * @description http://yapi.aiads-dev.com/project/139/interface/api/1937
 */
export async function xadvertOrders(data: any) {
  const res = await get('/xadvert/orders', data)
  return res
  return await mockGet(data, {
    items: [
      {
        id: tid,
        status: 3,
        videoId: 1,
        videoName: title20,
        estimateRevenue: 100.01,
        specification: 10,
        beginDate: 20190101,
        endDate: 20190110,
        cycle: 10,
        settlementAmount: null,
        targetCinemas: [
          10002,
          10003
        ],
        receiveCinemas: null,
        targetMovies: [
          {
            movieName: title20,
            movieId: 51833,
            beginDate: 20190101,
            endDate: 20190105,
            cycle: 7
          }
        ],
        createTime: 1560234038317,
        hallsCount: title20,
        sceneCount: title20,
        cinemaName: title20
      },
      {
        id: tid,
        status: 6,
        videoId: 1,
        videoName: title20,
        estimateRevenue: 100.01,
        specification: 10,
        beginDate: 20190101,
        endDate: 20190110,
        cycle: 10,
        settlementAmount: null,
        targetCinemas: [
          10002,
          10003
        ],
        receiveCinemas: null,
        targetMovies: [
          {
            movieName: title20,
            movieId: 51833,
            beginDate: 20190101,
            endDate: 20190105,
            cycle: 7
          }
        ],
        createTime: 1560234038317,
        hallsCount: title20,
        sceneCount: title20,
        cinemaName: title20
      },
      {
        id: tid,
        status: 7,
        videoId: 1,
        videoName: title20,
        estimateRevenue: 100.01,
        specification: 10,
        beginDate: 20190101,
        endDate: 20190110,
        cycle: 10,
        settlementAmount: null,
        targetCinemas: [
          10002,
          10003
        ],
        receiveCinemas: null,
        targetMovies: [
          {
            movieName: title20,
            movieId: 51833,
            beginDate: 20190101,
            endDate: 20190105,
            cycle: 7
          }
        ],
        createTime: 1560234038317,
        hallsCount: title20,
        sceneCount: title20,
        cinemaName: title20
      },
      {
        id: tid,
        status: 1,
        videoId: 1,
        videoName: title20,
        estimateRevenue: 100.01,
        specification: 10,
        beginDate: 20190101,
        endDate: 20190110,
        cycle: 10,
        settlementAmount: null,
        targetCinemas: [
          10002,
          10003
        ],
        receiveCinemas: null,
        targetMovies: [
          {
            movieName: title20,
            movieId: 51833,
            beginDate: 20190101,
            endDate: 20190105,
            cycle: 7
          }
        ],
        createTime: 1560234038317,
        hallsCount: title20,
        sceneCount: title20,
        cinemaName: title20
      }
    ]
  })
}

