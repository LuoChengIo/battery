import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.functionId) {
    const arr = roles.filter(role => {
      return route.meta.functionId === role.functionId
    })
    arr.forEach(element => {
      if (route.meta.functionId === element.functionId) {
        route.meta.title = element.functionName
      }
    })
    return arr
  } else {
    return []
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    console.log(route)
    const tmp = { ...route }
    const rols = hasPermission(roles, tmp)
    if (rols.length) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, rols[0].twoLevelFunctionList)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      // }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
