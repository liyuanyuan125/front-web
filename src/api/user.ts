import {get, post, put, del} from '@/fn/ajax'
import { getUser } from '@/store'
const user: any = getUser()!
let systemCode: any = ''
if (user == null) {
    systemCode = ''
} else {
    systemCode = user.systemCode
}


// liyuanyuan
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
 * 查看详情 - 操作日志
 * @param data
 */
export async function operationLog(data: any, id: any) {
    const res = get(`/customer/sub-accounts/${id}/log`, data)
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

/**
 * 重发激活邮件
 * @param status
 */
export async function activeEmail(data: any) {
    const res = get(`/customer/sub-accounts/send-email/${data.id}`)
    return res
}


/**
 * 用户管理- 激活邮箱提交
 * @param status
 */
export async function activeEmailSumbit(data: any) {
    const res = get('customer/sub-accounts/active', data)
    return res
}

/**
 *  添加待激活子账户(增加子账户)
 * @param status
 */
export async function addUser(data: any) {
    const res = post(`/customer/sub-accounts/${systemCode}`, data)
    return res
}

/**
 * 新增子用户 -> 账号权限角色
 * @param data
 */
// export async function roleList(data: any) {
//     const res = get(`/customer/roles/`, data)
//     return res
// }

/**
 * 新增子用户 -> 根据角色id获取角色详情
 * @param data
 */
export async function roleIdDetail(data: any) {
    const res = get(`customer/roles/${data.id}`)
    return res
}
/**
 * 新增子用户 -编辑关联客户
 * @param data
 */
export async function addEditCustomer(data: any) {
    const res = get('/customer/partners', data)
    return res
}







