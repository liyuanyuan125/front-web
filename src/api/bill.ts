// 广告主 -财务管理 -资金账单
import { get, post, put } from '@/fn/ajax'
import { getUser } from '@/store'
const getUseId: any = getUser()

/**
 * 财务管理 -资金账单
 * @param data
 */
export async function bill(data: any) {
    const res = get('finance/advertiser/account-bills', data)
    return res
}
