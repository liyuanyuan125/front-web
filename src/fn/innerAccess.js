const hasProxy = typeof window.Proxy === 'function';
/**
 * 实现内部访问，如果浏览器不支持 Proxy，那么本函数将不起作用
 * @param object 需要代理的对象
 * @param token 访问 token
 */
export default function (object, token) {
    const proxy = hasProxy
        ? new Proxy(object, {
            set(target, property, value) {
                if (!token.can) {
                    throw new TypeError(`${String(property)} cannot modify, readonly`);
                }
                target[property] = value;
                return true;
            }
        })
        : object;
    return proxy;
}
//# sourceMappingURL=innerAccess.js.map