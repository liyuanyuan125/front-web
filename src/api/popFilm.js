// 广告主 - 推广管理 -广告片
import { get, post, put, del } from '@/fn/ajax';
/**
 * 广告片列表
 * @param data
 */
export async function dataList(data) {
    const res = await get('xadvert/videos', data);
    return res;
}
/**
 * 批量删除广告片列表
 * @param data
 */
export async function delList(data) {
    const res = await del('xadvert/videos', data);
    return res;
}
/**
 * 取消广告片
 * @param data
 */
export async function popCancel(id) {
    const res = await put(`xadvert/videos/${id}/cancel`);
    return res;
}
/**
 * 支付广告片
 * @param data
 */
export async function popPayment(id) {
    const res = await put(`xadvert/videos/${id}/pay`);
    return res;
}
/**
 * 编辑广告片
 * @param data
 */
export async function editPop(data, id) {
    const res = await put(`xadvert/videos/${id}`, data);
    return res;
}
/**
 * 创建广告片
 * @param data
 */
export async function createPop(data) {
    const res = await post('xadvert/videos', data);
    return res;
}
/**
 * 广告片详情
 * @param data
 */
export async function detailPop(id) {
    const res = await get(`/xadvert/videos/${id}`);
    return res;
}
/**
 * 计算转制费用
 * @param specification 广告片规格
 */
export async function transFee(data) {
    const res = await get(`xadvert/videos/trans-fee`, data);
    return res;
}
/**
 * 查看关联客户
 * @param data
 */
export async function popPartners(id) {
    const res = await get(`customer/partners/${id}`);
    return res;
}
//# sourceMappingURL=popFilm.js.map