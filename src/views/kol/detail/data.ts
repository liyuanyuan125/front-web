import { get } from '@/fn/ajax'
import { keyBy } from 'lodash'
import { readableThousands } from '@/util/dealData'

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
 * https://yapi.aiads-dev.com/project/144/interface/api/5338
 * @param id kol id
 */
export async function getPrice(id: number) {
  const {
    data: {
      items
    }
  } = await get(`/kol/accounts/${id}/sale-prices`)

  const priceMap = keyBy(items, 'channelCode')
  const dealPrice = (type: string) => {
    const list = ((priceMap[type] || {}).list || []).map(({ categoryName, salePrice }: any) => {
      return {
        name: categoryName,
        value: salePrice > 0 ? `￥ ${readableThousands(salePrice)}` : '-',
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
