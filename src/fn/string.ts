/**
 * 对字符串 `str` 执行正则 `regex`，并返回第 `index` 个捕捉组的内容，若无，返回默认值 `defVal`
 *
 * @param str 要操作的字符串
 * @param regex 要执行的正则表达式
 * @param index 返回的捕捉组索引
 * @param defVal 失败时的默认值
 */
export function extract(str: string, regex: RegExp, index = 1, defVal = ''): string {
  return ((str || '').match(regex) || [])[index] || defVal
}

/**
 * 获取字符串的字节长度，Unicode 大于 \u00ff 的算作两个字节
 * @param str 要操作的字符串
 */
export function getSize(str: string) {
  return str.replace(/[^\x00-\xff]/g, 'ci').length
}

/**
 * 以字节长度截取子串，size 字节长度
 * @param str 要操作的字符串
 * @param size 字节长度
 * @param tail 可选的结尾，只有截取时才添加
 */
export function subBytes(str: string, size: number, tail = '...') {
  const substr = size > 0 && getSize(str) > size
    ? str.substr(0, size)
      .replace(/([^\x00-\xff])/g, '\x241 ')  // 双字节字符替换成两个，\x241 => $1
      .substr(0, size)                       // 截取长度
      .replace(/[^\x00-\xff]$/, '')          // 去掉临界双字节字符
      .replace(/([^\x00-\xff]) /g, '\x241')  // 还原
    : str
  return substr == str ? substr : substr + tail
}

/**
 * 判断字符是否是宽字符（如汉字，这里取：凡是 unicode 大于 0xff 的，都被认为是宽字符）
 * @param char 字符
 */
export function isWideChar(char: string) {
  return char.charCodeAt(0) > 0xff
}

/**
 * 从头部按照宽字符规则截取字符串
 * @param string 字符串
 * @param count 汉字个数（2 个英文算作 1 个汉字，下同）
 */
export function wideHead(string: string | null, count: number) {
  if (string == null || count <= 0) {
    return ''
  }
  const list = []
  let sum = 0
  for (const char of string) {
    const size = isWideChar(char) ? 1 : .5
    if (size + sum > count) {
      break
    }
    list.push(char)
    sum += size
  }
  const result = list.join('')
  return result
}

/**
 * 从尾部按照宽字符规则截取字符串
 * @param string 字符串
 * @param count 汉字个数（2 个英文算作 1 个汉字，下同）
 */
export function wideTail(string: string, count: number) {
  if (string == null || count <= 0) {
    return ''
  }
  const list = []
  let sum = 0
  const charList = string.split('')
  for (let i = charList.length - 1; i >= 0; i--) {
    const char = charList[i]
    const size = isWideChar(char) ? 1 : .5
    if (size + sum > count) {
      break
    }
    list.unshift(char)
    sum += size
  }
  const result = list.join('')
  return result
}

/**
 * 考虑汉字的字符串截断
 * @param string 字符串
 * @param frontCount 前面的汉字个数（2 个英文算作 1 个汉字，下同）
 * @param backCount 后面的汉字个数
 * @param padString 填充字符串，默认 ...
 */
export function wideTruncate(
  string: string | null,
  frontCount: number,
  backCount: number,
  padString = '...'
) {
  if (string == null || string == '') {
    return ''
  }
  const count = getSize(string) / 2
  if (
    frontCount == 0 && backCount == 0
    || frontCount >= count
    || backCount >= count
    || (frontCount + backCount) >= count
  ) {
    return string
  }
  const front = frontCount > 0 ? wideHead(string, frontCount) : ''
  const back = backCount > 0 ? wideTail(string, backCount) : ''
  const join = front + padString + back
  // 排除非常特殊的情况，若连接后的字符串长度大于
  // 原来的字符串长度，不如直接显示原来的字符串
  const result = join.length >= string.length ? string : join
  return result
}

let uniqueId = 0

/**
 * 生成随机字符串
 * @param prefix 可选前缀
 * @param suffix 可选后缀
 */
export function random(prefix = '', suffix = '') {
  return prefix
    + Math.random().toString(36).slice(2)
    + new Date().getTime().toString(36)
    + uniqueId++
    + suffix
}

/**
 * 将 get_file_name 形式的字符串转换成 getFileName
 * @param str 要操作的字符串
 */
export function camelCase(str: string) {
  return str.replace(/_(\w)/g, (_, g) => g.toUpperCase())
}

/**
 * 将 get_file_name 形式的字符串转换成 GetFileName，即 pascal 命名法，又叫 Upper Camel Case 命名法
 * @param str 要操作的字符串
 */
export function pascalCase(str: string) {
  const newStr = camelCase(str)
  return newStr.slice(0, 1).toUpperCase() + newStr.slice(1)
}

/**
 * 将 get_file_name 形式的字符串转换成 get-file-name
 * @param str 要操作的字符串
 */
export function hyphenCase(str: string) {
  return str.replace(/_/g, '-').replace(/([A-Z])/g, v => '-' + v.toLowerCase())
}

/**
 * 判断是否为 null 或为空（trim 后）
 * @param str 要判断的字符串
 */
export function isNullOrEmpty(str: any) {
  return str == null || String(str).trim() === ''
}

/**
 * (保留2位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
export function formatCurrency(s: any, n = 2) {
  n = n >= 0 && n <= 20 ? n : 2
  // n大于0小于等于20时，值为n，否则默认为2
  // 将要格式化的数字转换成字符串，并去掉其中匹配的其他字符后返回一个浮点数。
  // 把 Number 四舍五入为指定位数的数字后，最终在转换成字符串。
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
  const numArry = s.split('.')
  const l = numArry[0].split('').reverse()
  let t = ''
  for (let i = 0; i < l.length; i++) {
      // 每隔三位小数分始开隔
      t += l[i] + ( (i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '' )
  }
  // 将顺序反转回来，并返回一个字符串
  if (n == 0) {
    return t.split('').reverse().join('')
  } else {
    return t.split('').reverse().join('') + '.' + numArry[1]
  }
}
