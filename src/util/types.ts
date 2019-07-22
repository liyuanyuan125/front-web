///
/// 通用类型，非通用的不要声明在这里
///

/** 通用 Map 泛型，为了与新标准中的 Map 类相区分，这里使用名称 MapType */
export interface MapType<T = string> {
  [key: string]: T
  [index: number]: T
}

/**
 * ajax 调用结果
 */
export interface AjaxResult {
  code: number
  data: any
  msg: string
  handled?: boolean
}

/**
 * 判断 object 是否为 AjaxResult（只要含有 code 就行）
 * @param object 对象
 */
export function isAjaxResult(object: any) {
  return !!(object && typeof object === 'object' && 'code' in object)
}

/** 可取消的事件 */
export interface CancelableEvent {
  canceled: boolean
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

/** 广告主子类型：代理商、直客 */
export type AdsSecondaryCode = 'daili' | 'zhike'

/** 资源方子类型：代理商、影院 */
export type ResourceSecondaryCode = 'agent' | 'cinema'

/** 合并后的二级子类型 */
export type SecondaryCode = AdsSecondaryCode | ResourceSecondaryCode

const defaultSecondaryCodeMap: MapType<SecondaryCode> = {
  ads: 'daili',
  resource: 'agent'
}

/** 获取默认的二级子类型，对于广告主，是代理商，对于资源方，也是代理商 */
export function defaultSecondaryCode(code: SystemCode) {
  return defaultSecondaryCodeMap[code]
}

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
  { code: 'resource', name: '影城' },
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

/**
 * 电影发布状态
 * https://yapi.aiads-dev.com/project/161/interface/api/4974
 */
export enum MovieStatus {
  /** 未知 */
  unknown = 0,

  /** 未上映 */
  unshow = 1,

  /** 即将上映 */
  coming = 2,

  /** 正在上映 */
  onshow = 3,

  /** 已下映 */
  down = 4,
}
