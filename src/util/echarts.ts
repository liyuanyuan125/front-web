import { merge } from 'lodash/fp'

/**
 * tooltip 的一组样式，直接执行该函数，传入覆盖掉的选项即可
 * https://www.echartsjs.com/option.html#tooltip
 */
export const tooltipStyles = merge({
  borderWidth: 1,
  borderColor: 'rgba(87, 180, 201, .8)',
  backgroundColor: 'rgba(0, 39, 52, .8)',
  padding: [7, 10],
  textStyle: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 22,
  },
})
