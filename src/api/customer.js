import { get, post, put } from '@/fn/ajax';
// 充值记录
export async function subAccount(query) {
    const res = await get('/customer/partners', query);
    return res;
}
// 根据行业获取分类列表
export async function codeList(businessCode) {
    const res = await get(`/customer/partners/business/${businessCode}`);
    return res;
}
// 获取客户详细信息
export async function contact(id) {
    const res = await get(`/customer/partners/detail/${id}/`);
    return res;
}
// 获取客户详细信息
export async function putcontact(id, query) {
    const res = await put(`/customer/partners/${id}`, query);
    return res;
}
// 添加客户详细信息
export async function postcontact(query) {
    const res = await post(`/customer/partners`, query);
    return res;
}
// 获取客户的行业列表
export async function business() {
    const res = await get(`/customer/partners/business`);
    return res;
}
// 获取客户下所关联的账号列表
export async function adminId(query) {
    const res = await get(`/customer/partners/accounts`, query);
    return res;
}
/**
 * 获取菜单列表
 * @param systemCode 系统类型
 * @param type 类型，1: 所有菜单，2: 当前用户的
 * https://yapi.aiads.com/project/94/interface/api/857
 */
export async function getMenus(systemCode, type) {
    const res = await get(`/customer/menus/${systemCode}`, { type });
    return res;
}
//# sourceMappingURL=customer.js.map