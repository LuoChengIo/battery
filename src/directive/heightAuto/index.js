import heightAuto from './heightAuto'

const install = function(Vue) {
  Vue.directive('heightAuto', heightAuto)
}

if (window.Vue) { // 当存在全局vue时，全局注册
  window.heightAuto = heightAuto
  Vue.use(install); // eslint-disable-line
}

heightAuto.install = install
export default heightAuto
