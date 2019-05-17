// tslint:disable-next-line:variable-name

const tween: any = {
  linear(t: number, b: number, c: number, d: number) {  // 匀速
    return c * t / d + b   //  t/d = prop;
  },
  easeIn(t: number, b: number, c: number, d: number) {  // 加速曲线
    return c * (t /= d) * t + b
  },
  easeOut(t: number, b: number, c: number, d: number) {  // 减速曲线
    return -c * (t /= d) * (t - 2) + b
  },
  easeBoth(t: number, b: number, c: number, d: number) {  // 加速减速曲线
    const type = t /= d / 2
    if (type < 1) {
      return c / 2 * t * t + b
    }
    return -c / 2 * ((--t) * (t - 2) - 1) + b
  },
  easeInStrong(t: number, b: number, c: number, d: number) {  // 加加速曲线
    return c * (t /= d) * t * t * t + b
  },
  easeOutStrong(t: number, b: number, c: number, d: number) {  // 减减速曲线
    return -c * ((t = t / d - 1) * t * t * t - 1) + b
  },
  easeBothStrong(t: number, b: number, c: number, d: number) {  // 加加速减减速曲线
    const type = t /= d / 2
    if (type < 1) {
      return c / 2 * t * t * t * t + b
    }
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b
  }
}

// 定义获取样式函数
function getStyle(obj: any, attr: any) {
  return window.getComputedStyle ? window.getComputedStyle(obj)[attr] : obj.currentStyle[attr]
}

/*
  obj         node对象
  json        json属性
  d           duration 动画时长
  type        动画类型
  callback    回调函数

*/

export function animation(obj: any, json: any, d: number, type?: any, callback?: any) {// 指定接受形参
  // obj = this;
  const target: any = {} /*目标值*/
  const init: any = {}/*初始值*/
  let timer: any = null
  let styleV: any = '' /*样式*/
  // tslint:disable-next-line:forin
  for (const attr in json) {
    target[attr]  = parseFloat(json[attr])// 目标值转化为number类型
    init[attr]  = parseFloat(getStyle(obj, attr))// 获取初始样式值并转化为number类型
  }
  if (typeof type == 'function') {
    callback = type
    type = 'linear'
  } else {
    type = type || 'linear'
  }
  window.cancelAnimationFrame(timer)
  const initT: any = new Date() // 获取开始时间
  const rQAF = () => {
    let t = new Date() as any - initT// 获取当前时间与开始时间的差值--动画执行时长
    if (t >= d) {// 判断动画执行时长是否大于预设目标
      t = d// 让动画执行时长等于预设目标
      window.cancelAnimationFrame(timer)
    } else {
      timer = window.requestAnimationFrame(rQAF)// 调用rQAF函数一次
    }
    // tslint:disable-next-line:forin
    for (const attr in json) {
      const b: any = init[attr]
      const c: any = target[attr] - init[attr]
      switch (attr) {
        case 'opacity':
          styleV = tween[type](t, b, c, d)// 设置样式
          break
        case 'zIndex':
          styleV = tween[type](t, b, c, d)// 设置样式
          break
        case 'backgroundColor':
          styleV = target[attr]// 设置样式
          break
        default:
          styleV = tween[type](t, b, c, d) + 'px'
          break
      }
      (obj.style as any)[attr] = styleV// 设置样式
    }
    t == d ? callback && callback() : ''// 根据动画时长是否等于了预设目标，true执行回调函数，并绑定this
  }
  window.requestAnimationFrame(rQAF)
}
