import { get, post, put, del } from '@/fn/ajax'

/**
 * 权限列表
 * @param data 接口数据
 */
export async function authUserList(query: any) {
    const res = get('/customer/roles/', query)
    return res
}

/**
 * 获取角色详情
 * @param data 接口数据
 */
export async function customerRole(id: any) {
    const res = get(`/customer/roles/${id}`)
    return res
}

/**
 * 更新角色
 * @param data 接口数据
 */
export async function customerSet(id: any, query: any) {
    const res = put(`/customer/roles/${id}`, query)
    return res
}

/**
 * 添加角色
 * @param data 接口数据
 */
export async function customerAdd(query: any) {
    const res = post('/customer/roles/', query)
    return res
}

/**
 * 删除角色
 * @param data 接口数据
 */
export async function customerDel(id: any) {
    const res = del(`/customer/roles/${id}`)
    return res
}

/**
 * 获取角色列表
 * @param data 接口数据
 */
export async function meanList(systemCode: string, query: any) {
    const res = get(`/customer/menus/${systemCode}`, query)
    return res
}
