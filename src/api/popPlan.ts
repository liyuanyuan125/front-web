import { mockGet, tid, title20, dateRange } from './mock'

/**
 * @param
 */
export async function orienteering(query: any) {
  return await mockGet(query, {
    cityList: [
      { key: 1, text: '全国' },
      { key: 2, text: '一级城市' },
      { key: 3, text: '二级城市' },
    ],
    cinemaList: [
      { key: 1, text: '一星' },
      { key: 2, text: '二星' },
      { key: 3, text: '三星' },
      { key: 4, text: '四星' },
      { key: 5, text: '五星' },
    ],
    sexList: [
      { key: 1, text: '男' },
      { key: 2, text: '女' },
    ],
    ageList: [
      { key: 1, text: '20' },
      { key: 2, text: '30' },
    ],
    typeList: [
      { key: 1, text: '科幻' },
      { key: 2, text: '悬疑' },
    ],
    'items|3': [{
      id: tid,
      name: title20,
      mainPicUrl: 'https://p.ssl.qhimg.com/dmfd/400_300_/t0120b2f23b554b8402.jpg',
      openTime: dateRange(),
      type: ['科幻', '悬疑', '惊悚']
    }],
  })

}
