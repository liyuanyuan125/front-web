import { post } from '@/fn/ajax';
/**
 * 登录
 * @param data 提交数据
 */
export async function login(data) {
    const res = await post('/auth/login', data);
    return res;
}
/**
 * 退出
 */
export async function logout() {
    const res = await post('/auth/logout');
    return res;
}
/**
 * 获取登录用户信息
 */
export async function getUserInfo() {
    const res = await post('/auth/infos');
    return res;
}
//# sourceMappingURL=auth.js.map