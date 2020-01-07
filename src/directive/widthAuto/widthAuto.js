export default {
  inserted(el, binding) {
    let cWidth = 0
    const setMinHeight = function() {
      cWidth = document.body.clientWidth
      // 20为底部内边距
      el.style.width = cWidth * binding.value + 'px'
    }
    // 防抖
    const debounce = function debounce(fn, wait) {
      var timeout = null
      return function() {
        if (timeout !== null) clearTimeout(timeout)
        timeout = setTimeout(fn, wait)
      }
    }
    setMinHeight()
    window.addEventListener('resize', debounce(setMinHeight, 100))
  },
  bind(el, binding) {

  },
  unbind(el) {

  }
}
