// 广告主 - 推广管理 -广告片
import { get , post , put, del } from '@/fn/ajax'

/**
 * 广告片列表
 * @param data
 */
export async function dataList(data: any) {
    const res = await get('xadvert/v1/videos', data)
    return res
}
/**
 * 批量删除广告片列表
 * @param data
 */
export async function delList(data: any) {
    const res = await del('/xadvert/v1/videos', data)
    return res
}
/**
 * 取消广告片
 * @param data
 */
export async function popCancel(id: any) {
    const res = await put(`xadvert/videos/${id}/cancel`)
    return res
}
/**
 * 支付广告片
 * @param data
 */
export async function popPayment(id: any) {
    const res = await put(`/xadvert/v1/videos/${id}/pay`)
    return res
}

/**
 * 编辑广告片
 * @param data
 */
export async function editPop(data: any, id: any) {
    const res = await put(`/xadvert/v1/videos/${id}`, data)
    return res
}
/**
 * 创建广告片
 * @param data
 */
export async function createPop(data: any) {
    const res = await post('/xadvert/v1/videos', data)
    return res
}
/**
 * 广告片详情
 * @param data
 */
export async function detailPop(id: any) {
    const res = await get(`/xadvert/v1/videos/${id}`)
    return res
}

/**
 * 计算转制费用
 * @param specification 广告片规格
 */
export async function transFee(data: any) {
    const res = await get(`/xadvert/v1/videos/trans-fee`, data)
    return res
}


/**
 * 查看公司客户信息列表
 * @param data
 */
export async function popPartners(data: any) {
    const res = await get('/customer/partners', data)
    return res
}

// 品牌名称列表
export async function brandList(data: any) {
    const res = await get('/brand/brand-relation/self-list/pass', data)
    return res
}
// 产品列表
export async function productsList(data: any) {
    const res = await get('/brand/products', data)
    return res
}
