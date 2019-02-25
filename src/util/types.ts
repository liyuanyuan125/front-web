///
/// 通用类型，非通用的不要声明在这里
///

/** 通用 Map 泛型，为了与新标准中的 Map 类相区分，这里使用名称 MapType */
export interface MapType<T = string> {
  [key: string]: T
  [index: number]: T
}

/** 全站枚举类型 */
export interface KeyText {
  key: string | number
  text: string
}

/** 全站枚举类型 ControlStatus 字段的类型  */
export type ControlStatus = 1 | 2

/** 全站枚举类型，带 controlStatus */
export interface KeyTextControlStatus extends KeyText {
  controlStatus: ControlStatus
}

/** 系统 code 枚举 */
export type SystemCode = 'ads' | 'resource'

/** 系统类型 */
export interface SystemType {
  /** 系统对应的 code */
  code: SystemCode

  /** 系统名，如：广告主，资源方 */
  name: string
}

/** 系统列表 */
export const systemList: SystemType[] = [
  { code: 'ads', name: '广告主' },
  { code: 'resource', name: '资源方' },
]

/** 权限操作 */
export interface PermAction {
  /** 值 */
  code: string
  /** 名称 */
  name: string
  /** 是否被选中 */
  check: boolean
}

/** 权限页 */
export interface PermPage {
  /** 键 */
  key: string
  /** 名称 */
  name: string
  /** 是否需要权限验证 */
  needAuth: boolean
  /** 操作列表  */
  actions: PermAction[]
  /** 子级页面 */
  subPages: PermPage[]
}
