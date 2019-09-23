import { get } from '@/fn/ajax'
/**
 * 影片管理
 * @param data 接口数据
 * http://yapi.aiads-dev.com/project/94/interface/api/6292
 */
export async function managementList() {
  const res = get('/customer/companies/detail-movies')
  return res
}
