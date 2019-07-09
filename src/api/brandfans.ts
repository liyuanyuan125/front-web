import { get, post, put } from '@/fn/ajax'
import { mockGet, typeTitle, tid, title20, dateRange } from './mock'

// 评论热词描述列表
export async function codelist(id: any , data: any) {
  const res = get(`/brand/brands/${id}/hot-comment`, data)
  return res
}

/**
 * 日期区间描述
 * @param data
 */
export async function dayRanges(query: any = { beginDate: 20191212, endDate: 20191212 }, id: number = 107028) {
  return await mockGet(query, {
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
    ],
  })
}
/**
 * comment
 * @param query 起止时间
 * @param id id
 * @description https://yapi.aiads-dev.com/project/146/interface/api/4533
 */
export async function comment(query: any, id: string = '') {
  const res = await get(`/brand/brands/${id}/comment`, query)
  return res
  return await mockGet(query, {
    rate: {
      neutral: '4001',
      positive: '0.4009',
      passive: '0.1990'
    },
    keyWords: {
        yesterDay: {
            positive: [
                '支持',
                '心所向',
                '喜欢',
                '大爱',
                '放心',
                '尊贵',
                '很棒',
                '改进',
                '希望',
                '豪华',
                '驰之以恒',
                '点赞',
                '不错',
                '一起'
            ],
            negative: [
                '出事',
                '倒霉',
                '店大欺客',
                '效率',
                '不办事',
                '不守信',
                '强制',
                '烂了',
                '真香',
                '不信'
            ]
        },
        ninetyDay: {
            positive: [
                '支持',
                '心所向',
                '放心',
                '尊贵',
                '很棒',
                '官方',
                '驰之以恒',
                '点赞',
                '不错',
                '一起',
                '服务'
            ],
            negative: [
                '漏油',
                '维权',
                '店大欺客',
                '金融服务费',
                '被堵',
                '强制',
                '收费',
                '利之星',
                '4S店',
                '西安',
                '罚款',
                '曝光',
                '真香',
                '不信'
            ]
        },
        sevenDay: {
            positive: [
                '服务公约',
                '支持',
                '心所向',
                '放心',
                '尊贵',
                '很棒',
                '官方',
                '驰之以恒',
                '点赞',
                '不错',
                '一起'
            ],
            negative: [
                '出事',
                '倒霉',
                '店大欺客',
                '效率',
                '不办事',
                '不守信',
                '黑心',
                '曝光',
                '强制',
                '收费',
                '4S店',
                '北京'
            ]
        },
        thirtyDay: {
            positive: [
                '心所向',
                '喜欢',
                '服务公约',
                '上海',
                '车展',
                '大爱',
                '放心',
                '尊贵',
                '点赞',
                '不错',
                '一起'
            ],
            negative: [
                '漏油',
                '维权',
                '店大欺客',
                '金融服务费',
                '被堵',
                '强制收费',
                '4S店',
                '利之星',
                '罚款',
                '曝光',
                '北京'
            ]
        }
    },
    items: [
        {
            date: 20190709,
            positive: {
                count: 229454,
                trend: 1515
            },
            passive: {
                count: 170924,
                trend: 909
            },
            neutral: {
                count: 142331,
                trend: 606
            }
        },
        {
            date: 20190708,
            positive: {
                count: 227939,
                trend: 1595
            },
            passive: {
                count: 170015,
                trend: 956
            },
            neutral: {
                count: 141725,
                trend: 638
            }
        },
        {
            date: 20190707,
            positive: {
                count: 226344,
                trend: 1184
            },
            passive: {
                count: 169059,
                trend: 845
            },
            neutral: {
                count: 141087,
                trend: 789
            }
        },
        {
            date: 20190706,
            positive: {
                count: 225160,
                trend: 1509
            },
            passive: {
                count: 168214,
                trend: 1078
            },
            neutral: {
                count: 140298,
                trend: 1005
            }
        },
        {
            date: 20190705,
            positive: {
                count: 223651,
                trend: 1337
            },
            passive: {
                count: 167136,
                trend: 955
            },
            neutral: {
                count: 139293,
                trend: 891
            }
        },
        {
            date: 20190704,
            positive: {
                count: 222314,
                trend: 1273
            },
            passive: {
                count: 166181,
                trend: 909
            },
            neutral: {
                count: 138402,
                trend: 848
            }
        },
        {
            date: 20190703,
            positive: {
                count: 221041,
                trend: 1339
            },
            passive: {
                count: 165272,
                trend: 956
            },
            neutral: {
                count: 137554,
                trend: 893
            }
        },
        {
            date: 20190702,
            positive: {
                count: 219702,
                trend: 1124
            },
            passive: {
                count: 164316,
                trend: 803
            },
            neutral: {
                count: 136661,
                trend: 750
            }
        }
    ]
  })
}

