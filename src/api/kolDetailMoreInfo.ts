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
        key: 0
      }, {
        date: '2019-01-02',
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
    bar2: {
      dataList: [{
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 4
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 4
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 4
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 4
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
      coverCinema: 8,
      advertAmount: 1069.0,
      coverPeople: 856,
      coverScene: 92,
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
      coverCinema: 8,
      advertAmount: 1069.0,
      coverPeople: 856,
      coverScene: 92,
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
        key: 0
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      },  {
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 4
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 4
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 4
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 4
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
      coverCinema: 8,
      advertAmount: 1069.0,
      coverPeople: 856,
      coverScene: 92,
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
      coverCinema: 8,
      advertAmount: 1069.0,
      coverPeople: 856,
      coverScene: 92,
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





