import { get, put } from '@/fn/ajax';
/**
 * 获取资质类型列表（全部，包括 controlStatus 为 2 的）
 */
export async function getQualificationTypeList() {
    const { data } = await get('/customer/companies/qualification/view');
    return (data.qualificationTypeList || []);
}
/**
 * 提交补充资料
 */
export async function putAdditional(data) {
    const res = await put('/customer/companies/qualification/additional', data);
    return res;
}
//# sourceMappingURL=company.js.map