/**
 * fans
 * @param id id
 * @description http://yapi.aiads-dev.com/project/146/interface/api/4524
 */
export async function fans(id: string = '') {
  const res = await get(`/brand/brands/${id}/portrait`)
  return res
  return await mockGet({}, {
    item: {
      femalePercent: 3600,
      malePercent: null,
      ages: [
          {
              k: '0-19',
              v: 200,
              r: 200
          },
          {
              k: '20-29',
              v: 1200,
              r: 1200
          },
          {
              k: '30-39',
              v: 5100,
              r: 5100
          },
          {
              k: '40-49',
              v: 2800,
              r: 2800
          },
          {
              k: '50+',
              v: 700,
              r: 700
          }
      ],
      citys: [
          {
              id: 290,
              name: '北京市',
              count: 719,
              rate: 719
          },
          {
              id: 430,
              name: '上海市',
              count: 439,
              rate: 439
          },
          {
              id: 354,
              name: '深圳市',
              count: 279,
              rate: 279
          },
          {
              id: 353,
              name: '广州市',
              count: 243,
              rate: 243
          },
          {
              id: 138,
              name: '杭州市',
              count: 239,
              rate: 239
          },
          {
              id: 354,
              name: '成都市',
              count: 227,
              rate: 227
          },
          {
              id: 279,
              name: '苏州市',
              count: 198,
              rate: 198
          },
          {
              id: 108,
              name: '郑州市',
              count: 181,
              rate: 181
          },
          {
              id: 372,
              name: '重庆市',
              count: 170,
              rate: 170
          },
          {
              id: 416,
              name: '青岛市',
              count: 163,
              rate: 163
          }
      ],
      provinces: [
          {
              id: 23,
              name: '北京市',
              count: 719,
              rate: 719
          },
          {
              id: 29,
              name: '广东省',
              count: 709,
              rate: 709
          },
          {
              id: 21,
              name: '江苏省',
              count: 485,
              rate: 485
          },
          {
              id: 36,
              name: '上海市',
              count: 439,
              rate: 439
          },
          {
              id: 11,
              name: '浙江省',
              count: 416,
              rate: 416
          },
          {
              id: 34,
              name: '山东省',
              count: 319,
              rate: 319
          },
          {
              id: 24,
              name: '四川省',
              count: 279,
              rate: 279
          },
          {
              id: 8,
              name: '河南省',
              count: 243,
              rate: 243
          },
          {
              id: 31,
              name: '河北省',
              count: 198,
              rate: 198
          },
          {
              id: 5,
              name: '福建省',
              count: 194,
              rate: 194
          }
      ]
    },
    ageCodeList: [
        {
            controlStatus: 1,
            text: '19岁及以下',
            key: '0-19'
        },
        {
            controlStatus: 1,
            text: '20-29',
            key: '20-29'
        },
        {
            controlStatus: 1,
            text: '30-39',
            key: '30-39'
        },
        {
            controlStatus: 1,
            text: '40-49',
            key: '40-49'
        },
        {
            controlStatus: 1,
            text: '50+',
            key: '50+'
        }
    ]
  })
}

