/**
 * 截取一定的小数位
 * @param number 数字
 * @param digits 要保留的位数
 */
export function toFixed(number: number, digits = 0) {
  const strVal = number.toFixed(digits)
  const result = parseFloat(strVal)
  return result
}
