/***
 * 所有的 modal 包装方法，均支持 promise，并且永远不 reject，所以
 * 1、不要定义 onOk，直接使用 await
 * 2、要处理 cancel，传 onCancel
 */

import { Modal, Message } from 'iview'

// https://www.iviewui.com/components/modal

/**
 * Modal 类型
 */
export type ModalType = 'error' | 'info' | 'success' | 'warning'

/**
 * iView Modal 配置对象，并从原配置对象中去掉 onOk，多加了一个 type 对象
 */
export interface ModalConfig {
  /**
   * Modal 类型，仅在内部使用，外部代码不要设置该值
   */
  type?: ModalType

  /**
   * 标题，默认为空
   */
  title?: string

  /**
   * 内容，默认为空
   */
  content?: string

  /**
   * 宽度，单位 px，默认 416
   */
  width?: number | string

  /**
   * 确定按钮的文字，默认「确定」
   */
  okText?: string

  /**
   * 取消按钮的文字，只在Modal.confirm()下有效，默认「取消」
   */
  cancelText?: string

  /**
   * 点击确定按钮时，确定按钮是否显示 loading 状态，开启则需手动
   * 调用Modal.remove()来关闭对话框，默认 false
   */
  loading?: boolean

  /**
   * 页面是否可以滚动，默认 false
   */
  scrollable?: boolean

  /**
   * 是否可以按 Esc 键关闭，默认 false
   */
  closable?: boolean

  // 不要定义 onOk，直接使用 await
  // /**
  //  * 点击确定的回调
  //  */
  // onOk?: () => any

  /**
   * 点击取消的回调，只在Modal.confirm()下有效
   */
  onCancel?: () => any
}

/**
 * 显示错误信息对话框，一般来说 alert 默认带一个错误提示图标
 * @param msg 要显示的消息
 * @param config 选项
 */
export function alert(msg: string, config = {} as ModalConfig) {
  return new Promise(resolve => {
    const cfg: any = {
      type: 'error',
      content: msg,
      onOk: () => {
        resolve()
      },
      ...config
    }
    ; (Modal[cfg.type] || Modal.error).call(Modal, cfg)
  })
}

/**
 * 显示确认对话框
 * @param msg 要显示的消息
 * @param config 选项
 */
export function confirm(msg: string, config = {} as ModalConfig) {
  return alert(msg, { type: 'confirm', ...config })
}

/**
 * 显示提示信息对话框
 * @param msg 要显示的消息
 * @param config 选项
 */
export function info(msg: string, config = {} as ModalConfig) {
  return alert(msg, { type: 'info', title: '信息', ...config })
}

/**
 * 显示成功信息对话框
 * @param msg 要显示的消息
 * @param config 选项
 */
export function success(msg: string, config = {} as ModalConfig) {
  return alert(msg, { type: 'success', title: '成功', ...config })
}

/**
 * 显示警告信息对话框
 * @param msg 要显示的消息
 * @param config 选项
 */
export function warning(msg: string, config = {} as ModalConfig) {
  return alert(msg, { type: 'warning', title: '警告', ...config })
}

/**
 * Toast 类型
 */
export type ToastType = 'error' | 'info' | 'success' | 'warning' | 'loading'

/**
 * iView Message 配置对象，但多加了一个 type 对象
 */
export interface ToastConfig {
  /**
   * Toast 类型
   */
  type?: ToastType

  /**
   * 提示内容
   */
  content?: string

  /**
   * 自动关闭的延时，单位秒，不关闭可以写 0，默认为 1.5
   */
  duration?: number

  /**
   * 关闭时的回调
   */
  onClose: () => any

  /**
   * 是否显示关闭按钮
   */
  closable: boolean
}

/**
 * 显示全局 toast 提示
 * @param msg 要显示的消息
 * @param config 配置
 */
export function toast(msg: string, config = {} as ToastConfig) {
  const cfg: any = { content: msg, type: 'success', ...config }
  ; (Message as any).config({
    top: cfg.top || Math.floor(window.innerHeight / 3)
  })
  ; (Message[cfg.type] || Message.success).call(Message, cfg)
}

/**
 * 显示全局 loading 提示
 * @param msg 要显示的消息
 * @param config 配置
 */
export function loading(msg = 'loading', config = {} as ToastConfig) {
  toast(msg, { type: 'loading', ...config })
}
