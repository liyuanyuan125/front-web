import { get } from '@/fn/ajax'
import { keyBy } from 'lodash'

/**
 * KOL详情
 * https://yapi.aiads-dev.com/project/144/interface/api/4686
 */
export async function getKol({
  id,
  channel,
}: any) {
  const {
    data: {
      item: {
        name,
        photo,
      },
    }
  } = await get(`/kol/accounts/${id}`, { channelCode: channel })

  const result = {
    name,
    figure: photo,
  }

  return result
}

/**
 * 获取报价信息
 * https://yapi.aiads-dev.com/project/144/interface/api/4238
 * @param id kol id
 */
export async function getPrice(id: number) {
  const {
    data: {
      priceList
    }
  } = await get(`/kol/accounts/${id}/delivery-prices`)

  const priceMap = keyBy(priceList, 'channelCode')
  const dealPrice = (type: string) => {
    const list = ((priceMap[type] || {}).list || []).map(({ categoryName, settlementPrice }: any) => {
      return {
        name: categoryName,
        value: `￥ ${settlementPrice}`,
        enable: true,
      }
    })
    return list
  }

  const channelList = [
    { type: 'wechat', name: '微信' },
    { type: 'weibo', name: '微博' },
    { type: 'kuaishou', name: '快手' },
    { type: 'douyin', name: '抖音' },
  ]

  const result = channelList.map(it => {
    return {
      ...it,
      list: dealPrice(it.type)
    }
  })
  .filter(it => it.list.length > 0)

  return result
}
