
// import { get } from '@/fn/ajax'
import { get, post, put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

// 列表
export async function queryList(query: any) {
  const res = await get('/movie/cooperation/', query)
  return res
}

// 根绝id查询列表详情
export async function itemlist(id: any) {
  const res = await get(`/movie/cooperation/${id}`)
  return res
}

// 新建合作申请
export async function addlist(query: any) {
  const res = await post(`/movie/cooperation/`, query)
  return res
}

// 根绝id查询影片详情/movie/{id}
export async function filmlist(id: any) {
  const res = await get(`/movie/${id}`)
  return res
}

// img
export async function imgs(id: any, query: any) {
  const res = await put(`/movie/cooperation/${id}`, query)
  return res
}

// img
export async function mains(id: any) {
  const res = await get(`/movie/${id}`)
  return res
}

/**
 * 全网热度
 * @param data
 * @description http://yapi.aiads-dev.com/project/161/interface/api/4904
 */
export async function trend(query: any, id: number | string = '') {
  const res = await get(`/movie/${id}/hot` , query)
  return res
  return await mockGet(query, {
    items: [
      {
        date: 20170101,
        count: tid,
        ranking: tid,
        trend: tid,
        channels: [
          {
            chanelCode: 'weibo',
            count: tid,
            ranking: tid,
            trend: tid
          },
          {
            chanelCode: 'toutiao',
            count: tid,
            ranking: tid,
            trend: tid
          },
          {
            chanelCode: 'wechat',
            count: tid,
            ranking: tid,
            trend: tid
          },
          {
            chanelCode: 'baidu',
            count: tid,
            ranking: tid,
            trend: tid
          }
        ]
      },
      {
        date: 20170102,
        count: tid,
        ranking: tid,
        trend: tid,
        channels: [
          {
            chanelCode: 'weibo',
            count: tid,
            ranking: tid,
            trend: tid
          },
          {
            chanelCode: 'toutiao',
            count: tid,
            ranking: tid,
            trend: tid
          },
          {
            chanelCode: 'wechat',
            count: tid,
            ranking: tid,
            trend: tid
          },
          {
            chanelCode: 'baidu',
            count: tid,
            ranking: tid,
            trend: tid
          }
        ]
      },
      {
        date: 20170103,
        count: tid,
        ranking: tid,
        trend: tid,
        channels: [
          {
            chanelCode: 'weibo',
            count: tid,
            ranking: tid,
            trend: tid
          },
          {
            chanelCode: 'toutiao',
            count: tid,
            ranking: tid,
            trend: tid
          },
          {
            chanelCode: 'wechat',
            count: tid,
            ranking: tid,
            trend: tid
          },
          {
            chanelCode: 'baidu',
            count: tid,
            ranking: tid,
            trend: tid
          }
        ]
      }
    ],
    channelCodeList: [
      {
        text: '米汇渠道',
        key: 'mihui'
      },
      {
        text: '头条',
        key: 'toutiao'
      },
      {
        text: '快手',
        key: 'kuaishou'
      },
      {
        text: '抖音',
        key: 'douyin'
      },
      {
        text: '百度',
        key: 'baidu'
      },
      {
        text: '微信',
        key: 'wechat'
      },
      {
        text: '微博',
        key: 'weibo'
      },
      {
        text: '艺恩',
        key: 'entgoup'
      },
      {
        text: '淘票票',
        key: 'taopiaopiao'
      },
      {
        text: '时光',
        key: 'mtime'
      },
      {
        text: '猫眼',
        key: 'maoyan'
      },
      {
        text: '豆瓣',
        key: 'douban'
      },
      {
        text: '小红书',
        key: 'xiaohongshu'
      },
      {
        text: '腾讯qq.com',
        key: 'qq'
      },
      {
        text: '爱奇艺',
        key: 'iqiyi'
      },
      {
        text: '优酷',
        key: 'youku'
      },
      {
        text: '搜狐',
        key: 'sohu'
      },
      {
        text: '官网',
        key: 'official-website'
      }
    ]
  })
}
