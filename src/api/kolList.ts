import { mockGet, typeTitle, tid, title20, dateRange } from './mock'

/**
 * @param
 */
export async function queryList(query: any) {
  return await mockGet(query, {
    accountList: [
      { key: 1, text: '明星' },
      { key: 2, text: '时尚' },
      { key: 3, text: '游戏' },
      { key: 4, text: '动作' },
      { key: 5, text: '美食' },
      { key: 6, text: '动漫' },
    ],
    fansList: [
      { key: 1, text: '1w以下' },
      { key: 2, text: '1-10W人' },
      { key: 3, text: '10-50W人' },
      { key: 4, text: '50-200W人' },
      { key: 5, text: '200-1000W人' },
    ],
    priceList: [
      { key: 1, text: '1,000' },
      { key: 2, text: '1,000-2,000' },
      { key: 3, text: '5,000-15,000' },
      { key: 4, text: '15,000-30,000' },
      { key: 5, text: '30,000以上' },
    ],
    sexList: [
      { key: 1, text: '男性多' },
      { key: 2, text: '女性多' },
    ],
    'items|3': [{
      id: tid,
      name: typeTitle(3, 6),
      mainPicUrl: 'https://p.ssl.qhimg.com/dmfd/400_300_/t0120b2f23b554b8402.jpg',
      openTime: dateRange(),
      fansNumber: 100,
      fansList: [{ sex : '男', percent: 40}, { sex : '女', percent: 60}],
      type: ['科幻', '悬疑', '惊悚'],
      read: 160,
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
