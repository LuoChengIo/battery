<template>
  <div class="navbar" :class="{ collapse: collapse }">
    <!-- <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img :onerror="errorGoodsImg" :src="userInfo.companyLogoUrl" class="sidebar-logo">
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">

      </router-link>
    </transition> -->
    <!-- <img :onerror="errorGoodsImg" class="sidebar-logo sidebar-logo-link"> -->
    <img class="logo" :src="userInfo.companyLogoUrl|| errorGoodsImg" alt="" srcset="">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '电池管理系统',
      errorGoodsImg: `this.src= '${require('@/assets/logo.png')}'`
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height:100px;
  overflow: hidden;
  position: relative;
  background: rgb(40, 44, 53);;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .logo{
    margin-top: 36px;
    margin-left: 54px;
    display: inline-block;
    height: 28px;
    width: auto;
  }
  }
</style>
