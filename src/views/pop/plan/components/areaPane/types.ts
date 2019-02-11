/**
 * 区域统计项
 */
export interface Region {
  code: string
  name: string
  count: number
}

/**
 * 省份统计项
 */
export interface Province {
  id: number
  name: string
  count: number
}

/**
 * 城市统计项
 */
export interface City {
  id: number
  name: string
  count: number
  cityGradeCode: string
  cityGradeName: string
}

/**
 * 城市按级别统计项
 */
export interface CityLevel {
  /** 级别 code */
  code: string
  /** 级别名 */
  name: string
  /** 个数 */
  count: number
  /** 城市列表 */
  cityList: Array<{ id: number, name: string }>
}

/**
 * 影院级别统计项
 */
export interface BoxLevel {
  code: string
  name: string
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

  /** 区域列表 */
  regionList: Region[]
  /** 省份列表 */
  provinceList: Province[]
  /** 城市级别列表 */
  cityLevelList: CityLevel[]
  /** 影院级别列表 */
  boxLevelList: BoxLevel[]

  /** 统计类型，为了方便显示查看影院对话框 */
  type: number
  /** 选中的 ids，查看影院对话框需要 */
  ids: string[] | number[]
}
