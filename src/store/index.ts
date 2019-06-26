import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export * from './old'

const store = new Vuex.Store({
  state: {
    // 全局背景图
    backImage: '',
  },

  mutations: {
    setBackImage(state, value: string) {
      state.backImage = value
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

// 不导出，只导出包装后的函数
// export default store
