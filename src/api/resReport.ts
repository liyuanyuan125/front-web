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
  return await mockGet(id, {
    item: {
      showCountSum: 144,
      personCountSum: 14976,
      profitAmountSum: 1251,
      orderReports: [
        {
          showCount: 18,
          personCount: 1872,
          profitAmount: 123456789,
          date: 20190619
        },
        {
          showCount: 27,
          personCount: 2808,
          profitAmount: 1404,
          date: 20190618
        },
        {
          showCount: 18,
          personCount: 1872,
          profitAmount: 936,
          date: 20190617
        },
        {
          showCount: 18,
          personCount: 1872,
          profitAmount: 936,
          date: 20190616
        },
        {
          showCount: 27,
          personCount: 2808,
          profitAmount: 1404,
          date: 20190615
        },
        {
          showCount: 18,
          personCount: 1872,
          profitAmount: 936,
          date: 20190614
        },
        {
          showCount: 18,
          personCount: 1872,
          profitAmount: 936,
          date: 20190613
        }
      ],
      movieShows: [
        {
          name: '绝对底线',
          id: 51830,
          showCount: 28
        },
        {
          name: '蝴蝶梦',
          id: 51831,
          showCount: 26
        },
        {
          name: '夺命金',
          id: 51829,
          showCount: 24
        },
        {
          name: '地心历险记2：神秘岛',
          id: 51833,
          showCount: 19
        },
        {
          name: '孙子从美国来',
          id: 51828,
          showCount: 16
        },
        {
          name: '高海拔之恋Ⅱ',
          id: 51832,
          showCount: 16
        },
        {
          name: '碟中谍4',
          id: 51827,
          showCount: 13
        }
      ],
      moviePersons: [
        {
          name: '绝对底线',
          id: 51830,
          personCount: 1456
        },
        {
          name: '蝴蝶梦',
          id: 51831,
          personCount: 1456
        },
        {
          name: '夺命金',
          id: 51829,
          personCount: 1248
        },
        {
          name: '地心历险记2：神秘岛',
          id: 51833,
          personCount: 988
        },
        {
          name: '孙子从美国来',
          id: 51828,
          personCount: 832
        },
        {
          name: '高海拔之恋Ⅱ',
          id: 51832,
          personCount: 832
        },
        {
          name: '碟中谍4',
          id: 51827,
          personCount: 676
        }
      ],
      movieProfits: [
        {
          name: '绝对底线',
          id: 51830,
          profitAmount: 123456789
        },
        {
          name: '蝴蝶梦',
          id: 51831,
          profitAmount: 2912
        },
        {
          name: '夺命金',
          id: 51829,
          profitAmount: 2496
        },
        {
          name: '地心历险记2：神秘岛',
          id: 51833,
          profitAmount: 1976
        },
        {
          name: '孙子从美国来',
          id: 51828,
          profitAmount: 1664
        },
        {
          name: '高海拔之恋Ⅱ',
          id: 51832,
          profitAmount: 1664
        },
        {
          name: '碟中谍4',
          id: 51827,
          profitAmount: 1352
        }
      ],
      cinemaShows: [
        {
          name: '新疆和田玉都国际影院',
          id: 10009,
          showCount: 26
        },
        {
          name: '上海市松江区保利国际影城上海泗泾店',
          id: 10006,
          showCount: 25
        },
        {
          name: '广西河池市大化县大化影城',
          id: 10008,
          showCount: 25
        },
        {
          name: '福建省三明市宁化万星影城',
          id: 10007,
          showCount: 19
        },
        {
          name: '江苏泰兴星轶联和影城',
          id: 10011,
          showCount: 18
        },
        {
          name: '四川雅安汉源太平洋影城',
          id: 10010,
          showCount: 16
        },
        {
          name: '重庆沙坪坝影城万达广场店',
          id: 10005,
          showCount: 15
        }
      ],
      cinemaPersons: [
        {
          name: '新疆和田玉都国际影院',
          id: 10009,
          personCount: 1352
        },
        {
          name: '上海市松江区保利国际影城上海泗泾店',
          id: 10006,
          personCount: 1300
        },
        {
          name: '广西河池市大化县大化影城',
          id: 10008,
          personCount: 1300
        },
        {
          name: '福建省三明市宁化万星影城',
          id: 10007,
          personCount: 988
        },
        {
          name: '江苏泰兴星轶联和影城',
          id: 10011,
          personCount: 936
        },
        {
          name: '四川雅安汉源太平洋影城',
          id: 10010,
          personCount: 832
        },
        {
          name: '重庆沙坪坝影城万达广场店',
          id: 10005,
          personCount: 780
        }
      ],
      cinemaProfits: [
        {
          name: '新疆和田玉都国际影院',
          id: 10009,
          profitAmount: 2704
        },
        {
          name: '上海市松江区保利国际影城上海泗泾店',
          id: 10006,
          profitAmount: 2600
        },
        {
          name: '广西河池市大化县大化影城',
          id: 10008,
          profitAmount: 2600
        },
        {
          name: '福建省三明市宁化万星影城',
          id: 10007,
          profitAmount: 1976
        },
        {
          name: '江苏泰兴星轶联和影城',
          id: 10011,
          profitAmount: 1872
        },
        {
          name: '四川雅安汉源太平洋影城',
          id: 10010,
          profitAmount: 1664
        },
        {
          name: '重庆沙坪坝影城万达广场店',
          id: 10005,
          profitAmount: 1560
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

