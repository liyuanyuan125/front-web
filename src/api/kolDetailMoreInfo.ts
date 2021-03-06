import { get, post, put } from '@/fn/ajax'
import { mockGet, typeTitle, tid, title20, dateRange } from './mock'

/**
 * 查询KOL运营状况
 * @param id id
 * @description http://yapi.aiads-dev.com/project/144/interface/api/4578
 */
export async function platform(query: any, id: number | string = '') {
  // 演示 临时参数 nxd 20190621
  // id = '2061'
  // 演示 临时参数 nxd 20190621
  // query = {
  //   beginDate: '20160520',
  //   endDate: '20190620',
  //   channelCode: 'weibo'
  // }
  const res = await get(`kol/accounts/${id}/trends`, query)
  return res
  return await mockGet(query, {
    items: [
      // {
      //   id: tid,
      //   kolId: tid,
      //   channelCode: 'weibo',
      //   date: 20190602,
      //   dau: tid,
      //   likeCount: tid,
      //   commentCount: tid,
      //   playCount: tid,
      //   readCount: tid,
      //   forwardCount: tid,
      //   shareCount: tid
      // },
      // {
      //   id: tid,
      //   kolId: tid,
      //   channelCode: 'weibo',
      //   date: 20190603,
      //   dau: tid,
      //   likeCount: tid,
      //   commentCount: tid,
      //   playCount: tid,
      //   readCount: tid,
      //   forwardCount: tid,
      //   shareCount: tid
      // },
      // {
      //   id: tid,
      //   kolId: tid,
      //   channelCode: 'weibo',
      //   date: 20190604,
      //   dau: tid,
      //   likeCount: tid,
      //   commentCount: tid,
      //   playCount: tid,
      //   readCount: tid,
      //   forwardCount: tid,
      //   shareCount: tid
      // },
      // {
      //   id: tid,
      //   kolId: tid,
      //   channelCode: 'wechat',
      //   date: 20190602,
      //   dau: tid,
      //   likeCount: tid,
      //   commentCount: tid,
      //   playCount: tid,
      //   readCount: tid,
      //   forwardCount: tid,
      //   shareCount: tid
      // },
      // {
      //   id: tid,
      //   kolId: tid,
      //   channelCode: 'douyin',
      //   date: 20190602,
      //   dau: tid,
      //   likeCount: tid,
      //   commentCount: tid,
      //   playCount: tid,
      //   readCount: tid,
      //   forwardCount: tid,
      //   shareCount: tid
      // },
      // {
      //   id: tid,
      //   kolId: tid,
      //   channelCode: 'kuaishou',
      //   date: 20190602,
      //   dau: tid,
      //   likeCount: tid,
      //   commentCount: tid,
      //   playCount: tid,
      //   readCount: tid,
      //   forwardCount: tid,
      //   shareCount: tid
      // }
    ],
    channelList: [
      {
        text: '微博',
        key: 'weibo'
      },
      {
        text: '微信',
        key: 'wechat'
      },
      {
        text: '抖音',
        key: 'douyin'
      },
      {
        text: '快手',
        key: 'kuaishou'
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
 * comment
 * @param query 起止时间
 * @param id id
 * @description http://yapi.aiads-dev.com/project/144/interface/api/4587
 */
export async function comment(query: any, id: number | string = '') {
  // 演示 临时参数 nxd 20190621
  // id = 2061
  // query = {
  //   beginDate: 20170101,
  //   endDate: 20190607,
  //   channelCode: 'weibo'
  // }
  const res = await get(`/kol/accounts/${id}/comments`, query)
  return res
  return await mockGet(query, {
    rate: {
      neutral: tid,
      positive: tid,
      passive: tid
    },
    commentKeyword: {
      kolId: 2061,
      channelCode: 'weibo',
      yesterday: {
        positive: [
          '才华',
          '美丽',
          '正能量',
          '古灵精怪'
        ],
        negative: [
          '负面',
          '怨气',
          '消极',
          '负分'
        ]
      },
      sevenDay: {
        positive: [
          '才华',
          '美丽',
          '正能量',
          '古灵精怪'
        ],
        negative: [
          '负面',
          '怨气',
          '消极',
          '负分'
        ]
      },
      thirtyDay: {
        positive: [
          '才华',
          '美丽',
          '正能量',
          '古灵精怪'
        ],
        negative: [
          '负面',
          '怨气',
          '消极',
          '负分'
        ]
      },
      ninetyDay: {
        positive: [
          '才华',
          '美丽',
          '正能量',
          '古灵精怪'
        ],
        negative: [
          '负面',
          '怨气',
          '消极',
          '负分'
        ]
      },
      updateTime: '2019-06-18T10:14:16.958'
    },
    channelList: [
      {
        text: '微博',
        key: 'weibo'
      },
      {
        text: '微信',
        key: 'wechat'
      },
      {
        text: '抖音',
        key: 'douyin'
      },
      {
        text: '快手',
        key: 'kuaishou'
      }
    ],
    items: [
      {
        id: tid,
        kolId: tid,
        channelCode: 'weibo',
        date: 20190601,
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
      },
      {
        id: tid,
        kolId: tid,
        channelCode: 'weibo',
        date: 20190602,
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
      },
      {
        id: tid,
        kolId: tid,
        channelCode: 'weibo',
        date: 20190603,
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
      },
    ]
  })
}
/**
 * matching
 * @param data
 */
export async function matching(query: any) {
  const res = await get('/xadvert/plans/effectStatistics', query)
  return res
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
  const res = await get('/xadvert/plans/effectStatistics', query)
  return res
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
 * 查询KOL热度趋势
 * @param data
 * @description http://yapi.aiads-dev.com/project/144/interface/api/4569
 */
export async function trend(query: any, id: number | string = '') {
  // query = {
  //   beginDate: query.beginDate,
  //   endDate: query.endDate,
  //   channelCode: 'weibo'
  // }
  const res = await get(`/kol/accounts/${id}/indexes`, query)
  return res
  return await mockGet(query, {
    // no
  })
}


/**
 * 关键词评论列表
 * @param query 起止时间
 * @param id id
 * @description http://yapi.aiads-dev.com/project/144/interface/api/4960
 */
export async function keywordComment(query: any, id: number | string = '') {
  const res = await get(`/kol/accounts/${id}/hot-comment`, query)
  return res
  return await mockGet(query, {
    'items|10': [
      {
        id: tid,
        commentId: '55843740074381051314374009745219519weibo',
        content: '这是你520给大家发的男朋友吗？',
        sourceContent: '吹爆7号的颜！雕塑般的鼻子啊吹爆7号的颜！雕塑般的鼻子啊吹爆7号的颜！雕塑般的鼻子啊吹爆7号的颜！雕塑般的鼻子啊 ',
        sourceContentUrl: 'wwww.baidu.com',
        replyCount: 12,
        favorCount: 23,
        emotionType: 0,
        commentDate: '2019-5-20 13:04:10',
        highlightContent: '这是你520给<em>大</em><em>家</em>发的男朋友吗？'
      }
    ],

    totalCount: 2
  })
}

