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
<<<<<<< HEAD
// http://yapi.aiads-dev.com/mock/139/xadvert/resource-bills
=======
// http://yapi.aiads-dev.com/project/139/interface/api/5362
>>>>>>> 3a2cc84834ff3c2eb84ee6b89c442f95419d3a6c
export async function queryList(data: any) {
    const res = get('/xadvert/resource-bills', data)
    return res
}

// 资源方对账单详情
<<<<<<< HEAD
// http://yapi.aiads-dev.com/mock/139/xadvert/resource-bills/{id}
=======
// http://yapi.aiads-dev.com/project/139/interface/api/5363
>>>>>>> 3a2cc84834ff3c2eb84ee6b89c442f95419d3a6c
export async function itemList(id: any) {
    const res = get(`/xadvert/resource-bills/${id}`)
    return res
}

// 资源方对账单详情明细
<<<<<<< HEAD
// http://yapi.aiads-dev.com/mock/139/xadvert/resource-bills/{id}/detail
=======
// http://yapi.aiads-dev.com/project/139/interface/api/5364
>>>>>>> 3a2cc84834ff3c2eb84ee6b89c442f95419d3a6c
export async function itemListbill(id: any , data: any) {
    const res = get(`/xadvert/resource-bills/${id}/detail`, data)
    return res
}

// 资源方对账单批量审核
<<<<<<< HEAD
// http://yapi.aiads-dev.com/mock/139/xadvert/resource-bill/approval
=======
// http://yapi.aiads-dev.com/project/139/interface/api/5370
>>>>>>> 3a2cc84834ff3c2eb84ee6b89c442f95419d3a6c
export async function approval(data: any) {
    const res = get(`/xadvert/resource-bill/approval`, data)
    return res
}



