import {get, post, put, del} from '@/fn/ajax'

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
    const res = get(`/customer/sub-accounts/${data.systemCode}/${data.id}`)
    return res
}

/**
 * 账户管理 -> 子账户编辑  ----- 待修改
 * @param data
 */
export async function userEditSub(data: any, id: any, type: any) {
    const res = put(`/customer/sub-accounts/${type}/${id}`, data)
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
export async function addUser(data: any, type: any) {
    const res = post(`/customer/sub-accounts/${type}`, data)
    return res
}

/**
 *  根据角色id 获取权限列表
 * @param data
 */
export async function roleIdDetail(data: any) {
    const res = get(`customer/roles/${data.id}`)
    return res
}
/**
 * 广告主 -编辑关联客户
 * @param data
 */
export async function addEditCustomer(data: any) {
    const res = get('/customer/partners', data)
    return res
}

/**
 * 资源方 -编辑关联影院列表
 * @param data
 */
export async function resEditCustomer(data: any) {
    const res = get('customer/account_cinemas', data)
    return res
}

/**
 * 查询非当前系统的有效子账户信息
 * @param email
 */
export async function vaildNonEmail(data: any) {
    const res = get(`customer/sub-accounts/non-${data.type}/${data.email}`)
    return res
}






