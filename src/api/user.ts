import {get, post, put, del} from '@/fn/ajax'
import { getUser } from '@/store'
const user: any = getUser()!
const systemCode = user.systemCode
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

/**
 * 查看详情
 * @param id
 */
export async function userDetail(data: any) {
    const res = get(`/customer/sub-accounts/${systemCode}/${data.id}`)
    return res
}

/**
 * 批量删除子用户
 * @param data
 */
export async function delectSub(data: any) {
    const res = del('/customer/sub-accounts/', data)
    return res
}
/**
 * 修改子账户 2 禁用 1启用
 * @param status
 */
export async function accountStatu(data: any, id: any) {
    const res = put(`/customer/sub-accounts/${id}/status`, data)
    return res
}




