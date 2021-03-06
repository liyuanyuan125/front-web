import { get , post , put } from '@/fn/ajax'
import { KeyTextControlStatus } from '@/util/types'

/**
 * 获取资质类型列表（全部，包括 controlStatus 为 2 的）
 */
export async function getQualificationTypeList() {
  const { data } = await get('/customer/companies/qualification/view')
  return (data.qualificationTypeList || []) as KeyTextControlStatus[]
}

/**
 * 提交补充资料
 */
export async function putAdditional(data: any) {
  const res = await put('/customer/companies/qualification/additional', data)
  return res
}
