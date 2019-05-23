import EventClass, { Handler } from './EventClass'
import { random } from './string'

export default class EventChain {
  event = new EventClass({ chained: true, falseBreak: false })

  name = random('EventChain')

  /**
   * 触发事件
   * @param args 参数列表
   */
  emit(...args: any[]) {
    this.event.emit(this.name, ...args)
    return this
  }

  /**
   * 监听事件
   * @param handler 事件处理函数
   */
  then(handler: Handler) {
    this.event.on(this.name, handler)
    return this
  }
}
