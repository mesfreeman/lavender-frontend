import { login, getLoginAdmin, getMenuInfo, logout } from '@/api/admin'
import { setToken, getToken, getAdmin, setAdmin, setMenu, getMenu } from '@/libs/util'

export default {
  state: {
    adminInfo: getAdmin(),
    menuInfo: getMenu(),
    adminAccessToken: getToken()
  },
  mutations: {
    setAdmin (state, admin) {
      state.adminInfo = admin
      setAdmin(JSON.stringify(admin))
    },
    setMenus (state, menus) {
      state.menuInfo = menus
      setMenu(JSON.stringify(menus))
    },
    setToken (state, token) {
      state.adminAccessToken = token
      setToken(token)
    }
  },
  getters: {
    adminInfo: state => state.adminInfo,
    menuInfo: state => state.menuInfo
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password, remember }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({ userName, password, remember }).then(res => {
          commit('setToken', res.data.result.token)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.adminAccessToken).then(() => {
          commit('setAdmin', '')
          commit('setMenus', '')
          commit('setToken', '')
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getLoginAdmin ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getLoginAdmin(state.adminAccessToken).then(res => {
            commit('setAdmin', res.data.result)
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取左侧菜单列表
    getMenuInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getMenuInfo(state.adminAccessToken).then(res => {
            commit('setMenus', res.data.result.list)
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
