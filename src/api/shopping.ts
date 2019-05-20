import { mockGet, typeTitle, tid, title20, dateRange } from './mock'

/**
 * @param
 */
export async function fileList(query: any) {
  return await mockGet(query, {
    items: [
      { key: 0, text: '流浪地球' },
      { key: 2, text: '老王历险记' },
      { key: 3, text: '英雄联盟' },
      { key: 4, text: '复仇者联盟' },
      { key: 5, text: '猪八戒背媳妇' },
      { key: 6, text: '我是胡汉三' },
    ]
  })
}

export async function queryList(query: any) {
return await mockGet(query, {
  'items|3': [{
      id: tid,
      name: typeTitle(3, 6),
      mainPicUrl: 'https://p.ssl.qhimg.com/dmfd/400_300_/t0120b2f23b554b8402.jpg',
      openTime: dateRange(),
      fansNumber: 100,
      fansList: [{ sex : '男', percent: 40}, { sex : '女', percent: 60}],
      type: '直发',
      platform: '小红书',
      discuss: 230,
      like: 100,
      transmit: 2678,
      price: '1223~12345',
      sex: '男',
      age: 25,
      viewNumber: 1234567,
      matching: 99.6,
      week: '2019/6/1~2019/6/7',
      putStatus: 1,
      likeStatus: 1
      }],
  })
}