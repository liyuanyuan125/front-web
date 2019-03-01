/**
 * 传递给圆形进度条的选项
 */
export interface CircleProgressOptions {
  /** 圆环大小 */
  size?: number

  /** 圆环线宽 */
  strokeWidth?: number

  /** 圆环的默认颜色 */
  strokeColorDefault?: string

  /** 圆环的成功颜色 */
  strokeColorDone?: string

  /** 圆环的失败颜色 */
  strokeColorFail?: string
}
