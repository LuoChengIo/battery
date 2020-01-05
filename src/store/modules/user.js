import { login, getCompanyList } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: sessionStorage.getItem('userInfo') && JSON.parse(sessionStorage.getItem('userInfo')),
  signKey: sessionStorage.getItem('signKey'),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  companyInfo: {
    companyList: [],
    defaultCompanyId: '',
    defaultCompanyName: ''
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_SIGNKEY: (state, signKey) => {
    state.signKey = signKey
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_COMANY: (state, companyInfo) => {
    state.companyInfo = companyInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const data = response
        data.username = userInfo.loginId
        // data.companyLogoUrl = process.env.VUE_APP_BASE_IMAGE + data.companyLogoUrl
        sessionStorage.setItem('userInfo', JSON.stringify(data))
        sessionStorage.setItem('isLogin', true)
        commit('SET_USERINFO', data)
        commit('SET_SIGNKEY', userInfo.signKey)
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log(state.userInfo.functionList)
      commit('SET_ROLES', state.userInfo.functionList)
      resolve(state.userInfo.functionList)
    })
  },
  // 获取当前用户的公司列表
  getCompany({ commit }) {
    return new Promise((resolve, reject) => {
      getCompanyList({
        pageNo: 1, // 当前页
        pageRows: 10000 // 每页显示数
      }).then(response => {
        const list = response.companyList.list
        if (list.length) {
          commit('SET_COMANY', {
            companyList: list,
            defaultCompanyId: list.length === 1 ? list[0].companyId : '',
            defaultCompanyName: list.length === 1 ? list[0].companyName : ''
          })
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      sessionStorage.setItem('userInfo', '')
      sessionStorage.setItem('signKey', '')
      sessionStorage.setItem('isLogin', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      sessionStorage.setItem('userInfo', '')
      sessionStorage.setItem('signKey', '')
      sessionStorage.setItem('isLogin', '')
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
