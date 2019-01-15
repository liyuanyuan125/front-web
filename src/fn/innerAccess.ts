const hasProxy = typeof (window as any).Proxy === 'function'

export interface AccessToken {
  can: boolean
}

/**
 * 实现内部访问，如果浏览器不支持 Proxy，那么本函数将不起作用
 * @param object 需要代理的对象
 * @param token 访问 token
 */
export default function<T>(object: T, token: AccessToken) {
  const proxy = hasProxy
    ? new Proxy(object as any, {
        set(target, property, value) {
          if (!token.can) {
            throw new TypeError(`${String(property)} cannot modify, readonly`)
          }
          target[property] = value
          return true
        }
      }) as T
    : object
  return proxy
}
