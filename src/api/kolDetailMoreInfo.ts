import { get, post, put } from '@/fn/ajax'
import { mockGet, typeTitle, tid, title20, dateRange } from './mock'

/**
 * platformInfoData1
 * @param query
 */
export async function platformData(query: any) {
  // const res = await get('/xadvert/plans/effect' , query)
  // return res
  return await mockGet(query, {
    chart1: {
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
        date: '2019-01-04',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        date: '2019-01-05',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        date: '2019-01-02',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        date: '2019-01-03',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        date: '2019-01-04',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        date: '2019-01-05',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }, {
        date: '2019-01-02',
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }, {
        date: '2019-01-03',
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }, {
        date: '2019-01-04',
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }, {
        date: '2019-01-05',
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }, {
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        date: '2019-01-02',
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        date: '2019-01-03',
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        date: '2019-01-04',
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        date: '2019-01-05',
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }],
      effectTypeList: [{
        text: '活跃粉丝数',
        key: 0
      }, {
        text: '点赞数',
        key: 1
      }, {
        text: '评论数',
        key: 2
      }, {
        text: '播放数',
        key: 3
      }]
    }
  })
}

/**
 * comment1
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
/**
 * matching
 * @param data
 */
export async function matching(query: any) {
  // const res = await get('/xadvert/plans/effectStatistics' , query)
  // return res
  return await mockGet(query, {
    bar1: {
      dataList: [{
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0,
        key2: 0
      }, {
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0,
        key2: 1
      }, {
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1,
        key2: 0
      }, {
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1,
        key2: 1
      }],
      effectTypeList1: [{
        text: 'Papi酱',
        key: 0
      }, {
        text: '奔驰',
        key: 1
      }],
      effectTypeList2: [{
        text: '男',
        key: 0
      }, {
        text: '女',
        key: 1
      }]
    },
    bar2: {
      dataList: [{
        data: Math.floor(Math.random() * 100 + 1),
        key: 0,
        key2: 0,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0,
        key2: 1,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0,
        key2: 2,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0,
        key2: 3,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0,
        key2: 4,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1,
        key2: 0,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1,
        key2: 1,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1,
        key2: 2,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1,
        key2: 3,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1,
        key2: 4,
      }],
      effectTypeList1: [{
        text: 'Papi酱',
        key: 0
      }, {
        text: '奔驰',
        key: 1
      }],
      effectTypeList2: [{
        text: '19岁及以下',
        key: 0
      }, {
        text: '20-29岁',
        key: 1
      }, {
        text: '30-29岁',
        key: 2
      }, {
        text: '40-49岁',
        key: 3
      }, {
        text: '50岁及以上',
        key: 4
      }]
    },
    bar3: {
      dataList: [{
        itemName: '广东',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '北京',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '江苏',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '广东',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        itemName: '江苏省',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        itemName: '浙江省',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }],
      effectTypeList: [{
        text: 'Papi酱',
        key: 0
      }, {
        text: '奔驰',
        key: 1
      }]
    },
    bar4: {
      dataList: [{
        itemName: '重庆',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '上海',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '天津',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '广东',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        itemName: '厦门',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        itemName: '浙江省',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }],
      effectTypeList: [{
        text: 'Papi酱',
        key: 0
      }, {
        text: '奔驰',
        key: 1
      }]
    }
  })
}
/**
 * fans
 * @param data
 */
export async function fans(query: any) {
  // const res = await get('/xadvert/plans/effectStatistics' , query)
  // return res
  return await mockGet(query, {
    chart1: {
      dataList: [{
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }],
      coverCinema: 8,
      advertAmount: 1069.0,
      coverPeople: 856,
      coverScene: 92,
      effectTypeList: [{
        text: '男',
        key: 0
      }, {
        text: '女',
        key: 1
      }]
    },
    chart2: {
      dataList: [{
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 4
      }],
      effectTypeList: [{
        text: '19岁及以下',
        key: 0
      }, {
        text: '20-29岁',
        key: 1
      }, {
        text: '30-29岁',
        key: 2
      }, {
        text: '40-49岁',
        key: 3
      }, {
        text: '50岁及以上',
        key: 4
      }]
    },
    chart3: {
      dataList: [{
        itemName: '广东',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '北京',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '江苏',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '广东',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        itemName: '江苏省',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        itemName: '浙江省',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }],
      effectTypeList: [{
        text: 'Papi酱',
        key: 0
      }, {
        text: '奔驰',
        key: 1
      }]
    },
    chart4: {
      dataList: [{
        itemName: '重庆',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '上海',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '天津',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '广东',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        itemName: '厦门',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        itemName: '浙江省',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }],
      effectTypeList: [{
        key: 0,
        name: '省份'
      },
      {
        key: 1,
        name: '城市'
      }]
    }
  })
}

/**
 * trend
 * @param data
 */
export async function trend(query: any) {
  // const res = await get('/xadvert/plans/effectStatistics' , query)
  // return res
  return await mockGet(query, {
    chart1: {
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
        date: '2019-01-04',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        date: '2019-01-05',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }],
      effectTypeList: []
    },
    chart2: {
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
        date: '2019-01-04',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        date: '2019-01-05',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        date: '2019-01-02',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        date: '2019-01-03',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        date: '2019-01-04',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        date: '2019-01-05',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }, {
        date: '2019-01-02',
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }, {
        date: '2019-01-03',
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }, {
        date: '2019-01-04',
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }, {
        date: '2019-01-05',
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }, {
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        date: '2019-01-02',
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        date: '2019-01-03',
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        date: '2019-01-04',
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        date: '2019-01-05',
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      } ],
      effectTypeList: [{
        text: '微博指数No.1',
        key: 0
      }, {
        text: '微信指数No.2',
        key: 1
      }, {
        text: '百度指数No.3',
        key: 2
      }, {
        text: '头条指数No.1',
        key: 3
      }]
    }
  })
}



