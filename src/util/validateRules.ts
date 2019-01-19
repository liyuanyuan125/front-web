/***
 * 通用验证规则库
 *
 * NOTE:
 *
 * 1、不通用的规则不要放在这里
 *
 * 2、所有的验证规则，均为函数，并以 validate 开头，返回 string 值或 undefined，
 *    如果 string 为空或 undefined，则表示验证通过；非空 string 是错误消息
 *
 * 3、目前，所有函数必须为「同步」函数，异步验证稍后有需要再讨论
 */

/**
 * 验证密码
 * @param password 密码值
 */
export function validatePassword(password: string): string | undefined {
  if (password === '') {
    return '密码不能为空'
  }

  if (/\s/.test(password)) {
    return '密码不能含有空格'
  }

  if (
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password)
  ) {
    return '密码必须大小写字母、数字组合，缺一不可'
  }

  // 一般直接在 input 上设置 maxlength 为 16，此处就不验证过长了，最后一条规则兜底
  if (password.length < 8) {
    return '密码过短，不能少于 8 位'
  }

  if (!/^[a-zA-Z\d]{8,16}$/.test(password)) {
    return '密码不合法，合法的密码：8-16 位大小写字母、数字组合'
  }
}

/**
 * 验证中国手机号
 * @param mobile 手机号
 */
export function validataTel(mobile: string): string | undefined {
  const reg = /^[1][0-9]{10}$/
  if (!reg.test(mobile)) {
    return '输入手机号格式有误'
  }
}

/**
 * 验证邮箱地址
 * @param email 邮箱
 */
export function validateEmail(email: string): string | undefined {
  const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  if (!reg.test(email)) {
    return '邮箱格式错误'
  }
}

/**
 * 时间戳格式转换年月日
 */
export function formatTimes(value: any) {
  if (!value) { return ''}
  const date: any = new Date(value)
  const y = date.getFullYear()
  let MM = date.getMonth() + 1
  MM = MM < 10 ? '0' + MM : MM
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let m = date.getMinutes()
  m = m < 10 ? '0' + m : m
  let s = date.getSeconds()
  s = s < 10 ? '0' + s : s
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
}

/**
 * 年月日转换时间戳格式
 */
export function formatTimestamp(val: any) {
  if (!val) {
    return ''
  }
  return new Date(val).getTime()
}
