export default {
  inserted(el) {
    let cheight = 0
    let offsetTop = 0
    // 获取当前元素距文档顶部里面的高度
    const getOffsetTop = function(el) {
      return el.offsetParent
        ? el.offsetTop + getOffsetTop(el.offsetParent)
        : el.offsetTop
    }

    const setMinHeight = function() {
      cheight = document.body.clientHeight
      // 20为底部内边距
      offsetTop = getOffsetTop(el) + 20
      el.style.minHeight = (cheight - offsetTop) + 'px'
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
