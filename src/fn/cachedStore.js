const defaultOptions = {
    timeout: 0,
};
/**
 * 带缓存的存储
 */
export default function (options) {
    const opts = { ...defaultOptions, ...options };
    const cache = {};
    return (key, getVal) => {
        // 若设置了定时，则定时删除缓存
        const { timeout } = opts;
        timeout > 0 && setTimeout(() => delete cache[key], timeout);
        return key in cache
            ? cache[key]
            : (cache[key] = getVal());
    };
}
//# sourceMappingURL=cachedStore.js.map