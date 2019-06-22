import { get, post, put } from '@/fn/ajax'
import { mockGet, typeTitle, tid, title20, dateRange } from './mock'

/**
 * 日期区间描述 暂未使用
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
  })
}
/**
 * 影人评论分析
 * @param query 起止时间
 * @param id id
 * @description https://yapi.aiads-dev.com/project/146/interface/api/4533
 * @deprecated 缺少数据，起止时间临时使用
 */
export async function comment(query: any, id: number | string = '') {
  // 演示 临时参数 nxd 20190621
  // id = '107028'
  // query = {
  //   beginDate: '20170112',
  //   endDate: '20191212'
  // }
  const res = await get(`/person/${id}/comments`, query)
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
 * 关键词评论列表
 * @param query 起止时间
 * @param id id
 * @description https://yapi.aiads-dev.com/project/146/interface/api/4695
 */
export async function keywordComment(query: any, id: number | string = '') {
  // 演示 临时参数 nxd 20190621
  // id = '375284'
  // query = {
  //   keyword: '大家',
  //   pageIndex: 1,
  //   pageSize: 10
  // }
  const res = await get(`/person/${id}/keyword-comments`, query)
  return res
  return await mockGet(query, {
    'items|10': [
      {
        id: tid,
        commentId: '448934333334811222222218361922554123749479949179weibo',
        content: '又咳fdkddjd的科大大家都jdlslihei-f7ca09d6e8.png" style="width:1em; height:1em;" /></span>',
        favorCount: 111,
        replyCount: 22,
        sourceContent: '医院开的药和现在每天每顿要吃的药，水喝得好饱。。。还老特么卡嗓子眼儿，一打嗝一股混合药味=w= ',
        sourceUrl: 'wwww.baidu.com',
        channelCode: 'weibo',
        channelName: '微博',
        emotionType: 2,
        commentDate: '2017-6-28',
        highLightWords: '咳fdkddjd的科<em style="color:red">大</em>都'
      }
    ],
    totalCount: 2
  })
}

/**
 * 粉丝画像
 * @param id id
 * @description http://yapi.aiads-dev.com/project/146/interface/api/4524
 */
export async function fans(id: string|number = '') {
  // 演示 临时参数 nxd 20190621
  // id = '375284'
  const res = await get(`/person/${id}/fans`)
  return res
  return await mockGet({}, {
    item: {
      totalCount: 288200,
      genders: [
        {
            gender: 1,
            rate: '31.40'
        },
        {
            gender: 2,
            rate: '68.60'
        }
      ],
      ages: [
          {
              v: '20.10',
              k: '0-17岁'
          },
          {
              v: '45.94',
              k: '18-24岁'
          },
          {
              v: '19.77',
              k: '25-29岁'
          },
          {
              v: '10.24',
              k: '30-39岁'
          },
          {
              v: '2.62',
              k: '40-49岁'
          },
          {
              v: '0.41',
              k: '50-59岁'
          },
          {
              v: '0.92',
              k: '60岁以上'
          }
      ],
      cities: [
          {
              v: '8.09',
              k: '上海'
          },
          {
              v: '6.45',
              k: '北京'
          },
          {
              v: '8.09',
              k: '广州'
          },
          {
              v: '6.45',
              k: '杭州'
          },
          {
              v: '8.09',
              k: '深圳'
          },
          {
              v: '6.45',
              k: '南京'
          },
          {
              v: '8.09',
              k: '重庆'
          },
          {
              v: '6.45',
              k: '成都'
          },
          {
              v: '8.09',
              k: '武汉'
          },
          {
              v: '6.45',
              k: '苏州'
          }
      ],
      provinces: [
          {
              v: '8.99',
              k: '广东'
          },
          {
              v: '7.17',
              k: '山东'
          },
          {
              v: '5.06',
              k: '江苏'
          },
          {
              v: '4.03',
              k: '北京'
          },
          {
              v: '4.36',
              k: '浙江'
          },
          {
              v: '4.09',
              k: '河南'
          },
          {
              v: '3.51',
              k: '四川'
          },
          {
              v: '3.27',
              k: '河北'
          },
          {
              v: '2.97',
              k: '辽宁'
          },
          {
              v: '2.68',
              k: '安徽'
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
 * 活跃粉丝数
 * @param id id
 * @description http://yapi.aiads-dev.com/project/146/interface/api/4542
 */
 export async function dau(query: any, id: number | string = '') {
  // 演示 临时参数 nxd 20190621
  query = {
    beginDate: '20160520',
    endDate: '20190620'
  }
  const res = await get(`/person/${id}/dau`, query)
  return res
  return await mockGet({}, {
    items: [
        {
            data: 20190520,
            count: 7262
        },
        {
            data: 20190521,
            count: 2313
        },
        {
            data: 20190522,
            count: 564
        },
        {
            data: 20190523,
            count: 67674
        },
        {
            data: 20190524,
            count: 234
        },
        {
            data: 20190525,
            count: 5452
        },
        {
            data: 20190526,
            count: 9387
        },
        {
            data: 20190527,
            count: 761
        },
        {
            data: 20190528,
            count: 716
        },
        {
            data: 20190529,
            count: 982
        },
        {
            data: 20190530,
            count: 777
        },
        {
            data: 20190531,
            count: 19881
        },
        {
            data: 20190601,
            count: 3445
        },
        {
            data: 20190602,
            count: 3445
        },
        {
            data: 20190603,
            count: 3445
        },
        {
            data: 20190604,
            count: 3445
        },
        {
            data: 20190605,
            count: 3445
        },
        {
            data: 20190606,
            count: 3445
        },
        {
            data: 20190607,
            count: 3445
        },
        {
            data: 20190608,
            count: 3445
        },
        {
            data: 20190609,
            count: 3445
        },
        {
            data: 20190610,
            count: 3445
        },
        {
            data: 20190611,
            count: 3445
        },
        {
            data: 20190612,
            count: 3445
        },
        {
            data: 20190613,
            count: 3445
        },
        {
            data: 20190614,
            count: 3445
        },
        {
            data: 20190615,
            count: 3445
        },
        {
            data: 20190616,
            count: 3445
        },
        {
            data: 20190617,
            count: 3445
        },
        {
            data: 20190618,
            count: 3445
        },
        {
            data: 20190619,
            count: 3445
        },
        {
            data: 20190620,
            count: 7262
        }
    ]
  })
}

/**
 * matching 影人受众匹配
 * @param query
 * @description
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
 * 全网热度
 * @param data
 * @description http://yapi.aiads-dev.com/project/146/interface/api/4560
 */
export async function trend(query: any, id: number | string = '') {
  query = {
    beginDate: '20160520',
    endDate: '20190620'
  }
  const res = await get(`/person/${id}/hot` , query)
  return res
  return await mockGet(query, {
    items: [
      {
        date: 20190101,
        count: tid,
        ranking: 3, // 综合热度在同类中的排名
        trend: 0, // 综合热度排名变化趋势，正负数分别表示上升和下降名词
        channels: [
          {
            name: '微博', // 平台名称
            count: tid, // 热度
            ranking: 3, // 在当前平台排名
            trend: 0  // 正负数表示上升或者下降名次
          },
          {
            name: '微信',
            count: tid,
            ranking: 3,
            trend: 0
          },
          {
            name: '百度',
            count: tid,
            ranking: 3,
            trend: 0
          },
          {
            name: '头条',
            count: tid,
            ranking: 3,
            trend: 0
          }
        ]
      },
      {
        date: 20190102,
        count: tid,
        ranking: 3,
        trend: 0,
        channels: [
          {
            name: '微博',
            count: tid,
            ranking: 3,
            trend: 0
          },
          {
            name: '微信',
            count: tid,
            ranking: 3,
            trend: 0
          },
          {
            name: '百度',
            count: tid,
            ranking: 3,
            trend: 0
          },
          {
            name: '头条',
            count: tid,
            ranking: 3,
            trend: 0
          }
        ]
      },
      {
        date: 20190103,
        count: tid,
        ranking: 3,
        trend: 0,
        channels: [
          {
            name: '微博',
            count: tid,
            ranking: 3,
            trend: 0
          },
          {
            name: '微信',
            count: tid,
            ranking: 3,
            trend: 0
          },
          {
            name: '百度',
            count: tid,
            ranking: 3,
            trend: 0
          },
          {
            name: '头条',
            count: tid,
            ranking: 3,
            trend: 0
          }
        ]
      }
    ]
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
