import moment from 'moment'

/**
 * 相对于今天，获取 offset 后的日期，并格式化成 YYYYMMDD 返回
 * @param offset 日期偏移量，默认为 0，即今天
 */
export function dayOffset(offset = 0) {
  return moment().add(offset, 'day').format('YYYYMMDD')
}

/**
 * 相对于今天，获取 [dayOffset(fromOffset), dayOffset(toOffset)] 日期范围
 * @param beginOffset 开始日期偏移量
 * @param endOffset 结束日期偏移量，默认为 0，即今天
 */
export function dayOffsetRange(beginOffset: number, endOffset = 0) {
  return [
    dayOffset(beginOffset),
    dayOffset(endOffset)
  ]
}

/**
 * 将后端形如 20190618 的数字转成 moment
 * @param date 形如 20190618 的日期数字
 */
export function intToDate(date: number) {
  const strDate = String(date)
  return /^\d{8}$/.test(strDate) ? moment(strDate) : null
}
