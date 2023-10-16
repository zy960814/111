import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    initNum: 1,
    initPoint: 240,
    initData: []
  },
  getters: {
    getinitNum(state) {
      return state.initNum
    },
    getinitPoint(state) {
      return state.initPoint
    },
    getinitData(state) {
      return state.initData
    },
  },
  mutations: {
    setStateKey(state, obj) {
      state[obj.key] = obj.value
    }
  },
  actions: {
  },
  modules: {
  }
})
