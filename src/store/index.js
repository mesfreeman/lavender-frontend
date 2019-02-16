import Vue from 'vue'
import Vuex from 'vuex'

import admin from './module/admin'
import app from './module/app'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    admin,
    app
  }
})
