import moment from 'moment'

const d2 = (n: number) => n > 9 ? n : '0' + n

/**
 * 将时间间隔字符串，解析成秒数
 * @param str 时间间隔字符串
 */
export function parse(str: string) {
  if (str != null) {
    const [ mm, ss ] = str.trim().split(':')
    const m = parseInt(mm, 10)
    const s = parseInt(ss, 10)
    if (m >= 0 && s >= 0 && s < 60) {
      return m * 60 + s
    }
  }
}

/**
 * 将秒数格式化成时间间隔
 * @param sec 秒数
 */
export function format(sec: number) {
  const m = parseInt(sec / 60 as any, 10)
  const s = parseInt(sec % 60 as any, 10)
  return [ d2(m), d2(s) ].join(':')
}

export function datarange(begin: any, end: any) {
  const newdate: any = new Date().getTime()
  const begindate: any = new Date(formatDate(begin)).getTime()
  const enddate: any = new Date(formatDate(end)).getTime()
  if (newdate < begindate) {
    return 0
  }
  if (newdate > enddate) {
    return ~~((enddate - begindate) / 86400000) + 1
  }
  if (newdate > begindate && begindate < enddate) {
    return ~~((newdate - begindate) / 86400000) + 1
  }
}

export function formatDate(data: string) {
  return data ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(data + '').substr(6, 2)}` : '暂无'
}
