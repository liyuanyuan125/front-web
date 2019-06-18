import { parse } from './array'
import { isNumber } from './type'

/**
 * 找出 obj 中的全部数字 key
 * @param obj 对象
 */
export function numberKeys(obj: object) {
  return Object.entries(obj)
    .filter(([ , val ]) => isNumber(val))
    .map(([ key ]) => key)
}

/**
 * 将对象中的 keys 转成字数字
 * @param obj 对象
 * @param keys 要转成数字的 key
 */
export function numberify(obj: object, keys: string|string[]) {
  const newObj: any = { ...obj }
  parse(keys).forEach(key => newObj[key] = +newObj[key])
  return newObj
}

/**
 * 字符串转换成 bool，字符串 'false' 会被转换成 false，其他情形，调用 Boolean
 * @param value 字符串
 */
export function stringToBoolean(value: string | null) {
  return value == null || value.trim().toLowerCase() == 'false'
    ? false
    : Boolean(value.trim())
}
