import { mockGet, typeTitle, tid, title20, dateRange } from './mock'

export async function queryList(query: any) {
    return await mockGet(query, {
    'items|3': [{
      id: tid,
      name: typeTitle(3, 6),
      title:  typeTitle(3, 6),
      mainPicUrl: 'https://p.ssl.qhimg.com/dmfd/400_300_/t0120b2f23b554b8402.jpg',
      openTime: dateRange(),
      fansNumber: 100,
      fansList: [{ sex : '男', percent: 40}, { sex : '女', percent: 60}],
      type: '搞笑',
      platform: '直发',
      price: '1235',
      discuss: 230,
      like: 100,
      transmit: 2678,
      sex: '男',
      age: 25,
      viewNumber: 1234567,
      matching: 99.6,
      week: '2019/6/1~2019/6/7',
      putStatus: 1,
      likeStatus: 1
      }]
    })
}
