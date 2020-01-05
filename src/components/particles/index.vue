<template>
  <vue-particles
    color="#fff"
    :particle-opacity="0.8"
    :particles-number="70"
    shape-type="circle"
    :particle-size="4"
    lines-color="#fff"
    :lines-width="1"
    :line-linked="true"
    :line-opacity="0.6"
    :lines-distance="150"
    :move-speed="3"
    :hover-effect="true"
    hover-mode="grab"
    :click-effect="true"
    click-mode="push"
  />
</template>

<script>
import Vue from 'vue'
import VueParticles from 'vue-particles'
Vue.use(VueParticles)
export default {
  name: 'Particles'
}
</script>

<style>
#particles-js {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
