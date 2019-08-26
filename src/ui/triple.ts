import TripleDialog from '@/components/tripleDialog'
import { ButtonType } from '@/util/types'

/**
 * 三态对话框选项
 */
export interface TripleOptions {
  /** 宽度，默认 360 */
  width?: number
  /** 肯定按钮的文字，默认：是 */
  yesText?: string
  /** 肯定按钮的类型，默认：primary */
  yesType?: ButtonType
  /** 否定按钮的文字，默认：否 */
  noText?: string
  /** 否定按钮的类型，默认：default */
  noType?: ButtonType
  /** 取消按钮的文字，默认：取消 */
  cancelText?: string
  /** 取消按钮的类型，默认：text */
  cancelType?: ButtonType
  /** 当点击 cancel 或关闭时执行 */
  onCancel?: () => any
}

/**
 * 默认选项
 */
const defaultOptions: TripleOptions = {
  width: 360,
  yesText: '是',
  yesType: 'success',
  noText: '否',
  noType: 'info',
  cancelText: '取消',
  cancelType: 'default'
}

/**
 * 实现三态对话框（三个按钮：是、否、取消）
 * @param content 对话框文字
 * @param options 对话框选项
 * @returns 当点击了 yes 按钮，resolve 结果是 true，当点击了 no 按钮，resolve 结果是 false，
 *          其他情况（如点击关闭或取消），都没有任何结果（既不 resolve，也不 reject）
 */
export default function triple(content: string, options: TripleOptions = {}) {
  const props = {
    ...defaultOptions,
    ...options,
    value: true
  }

  const onCancel = props.onCancel
  delete props.onCancel

  const el = document.createElement('div')
  document.body.appendChild(el)

  const vm = new TripleDialog({
    propsData: props
  })

  const removeIt = () => {
    vm.$nextTick(() => {
      vm.$destroy()
      vm.$el.remove()
    })
  }

  vm.$on('cancel', () => {
    removeIt()
    onCancel && onCancel()
  })

  const contentNode = vm.$createElement('div', [content])
  vm.$slots.default = [contentNode]

  vm.$mount(el)

  return new Promise<boolean>(resolve => {
    vm.$on('yes', () => {
      removeIt()
      resolve(true)
    })
    vm.$on('no', () => {
      removeIt()
      resolve(false)
    })
  })
}
