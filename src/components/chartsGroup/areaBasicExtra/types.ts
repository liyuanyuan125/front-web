/**
 * 传递给bar 图表组件的选项
 */
export interface IchartOptions {
  /** 图表配置 */
  name?: string
  type?: string
  stack?: string
  color?: any[]
}
export interface IcurrentType {
  key: string
  name: string
}
export interface IlistItem {
  name: string
  value: string
}
