import { setUser } from '@/store';
/**
 * 使用登录或注册时返回的信息，设置用户
 */
export default function setUserByData(data) {
    // 设置用户
    const user = {
        id: data.userId,
        name: data.email,
        email: data.email,
        isAdmin: data.admin,
        accountType: data.accountType,
        systemCode: data.systemCode,
        systems: (data.systems || []).filter(it => it.status == 1).map(it => it.code),
        companyId: data.companyId,
        companyName: data.companyName || '<我的公司>',
        perms: data.perms || [],
    };
    setUser(user);
}
//# sourceMappingURL=setUserByData.js.map