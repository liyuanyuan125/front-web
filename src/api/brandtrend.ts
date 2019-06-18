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
 * comment
 * @param query 起止时间
 * @param id id
 * @description https://yapi.aiads-dev.com/project/146/interface/api/4533
 * @deprecated 缺少数据，重置日期 http://fapi.aiads-dev.com/kol/accounts/1/comments?beginDate=20170112&endDate=20191212
 */
export async function comment(query: any, id: string = '0') {
  // const res = await get(`/kol/accounts/${id}/comments`, query)
  // const res = await get(`/kol/accounts/1/comments`, {beginDate: 20170112, endDate: 20191212, channelCode: 'weibo'})
  // return res
  return await mockGet(query, {
    item: {
        totalCount: 54516,
        rate: {
            neutral: '33.33',
            positive: '33.33',
            passive: '33.33'
        },
        keywords: {
            yesterday: {
                positive: [
                    '特效',
                    '中国',
                    '国产'
                ],
                passive: [
                    '特效',
                    '中国',
                    '国产'
                ]
            },
            ninetyDay: {
                positive: [
                    '特效',
                    '中国',
                    '国产'
                ],
                passive: [
                    '特效',
                    '中国',
                    '国产'
                ]
            },
            sevenDay: {
                positive: [
                    '特效',
                    '中国',
                    '国产'
                ],
                passive: [
                    '特效',
                    '中国',
                    '国产'
                ]
            },
            thirtyDay: {
                positive: [
                    '特效',
                    '中国',
                    '国产'
                ],
                passive: [
                    '特效',
                    '中国',
                    '国产'
                ]
            }
        },
        dates: [
            {
                date: 20190101,
                positive: {
                    count: 18172,
                    trend: 99
                },
                passive: {
                    count: 18172,
                    trend: 54
                },
                neutral: {
                    count: 18172,
                    trend: 23
                }
            },
            {
                date: 20190102,
                positive: {
                    count: 18172,
                    trend: 11
                },
                passive: {
                    count: 18172,
                    trend: 8
                },
                neutral: {
                    count: 18172,
                    trend: 76
                }
            },
            {
                date: 20190103,
                positive: {
                    count: 18172,
                    trend: 88
                },
                passive: {
                    count: 18172,
                    trend: 22
                },
                neutral: {
                    count: 18172,
                    trend: 33
                }
            }
        ]
    },
    emotion: [
        {
            key: 'positive',
            text: '正面'
        },
        {
            key: 'passive',
            text: '负面'
        },
        {
            key: 'neutral',
            text: '中性'
        }
    ],
    dayRanges: [
          {
              key: 'yesterday',
              text: '昨日'
          },
          {
              key: 'sevenDay',
              text: '最近7天'
          },
          {
              key: 'thirtyDay',
              text: '最近30天'
          },
          {
              key: 'ninetyDay',
              text: '最近90天'
          }
      ]
  })
  return await mockGet(query, {
    rate: {
      neutral: tid,
      positive: tid,
      passive: tid
    },
    'items|10': [{
        id: 0,
        kolId: 1,
        channelCode: 'weibo',
        date: 20190600,
        positive: {
          count: tid,
          trend: tid
        },
        passive: {
          count: tid,
          trend: tid
        },
        neutral: {
          count: tid,
          trend: tid
        },
        updateTime: null
      }
    ],
    commentKeyword: {
      kolId: 1,
      channelCode: 'weibo',
      yesterday: {
        'positive|6': [
          title20
        ],
        'passive|6': [
          title20
        ]
      },
      sevenDay: {
        'positive|6': [
          title20
        ],
        'passive|6': [
          title20
        ]
      },
      thirtyDay: {
        'positive|6': [
          title20
        ],
        'passive|6': [
          title20
        ]
      },
      ninetyDay: {
        'positive|6': [
          title20
        ],
        'passive|6': [
          title20
        ]
      },
      updateTime: dateRange()
    }
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
    chart1: {
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
    chart2: {
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
export async function trend(id: any , query: any) {
  const res = await get(`/brand/brands/${id}/index` , query)
  return res
  // return await mockGet(query, {
  //   chart1: {
  //     dataList: [{
  //       date: '2019-01-01',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 0
  //     }, {
  //       date: '2019-01-02',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 0
  //     }, {
  //       date: '2019-01-03',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 0
  //     }, {
  //       date: '2019-01-04',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 0
  //     }, {
  //       date: '2019-01-05',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 0
  //     }],
  //     effectTypeList: []
  //   },
  //   chart2: {
  //     dataList: [{
  //       date: '2019-01-01',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 0
  //     }, {
  //       date: '2019-01-02',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 0
  //     }, {
  //       date: '2019-01-03',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 0
  //     }, {
  //       date: '2019-01-04',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 0
  //     }, {
  //       date: '2019-01-05',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 0
  //     }, {
  //       date: '2019-01-01',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 1
  //     }, {
  //       date: '2019-01-02',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 1
  //     }, {
  //       date: '2019-01-03',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 1
  //     }, {
  //       date: '2019-01-04',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 1
  //     }, {
  //       date: '2019-01-05',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 1
  //     }, {
  //       date: '2019-01-01',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 2
  //     }, {
  //       date: '2019-01-02',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 2
  //     }, {
  //       date: '2019-01-03',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 2
  //     }, {
  //       date: '2019-01-04',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 2
  //     }, {
  //       date: '2019-01-05',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 2
  //     }, {
  //       date: '2019-01-01',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 3
  //     }, {
  //       date: '2019-01-02',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 3
  //     }, {
  //       date: '2019-01-03',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 3
  //     }, {
  //       date: '2019-01-04',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 3
  //     }, {
  //       date: '2019-01-05',
  //       data: Math.floor(Math.random() * 100 + 1),
  //       key: 3
  //     } ],
  //     effectTypeList: [{
  //       text: '微博指数',
  //       key: 0
  //     }, {
  //       text: '微信指数',
  //       key: 1
  //     }, {
  //       text: '百度指数',
  //       key: 2
  //     }, {
  //       text: '头条指数',
  //       key: 3
  //     }]
  //   }
  // })
}



