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
 * fetchList
 * @param query
 */
export async function fetchList(query: any) {
  return await mockGet(query, {
    'items|12': [
      {
        title: title20,
        score: tid,
        images: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3139737031,3366713682&fm=26&gp=0.jpg'
      }
    ],
    'filmTypesList|30': [
      {
        key: tid,
        text: '记录片'
      }
    ],
    totalCount: 100
  })
}


