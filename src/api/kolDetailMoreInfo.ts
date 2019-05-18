import { get, post, put } from '@/fn/ajax'
import { mockGet, typeTitle, tid, title20, dateRange } from './mock'

/**
 * platformInfoData1
 * @param query
 */
export async function platformData1(query: any) {
  // const res = await get('/xadvert/plans/effect' , query)
  // return res
  return await mockGet(query, {
    dataList: [{
      date: '2019-01-01',
      data: Math.floor(Math.random() * 100 + 1)
    }, {
      date: '2019-01-02',
      data: Math.floor(Math.random() * 100 + 1)
    }, {
      date: '2019-01-03',
      data: Math.floor(Math.random() * 100 + 1)
    }],
    coverCinema: 8,
    advertAmount: 1069.0,
    coverPeople: 856,
    coverScene: 92,
    effectTypeList: [{
      text: '未知',
      key: 0
    }, {
      text: '广告花费',
      key: 1
    }, {
      text: '覆盖人次',
      key: 2
    }, {
      text: '覆盖影院',
      key: 3
    }, {
      text: '覆盖场次',
      key: 4
    }]
  })
}
/**
 * platformInfoData2
 * @param data
 */
export async function comment1(query: any) {
  // const res = await get('/xadvert/plans/effectStatistics' , query)
  // return res
  return await mockGet(query, {
    pieNest: {
      dataList: [{
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }],
      coverCinema: 8,
      advertAmount: 1069.0,
      coverPeople: 856,
      coverScene: 92,
      effectTypeList: [{
        text: '中性',
        key: 0
      }, {
        text: '正面',
        key: 1
      }, {
        text: '负面',
        key: 2
      }]
    },
    barStack: {
      dataList: [{
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        date: '2019-01-02',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        date: '2019-01-03',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      },  {
        date: '2019-01-02',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      },  {
        date: '2019-01-03',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      },  {
        date: '2019-01-02',
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      },  {
        date: '2019-01-03',
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }],
      coverCinema: 8,
      advertAmount: 1069.0,
      coverPeople: 856,
      coverScene: 92,
      effectTypeList: [{
        text: '中性',
        key: 0
      }, {
        text: '正面',
        key: 1
      }, {
        text: '负面',
        key: 2
      }]
    },
    wordCloud1: {
      dataList: [
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        }, {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
      ],
      coverCinema: 8,
      advertAmount: 1069.0,
      coverPeople: 856,
      coverScene: 92,
      effectTypeList: [{
        text: '中性',
        key: 0
      }, {
        text: '正面',
        key: 1
      }, {
        text: '负面',
        key: 2
      }]
    },
    wordCloud2: {
      dataList: [
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        }, {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },
        {
          name: typeTitle(3, 10),
          value: Math.floor(Math.random() * 100 + 1)
        },

      ],
      coverCinema: 8,
      advertAmount: 1069.0,
      coverPeople: 856,
      coverScene: 92,
      effectTypeList: [{
        text: '中性',
        key: 0
      }, {
        text: '正面',
        key: 1
      }, {
        text: '负面',
        key: 2
      }]
    },
  })
}