/**
 * matching 影人受众匹配
 * @param query
 * @description 在那屋
 */
export async function matching(query: any) {
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
 * 品牌列表含分页
 * @param query name pageIndex	pageSize
 * @description http://yapi.aiads-dev.com/mock/152/brand/brands
 */
export async function brands(query: any) {
  const res = await get(`/brand/brands`, query)
  return res
  return await mockGet(query, {
    item: {
      totalCount: 83724,
    }
  })
}

/**
 * 活跃粉丝数
 * @param id id
 * @description http://yapi.aiads-dev.com/project/152/interface/api/4054
 */
 export async function trend(query: any, id: number | string = '') {
  const res = await get(`/brand/brands/${id}/index`, query)
  return res
  return await mockGet({}, {
    items: [
      {
        id: tid,
        date: 20190602,
        brandId: 10121,
        trend: tid,
        count: tid,
        channels: [
          {
            name: '微博',
            count: tid,
            ranking: 10,
            trend: 50
          },
          {
            name: '头条',
            count: tid,
            ranking: 0,
            trend: 0
          },
          {
            name: '微信',
            count: tid,
            ranking: 0,
            trend: 0
          },
          {
            name: '百度',
            count: tid,
            ranking: 0,
            trend: 0
          }
        ]
      },
      {
        id: tid,
        date: 20190602,
        brandId: 10121,
        trend: tid,
        count: tid,
        channels: [
          {
            name: '微博',
            count: tid,
            ranking: 10,
            trend: 50
          },
          {
            name: '头条',
            count: tid,
            ranking: 0,
            trend: 0
          },
          {
            name: '微信',
            count: tid,
            ranking: 0,
            trend: 0
          },
          {
            name: '百度',
            count: tid,
            ranking: 0,
            trend: 0
          }
        ]
      },
      {
        id: tid,
        date: 20190602,
        brandId: 10121,
        trend: tid,
        count: tid,
        channels: [
          {
            name: '微博',
            count: tid,
            ranking: 10,
            trend: 50
          },
          {
            name: '头条',
            count: tid,
            ranking: 0,
            trend: 0
          },
          {
            name: '微信',
            count: tid,
            ranking: 0,
            trend: 0
          },
          {
            name: '百度',
            count: tid,
            ranking: 0,
            trend: 0
          }
        ]
      }
    ]
  })
}

/**
 * 关键词评论列表
 * @param query 起止时间
 * @param id id
 * @description http://yapi.aiads-dev.com/project/144/interface/api/4960
 */
export async function keywordComment(query: any, id: number | string = '') {
  // 演示 临时参数 nxd 20190621
  // id = '558'
  // query = {
  //   keyword: '大家',
  //   pageIndex: 1,
  //   pageSize: 10,
  //   channelCode: 'weibo'
  // }
  const res = await get(`/brand/brands/${id}/hot-comment`, query)
  return res
  // return await mockGet(query, {
  //   'items|10': [
  //     {
  //       id: tid,
  //       commentId: '55843740074381051314374009745219519weibo',
  //       content: '这是你520给大家发的男朋友吗？',
  //       sourceContent: '吹爆7号的颜！雕塑般的鼻子啊吹爆7号的颜！雕塑般的鼻子啊吹爆7号的颜！雕塑般的鼻子啊吹爆7号的颜！雕塑般的鼻子啊 ',
  //       sourceContentUrl: 'wwww.baidu.com',
  //       replyCount: 12,
  //       favorCount: 23,
  //       emotionType: 0,
  //       commentDate: '2019-5-20 13:04:10',
  //       highlightContent: '这是你520给<em>大</em><em>家</em>发的男朋友吗？'
  //     }
  //   ],

  //   totalCount: 2
  // })
}
