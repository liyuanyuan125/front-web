/**
 * 统计数据中的几级城市统计项
 */
export interface StatsCityLevel {
  /** 级别名 */
  name: string
  /** 个数 */
  count: number
}

/**
 * 统计数据接口
 */
export interface Stats {
  /** 覆盖区域个数 */
  region: number
  /** 覆盖省份个数 */
  province: number
  /** 覆盖城市个数 */
  city: number
  /** 覆盖影院个数 */
  cinema: number

  /** 区域名列表 */
  regionNames: string[]

  /** 城市级别列表 */
  cityLevels: StatsCityLevel[]
}
