import { put } from '@/fn/ajax';
/**
 * 修改密码
 * @param query 邮箱
 */
export async function setPassword(query) {
    return put('/customer/accounts/pwd-change', query);
}
//# sourceMappingURL=password.js.map