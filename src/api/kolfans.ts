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
 * @deprecated 缺少数据，重置日期 http://fapi.aiads-dev.com/person/107028/comments?beginDate=20170112&endDate=20191212
 */
export async function comment(query: any, id: string = '') {
  // const res = await get(`/person/${id}/comments`, query)
  const res = await get(`/brand/brands/${id}/comment`, query)
  return res
  return await mockGet(query, {
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
        key: 'last_7_day',
        text: '最近7天'
      },
      {
        key: 'last_30_day',
        text: '最近30天'
      },
      {
        key: 'last_90_day',
        text: '最近90天'
      }
    ],
    item: {
      totalCount: tid,
      rate: {
        neutral: tid,
        positive: tid,
        passive: tid
      },
      keywords: {
        yesterday: {
          // 可能没有value 接口无返回
          // 'positive|6': [
          //   {
          //     name: typeTitle(3, 10),
          //     value: Math.floor(Math.random() * 100 + 1)
          //   },
          // ],
          'positive|6': [
            title20
          ],
          'passive|6': [
            title20
          ]
        },
        last_90_day: {
          'positive|6': [
            title20
          ],
          'passive|6': [
            title20
          ]
        },
        last_7_day: {
          'positive|6': [
            title20
          ],
          'passive|6': [
            title20
          ]
        },
        last_30_day: {
          'positive|6': [
            title20
          ],
          'passive|6': [
            title20
          ]
        }
      },
      dates: [
        {
          date: 20190101,
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
          }
        },
        {
          date: 20190102,
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
          }
        },
        {
          date: 20190103,
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
          }
        }
      ]
    },
  })
}

/**
 * fans
 * @param id id
 * @description http://yapi.aiads-dev.com/project/146/interface/api/4524
 */
export async function fanslist(id: string = '' , query: any) {
  const res = await get(`/kol/accounts/${id}/fans-portrait` , query)
  return res
  return await mockGet({}, {
    item: {
      totalCount: 83724,
      genders: [
        {
          gender: 1,
          count: tid,
        },
        {
          gender: 2,
          count: tid,
        }
      ],
      ages: [
        {
          v: tid,
          k: '18岁以下'
        },
        {
          v: tid,
          k: '18-25岁'
        },
        {
          v: tid,
          k: '26-30岁'
        },
        {
          v: tid,
          k: '31-40岁'
        },
        {
          v: tid,
          k: '40岁以上'
        }
      ],
      cities: [
        {
          v: tid,
          k: '广州'
        },
        {
          v: tid,
          k: '北京'
        }
      ],
      provinces: [
        {
          v: tid,
          k: '广东'
        },
        {
          v: tid,
          k: '江苏'
        },
        {
          v: tid,
          k: '浙江'
        }
      ]
    },
    genders: [
      {
        key: 0,
        text: '未知'
      },
      {
        key: 1,
        text: '男'
      },
      {
        key: 2,
        text: '女'
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
