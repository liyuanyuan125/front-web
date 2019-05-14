import { get, post, put } from '@/fn/ajax';
const sendEmail = async (type, email) => {
    const url = `/customer/captchas/email/${type}`;
    const res = await get(url, { email });
    return res;
};
/**
 * 发送注册邮箱验证码
 * @param email 邮箱
 */
export async function sendRegisterEmail(email) {
    return sendEmail('register-email-captcha', email);
}
/**
 * 发送重置密码邮箱验证码
 * @param email 邮箱
 */
export async function sendResetpwdEmail(email) {
    return sendEmail('resetpwd-email-captcha', email);
}
/**
 * 注册接口
 * @param data 接口数据
 */
export async function register(data) {
    const res = post('/customer/accounts/signup', data);
    return res;
}
/**
 * 充值密码
 * @param data 接口数据
 */
export async function resetPassword(data) {
    const res = put('/customer/accounts/pwd-reset', data);
    return res;
}
//# sourceMappingURL=register.js.map