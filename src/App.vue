<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    document.onkeydown = (event) => {
      var e = event || window.event
      if (e && e.keyCode === 13) { // 回车键的键值为13
        this.$root.enterDown()
      }
    }
  }
}
</script>
