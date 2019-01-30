import makeMd5 from 'md5'

/**
 * 取 object 的某些属性，作为新对象
 * @param object 对象
 * @param keys 要取的属性，字符串数组，或以 , 号分割的字符串
 *
 * @return object 新生成的对象
 */
export function slice(object: any, keys: string|string[]): object {
  if (object == null) {
    return {}
  }

  const keyList = keys instanceof Array ? keys : keys.split(',')
  const result: any = {}
  for (const n in keyList) {
    if (keyList.hasOwnProperty(n)) {
      const key = keyList[n]
      const val = object[key]
      val !== undefined && (result[key] = val)
    }
  }
  return result
}

/**
 * 排除对象中的某些属性，返回新对象
 * @param object 对象
 * @param keys 要排除的属性，字符串数组，或以 , 号分割的字符串
 */
export function except(object: any, keys: string|string[]): object {
  if (object == null) {
    return {}
  }

  const keyList = keys instanceof Array ? keys : keys.split(',')
  const result = { ...object }
  for (const key of keyList) {
    delete result[key]
  }
  return result
}

/**
 * 清除对象中的某些值，返回新对象
 * @param object 对象
 * @param cleanList 要清除的值
 */
export function clean(object: any, cleanList: any[] = [null, undefined, '']) {
  if (object == null) {
    return {}
  }

  const result: any = {}
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const val = object[key]
      cleanList.includes(val) || (result[key] = val)
    }
  }
  return result
}

/**
 * 返回对象的 hash 值（将对象 JSON 的串，进行 MD5 取值）
 * @param object 对象
 * @param salt 加盐
 */
export function hash(object: any, salt = '') {
  const json = JSON.stringify(object)
  const text = salt + json
  const result = makeMd5(text)
  return result
}
