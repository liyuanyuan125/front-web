import Vue from 'vue'
import { getUser, hasPerm } from '@/store'

// 定义全局权限验证指令，应用在需要相应权限才能看到的元素上
Vue.directive('auth', {
  async inserted(el, binding, vnode) {
    // 先隐藏元素，预防元素显示出来
    const oldVisibility = el.style.visibility
    el.style.visibility = 'hidden'

    const user = getUser()
    const systemCode = user && user.systemCode || ''

    const perm = systemCode + '.' + binding.value
    const has = await hasPerm(perm)

    if (has) {
      // 恢复原有的显示状态
      el.style.visibility = oldVisibility
    } else if (vnode.elm) {
      // 若没有相应的权限，则去除相应元素
      const parentEl = vnode.elm.parentElement
      parentEl && parentEl.removeChild(vnode.elm)
    }
  }
})

// 全局自定义图片加载是否成功，如果加载失败则加载指定默认图
// //aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bkncsr5uomr0008001o0.png
// //aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bkncstluomr0008001og.png
Vue.directive('real-img', async (el: any, binding: any) => {
  // 没传default-img 属性则用默认的url属性
  const selfImg = el.getAttribute('default-img')
  const url = 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bkncstluomr0008001og.png'
  const defaultURL = selfImg || url

  const imgURL: any = binding.value
  if (!imgURL) {
    el.setAttribute('src', defaultURL)
    return
  }

  const exist: any = await imageIsExist(imgURL)
  const srcUrl = exist ? imgURL : defaultURL
  el.setAttribute('src', srcUrl)
})

// 检测图片是否有效
const imageIsExist = (url: any) => {
  return new Promise((resolve: any) => {
      let img: any = new Image()
      img.src = url
      img.onload =  () => {
        resolve(true)
        img = null
      }
      img.onerror = () => {
        resolve(false)
        img = null
      }
  })
}
