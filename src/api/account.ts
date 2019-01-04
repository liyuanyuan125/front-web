import { get , post , put } from '@/fn/ajax'

 /**
  * 主账号详情接口
  * @param data 接口数据
  */
 export async function accountDetail(data: any) {
    const res = get(`/customer/accounts/${data.id}`, data)
    return res
 }
