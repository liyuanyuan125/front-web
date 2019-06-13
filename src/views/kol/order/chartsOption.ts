
export const yAxisPubOption = {
  // splitLine: { show: false },
  // splitArea: { show: false },
  // axisLine: { show: false },
  // axisTick: { show: false },
  // type: 'category',
  // axisLabel: {
  //   formatter: '{value}',
  //   textStyle: {
  //     color: '#CDD0D3'
  //   }
  // },
}
/**
 * 图表公共参数配置
 */
export const pubOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    },
    padding: 20,
    formatter: null,
    position(pos: any[], params: any, dom: HTMLDivElement, rect: any, size: any) {
      // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
      // 提示框位置
      let x = 0 // x坐标位置
      let y = 0 // y坐标位置

      // 当前鼠标位置
      const pointX = pos[0]
      const pointY = pos[1]

      // 外层div大小
      // var viewWidth = size.viewSize[0];
      // var viewHeight = size.viewSize[1];

      // 提示框大小
      const boxWidth = size.contentSize[0]
      const boxHeight = size.contentSize[1]

      // boxWidth > pointX 说明鼠标左边放不下提示框
      if (boxWidth > pointX) {
        x = 5
      } else { // 左边放的下
        x = pointX - boxWidth
      }

      // boxHeight > pointY 说明鼠标上边放不下提示框
      if (boxHeight > pointY) {
        y = 5
      } else { // 上边放得下
        y = pointY - boxHeight
      }
      return [x, y]
    }
  },
  legend: {
    show: false,
    y: 'bottom'
  },
  grid: {
    left: '2%',
    right: '2%',
    bottom: '20%',
    containLabel: true,
    show: false,
    borderWidth: 0
  },
  xAxis: [
    {
      show: false
    }
  ]
}
/**
 * 面积图边框配置
 */
export const seriesOption = {
  lineStyle: {
    width: 5
  },
  areaStyle: {
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    opacity: 0.4
  }
}
/**
 * 背景网格虚线配置
 */
export const dottedLineStyle = {
  // x主轴设置
  splitLine: {
    show: true,
    lineStyle: {
      type: 'dashed',
      color: ['#3191AA']
    }
  }
}
/**
 * y主轴设置
 */
export const yOption = {
  axisLabel: {
    textStyle: {
      color: '#CDD0D3'
    }
  },
  axisLine: {
    show: false,
    type: 'dashed',
    lineStyle: {
      color: '#3191AA',
      width: 0,
      opacity: 0
    },
    axisTick: {
      show: false
    }
  }
}
/**
 * x 主轴设置
 */
export const xOption = {
  axisLine: {
    lineStyle: {
      type: 'dotted',
      color: '#3191AA',
      width: 1
    }
  },
  axisTick: {
    show: false
  }
}
/**
 * 圆角边细柱条样式
 */
export const barThinStyle = {
  type: 'bar',
  barWidth: 10,
  itemStyle: {
    barBorderRadius: 5
  }
}
export const barItemStyleColor = {
  itemStyle: {
    normal: {
      // 随机显示
      // color(d: any) {return '#' + Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16)}
      // 定制显示（按顺序）
      color: (params: any) => {
        const colorList = [   '#08667A', '#00B6CC', '#FAD85E', '#DA6C70', ]
        return colorList[params.dataIndex]
      }
    }
  }
}
