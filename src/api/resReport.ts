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
 * trend
 * @param query
 */
export async function trend(query: any) {
  // const res = await get(`/xadvert/v1/orders/2/report` , query)
  // return res
  return await mockGet(query, {
    item: {
      showCountSum: 200,
      personCountSum: 200,
      profitAmountSum: 200,
      orderReports: [
        {
          showCount: tid,
          personCount: tid,
          profitAmount: tid,
          date: 20190601
        },
        {
          showCount: tid,
          personCount: tid,
          profitAmount: tid,
          date: 20190602
        },
        {
          showCount: tid,
          personCount: tid,
          profitAmount: tid,
          date: 20190603
        },
        {
          showCount: tid,
          personCount: tid,
          profitAmount: tid,
          date: 20190604
        },
        {
          showCount: tid,
          personCount: tid,
          profitAmount: tid,
          date: 20190605
        },
        {
          showCount: tid,
          personCount: tid,
          profitAmount: tid,
          date: 20190606
        }
      ],
      movieShows: [
        {
          name: '地心历险记2：神秘岛1',
          id: 51833,
          showCount: 2001
        },
        {
          name: '地心历险记2：神秘岛2',
          id: 518331,
          showCount: 2001
        }
      ],
      moviePersons: [
        {
          name: '地心历险记2：神秘岛1',
          id: 51833,
          showCount: 2002
        },
        {
          name: '地心历险记2：神秘岛2',
          id: 518331,
          showCount: 2002
        }
      ],
      movieProfits: [
        {
          name: '地心历险记2：神秘岛1',
          id: 51833,
          showCount: 2003
        },
        {
          name: '地心历险记2：神秘岛2',
          id: 518331,
          showCount: 2003
        }
      ],
      cinemaShows: [
        {
          name: '内蒙古东融文化有限公司',
          id: 10003,
          showCount: 120
        },
        {
          name: '海林悦影影院有限公司',
          id: 10002,
          showCount: 80
        }
      ],
      cinemaPersons: [
        {
          name: '海林悦影影院有限公司',
          id: 10002,
          personCount: 120
        },
        {
          name: '内蒙古东融文化有限公司',
          id: 10003,
          personCount: 80
        }
      ],
      cinemaProfits: [
        {
          name: '内蒙古东融文化有限公司',
          id: 10003,
          profitAmount: 120
        },
        {
          name: '海林悦影影院有限公司',
          id: 10002,
          profitAmount: 80
        }
      ]
    }
  })
}
/**
 * 广告单列表接口
 * need status : 执行中、待结算、已完成
 * {text: "执行中", key: 3},{text: "待结算", key: 6},{text: "已完成", key: 7}
 * @param data
 */
export async function xadvertOrders(data: any) {
  const res = await get('/xadvert/v1/orders', data)
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
  return await mockGet(data, {
    'items|50': [
      {
        id: tid,
        status: typeInt(0, 7),
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
