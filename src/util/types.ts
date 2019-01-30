/***
 * 通用类型，非通用的不要声明在这里
 */

/**
 * 全站枚举类型
 */
export interface KeyText {
  key: string | number
  text: string
}

/**
 * 全站枚举类型，带 controlStatus
 */
export interface KeyTextControlStatus extends KeyText {
  controlStatus: number
}

/**
 * 系统 code 枚举
 */
export type SystemCode = 'ads' | 'resource'

/**
 * 系统类型
 */
export interface SystemType {
  /**
   * 系统对应的 code
   */
  code: SystemCode

  /**
   * 系统名，如：广告主，资源方
   */
  name: string
}

/**
 * 系统列表
 */
export const systemList: SystemType[] = [
  { code: 'ads', name: '广告主' },
  { code: 'resource', name: '资源方' },
]
