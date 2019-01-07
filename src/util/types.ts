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
