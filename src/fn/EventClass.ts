/** 事件处理函数 */
export type Handler = (...args: any[]) => any

/** 事件处理函数与优先级 */
export interface HandlerWithPriority {
  handler: Handler
  priority: boolean
}

/** 事件项 */
export interface EventItem {
  [name: string]: Handler | HandlerWithPriority
}

/** 事件 Map */
interface EventMap {
  [key: string]: HandlerWithPriority[]
}

/** 事件类 */
export default class EventClass {
  private _eventMap: EventMap = {}

  /**
   * 监听事件
   * @param name 事件名或者 EventItem 对象，若为 EventItem 对象，则后面两个参数忽略
   * @param handler 事件处理函数
   * @param priority 优先级，默认 true
   */
  on(name: string | EventItem, handler?: Handler, priority = true) {
    const map = typeof name === 'string'
      ? { [name]: { handler: handler!, priority } }
      : name
    Object.entries(map).forEach(([key, val]) => {
      const item = typeof val == 'function'
        ? { handler: val, priority: true }
        : val as HandlerWithPriority
      ; (this._eventMap[key] || (this._eventMap[key] = [])).push(item)
    })
    return this
  }

  /**
   * 取消监听事件
   * @param name 事件名
   * @param handler 事件处理函数，可选，若不传，则取消 `name` 事件的所有监听者
   */
  off(name: string, handler?: Handler) {
    const list: HandlerWithPriority[] = this._eventMap[name] || []
    if (handler != null) {
      const index = list.findIndex(it => it.handler === handler)
      index > -1 && list.splice(index, 1)
    } else {
      this._eventMap[name] = []
    }
    return this
  }

  /**
   * 触发事件
   * @param name 事件名
   * @param args 参数列表
   */
  emit(name: string, ...args: any[]) {
    const list = this._eventMap[name] || []

    // 先优先执行 priority 为 true 的事件处理函数
    // 若某项事件处理函数，明确返回 false，则取消后续事件处理函数
    const canceled = list.filter(it => it.priority)
      .some(it => it.handler.apply(this, args) === false)

    // 优先级 priority 为 false 的最后执行，但上面若有事件处理函数
    // 明确返回 false，则此处的低优先级事件处理函数则不会被执行
    canceled || list.filter(it => !it.priority)
      .some(it => it.handler.apply(this, args) === false)

    return this
  }

  /**
   * 判断事件 `name` 是否有关联的事件处理函数
   * @param name 事件名
   */
  hasHandler(name: string) {
    return name in this._eventMap
  }
}
