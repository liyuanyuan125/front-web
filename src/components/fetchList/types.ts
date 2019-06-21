import { MapType } from '@/util/types'

/**
 * 接口调用结果
 */
export interface FetchResult {
  /** 数据列表 */
  list: any[]

  /** 总数据数 */
  total: number
}

/**
 * 定义数据获取接口
 */
export type Fetch = (query: MapType<any>) => Promise<FetchResult>
