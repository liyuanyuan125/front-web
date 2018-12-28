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

  if (!/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password)) {
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
 * @param tel 手机号
 */
export function validataTel(tel: string): string | undefined {
  const reg = /^[1][0-9]{10}$/
  if (!reg.test(tel)) {
    return '输入手机号格式有误'
  }
}


