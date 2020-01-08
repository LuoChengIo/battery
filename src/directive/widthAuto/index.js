import widthAuto from './widthAuto'

const install = function(Vue) {
  Vue.directive('widthAuto', widthAuto)
}

if (window.Vue) { // 当存在全局vue时，全局注册
  window.widthAuto = widthAuto
  Vue.use(install); // eslint-disable-line
}

widthAuto.install = install
export default widthAuto
