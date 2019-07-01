import Vue from 'vue'
import Vuex from 'vuex'
import { MapType } from '@/util/types'
import { clone } from 'lodash'

Vue.use(Vuex)

export * from './old'

const store = new Vuex.Store({
  state: {
    // 全局背景图
    backImage: '',

    // 左侧菜单选择 map
    siderMenuActiveMap: {
    } as MapType<string | null>,

    // 默认头像
    defaultAvatar: '//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bkcq1fljqctg008ubl80.jpg'
  },

  mutations: {
    setBackImage(state, value: string) {
      state.backImage = value
    },

    setSiderMenuActiveMap(state, value: MapType) {
      state.siderMenuActiveMap = value
    }
  }
})

/**
 * 获取或设置全局背景图
 * @param value 全局背景图 URL
 */
export function backImage(value?: string) {
  if (value === undefined) {
    return store.state.backImage
  }
  store.commit('setBackImage', value)
}

/**
 * 获取或更新左侧菜单选择 map
 * @param value 键值对
 */
export function siderMenuActiveMap(value?: MapType<string | null>) {
  const map = store.state.siderMenuActiveMap
  if (value == undefined) {
    return map
  }

  // 只有 clone 新对象，才能触发更新
  const newMap = clone(map)

  Object.entries(value).forEach(([ key, to ]) => {
    // 若 to 是 null 或空串，则执行删除，否则执行添加或更改
    if (to == null || to == '') {
      delete newMap[key]
    } else {
      newMap[key] = to
    }
  })

  store.commit('setSiderMenuActiveMap', newMap)
}


export default store
