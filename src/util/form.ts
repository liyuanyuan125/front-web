import Vue from 'vue'
import scrollIntoView from 'scroll-into-view-if-needed'

export function scrollToError(box: Element | Vue) {
  const el = (box as Element).querySelector ? box as Element : (box as Vue).$el
  const node = el.querySelector('.ivu-form-item-error')
  node && scrollIntoView(node, {
    behavior: 'smooth',
    block: 'start',
  })
}
