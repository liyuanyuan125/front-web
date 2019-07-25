// 广告主 -财务管理 -资金账单
import { get, post, put } from '@/fn/ajax'

/**
 * 财务管理 -资金账单
 * @param data
 */
export async function bill(data: any) {
    const res = get('finance/xadvertiser/account-bills', data)
    return res
}

// 资源方对账单列表
// http://yapi.aiads-dev.com/project/139/interface/api/5362
export async function queryList(data: any) {
    const res = get('/xadvert/resource-bills', data)
    return res
}

// 资源方对账单详情
// http://yapi.aiads-dev.com/project/139/interface/api/5363
export async function itemList(id: any) {
    const res = get(`/xadvert/resource-bills/${id}`)
    return res
}

// 资源方对账单详情明细
// http://yapi.aiads-dev.com/project/139/interface/api/5364
export async function itemListbill(id: any , data: any) {
    const res = get(`/xadvert/resource-bills/${id}/detail`, data)
    return res
}

// 资源方对账单批量审核
// http://yapi.aiads-dev.com/project/139/interface/api/5370
export async function approval(data: any) {
    const res = get(`/xadvert/resource-bill/approval`, data)
    return res
}



