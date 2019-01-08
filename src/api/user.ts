import {get, post, put} from '@/fn/ajax'

/**
 * 获取角色列表
 * @param data
 */
export async function rolesList(data: any) {
    const res = get('/customer/roles/', data)
    return res
}

/**
 * 分页获取系统的子账户列表
 * @param data
 */
export async function subAccount(data: any) {
    const res = get('/customer/sub-accounts', data)
    return res
}
