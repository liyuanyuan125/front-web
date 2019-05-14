import { get, post, put, del } from '@/fn/ajax';
// liyuanyuan
/**
 * 获取角色列表
 * @param data
 */
export async function rolesList(data) {
    const res = get('/customer/roles/', data);
    return res;
}
/**
 * 分页获取系统的子账户列表
 * @param data
 */
export async function subAccount(data) {
    const res = get('/customer/sub-accounts', data);
    return res;
}
/**
 * 查看详情
 * @param id
 */
export async function userDetail(data) {
    const res = get(`/customer/sub-accounts/${data.systemCode}/${data.id}`);
    return res;
}
/**
 * 账户管理 -> 子账户编辑
 * @param data
 */
export async function userEditSub(data, id, type) {
    const res = put(`/customer/sub-accounts/${type}/${id}`, data);
    return res;
}
/**
 * 查看详情 - 操作日志
 * @param data
 */
export async function operationLog(data, id) {
    const res = get(`/customer/sub-accounts/${id}/log`, data);
    return res;
}
/**
 * 批量删除子用户
 * @param data
 */
export async function delectSub(data) {
    const res = del('/customer/sub-accounts/', data);
    return res;
}
/**
 * 修改子账户 2 禁用 1启用
 * @param status
 */
export async function accountStatu(data, id) {
    const res = put(`/customer/sub-accounts/${id}/status`, data);
    return res;
}
/**
 * 重发激活邮件
 * @param status
 */
export async function activeEmail(data) {
    const res = get(`/customer/sub-accounts/send-email/${data.id}`);
    return res;
}
/**
 * 用户管理- 激活邮箱提交
 * @param status
 */
export async function activeEmailSumbit(data) {
    const res = put('customer/sub-accounts/active', data);
    return res;
}
/**
 *  添加待激活子账户(增加子账户)
 * @param status
 */
export async function addUser(data, type) {
    const res = post(`/customer/sub-accounts/${type}`, data);
    return res;
}
/**
 *  根据角色id 获取权限列表
 * @param data
 */
export async function roleIdDetail(data) {
    const res = get(`customer/roles/${data.id}`);
    return res;
}
/**
 * 广告主 -编辑关联客户
 * @param data
 */
export async function addEditCustomer(data) {
    const res = get('/customer/partners', data);
    return res;
}
/**
 * 资源方 -编辑关联影院列表
 * @param data
 */
export async function resEditCustomer(data) {
    const res = get('customer/account-cinemas', data);
    return res;
}
/**
 * 查询非当前系统的有效子账户信息
 * @param email
 */
export async function vaildNonEmail(data) {
    const res = get(`customer/sub-accounts/non-${data.type}/${data.email}`);
    return res;
}
/**
 * 子账户存在 修改账户的系统类别和权限
 * @param email
 */
export async function accountSystem(data) {
    const res = put('customer/sub-accounts/system', data);
    return res;
}
//# sourceMappingURL=user.js.map