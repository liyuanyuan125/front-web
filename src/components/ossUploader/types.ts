/** 文件项 */
export interface FileItem {
  /** 文件（图片）地址 */
  url: string
  /** 可选，客户端文件名，内部添加，会传播到外部 */
  clientName?: string
  /** 可选，客户端文件大小，内部添加，会传播到外部 */
  clientSize?: number
  /** 可选，客户端文件类型，内部添加，会传播到外部 */
  clientType?: string
}
