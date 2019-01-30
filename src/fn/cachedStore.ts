export interface CachedStoreOptions {
  /** 失效毫秒数，为 0 则禁用失效 */
  timeout: number
}

const defaultOptions: CachedStoreOptions = {
  timeout: 0,
}

/**
 * 带缓存的存储
 */
export default function(options: CachedStoreOptions) {
  const opts = { ...defaultOptions, ...options }

  const cache: any = {}

  return <T>(key: string, getVal: () => T): T => {
    // 若设置了定时，则定时删除缓存
    const { timeout } = opts
    timeout > 0 && setTimeout(() => delete cache[key], timeout)

    return key in cache
      ? cache[key]
      : (cache[key] = getVal())
  }
}
