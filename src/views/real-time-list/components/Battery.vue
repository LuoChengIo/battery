<template>
  <div class="details-card text-white">
    <div class="title-h tr bd1">
      <img class="vm" src="~@/assets/detailed-data/00-02.png" alt="" srcset="">
      <span>状态数据</span>
    </div>
    <div class="tag-ct tc">
      <span v-for="(item,index) in equipmenbatterys" :key="item.batterySysNo" class="tag-item" :class="{'active':activeIndex===index}" @click="tabclick(index)">{{ item.batterySysNo }}</span>
    </div>
    <div class="pt10 pb24 tc">
      <div class="dib f24 ml40 mr40">
        <img class="vm mr10" src="~@/assets/detailed-data/sj-08.png" alt="" srcset="">
        <span>总电压<span class="ml15">{{ VoltageNum }}V</span>
        </span></div>
      <div class="dib f24 ml40 mr40">
        <img class="vm mr10" src="~@/assets/detailed-data/sj-09.png" alt="" srcset="">
        <span>电池数<span class="ml15">{{ activeItem.batteryNumber }}V</span>
        </span></div>
      <div class="dib f24 ml40 mr40">
        <img class="vm mr10" src="~@/assets/detailed-data/sj-10.png" alt="" srcset="">
        <span>温度点数<span class="ml15">{{ activeItem.probeNumber }}V</span>
        </span></div>
    </div>
    <el-row :gutter="24">
      <el-col v-for="(item, index) in activeItem.batteryVolages" :key="item.id" :span="6">
        <div class="voltage-content" :data-index="index">
          <div class="f16 mb24">电压<span class="ml10">{{ item.oneBatteryVolage }}V</span></div>
          <div class="f16">温度<span class="ml10">{{ activeItem.batteryProbes[index].oneProbeTemperature }}℃</span></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    pageData: {
      type: Object,
      default: function() {
        return { }
      }
    }
  },
  data() {
    return {
      activeItem: {},
      activeIndex: 0
    }
  },
  computed: {
    VoltageNum() {
      let num = 0
      this.activeItem.batteryVolages.forEach(element => {
        num += element.oneBatteryVolage
        console.log(num)
      })
      console.log(num)
      return Math.floor(num * 100) / 100
    },
    equipmenbatterys() {
      return this.pageData.equipmenbatterys
    }
  },
  watch: {},
  mounted() {},
  created() {
    this.activeItem = this.equipmenbatterys[0]
  },
  methods: {
    tabclick(index) {
      this.activeIndex = index
      this.activeItem = this.equipmenbatterys[index]
    }
  }
}
</script>
<style lang="scss" scoped>
.battery-ct{
  padding: 30px 50px;
}
.gray-card{
  position: relative;
  padding: 30px 40px;
  background:rgba(238,245,253,1);
  border-radius:8px;
  min-height: 320px;
}
.battery-num{
  position: absolute;
  top: 50%;
  left: 8%;
  width: 148px;
  height: 148px;
  border-radius: 999px;
  padding-top: 46px;
  margin-top: -74px;
  background: url('~@/assets/detailed-data/bg_sum_battery@2x.png')no-repeat center;
  background-size: cover;
  &.temperature{
    background-image: url('~@/assets/detailed-data/bg_sum_temperature@2x.png')
  }
}
.voltage{
  margin-left: 46%;
  min-height: 260px;
}
.voltage-item{
  width: 100%;
  line-height: 51px;
  &.temperature{

  }
  & + .voltage-item{
     margin-top: 20px;
  }
}
.battery-icon{
  width: 30px;
  height: 40px;
  background: url('~@/assets/detailed-data/bg_battery@2x.png')no-repeat center;
  background-size: cover;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  margin-right: 30px;
  text-align: center;
  &.temperature{
    height: 51px;
    line-height: 70px;
    background-image: url('~@/assets/detailed-data/bg_temperature@2x.png')
  }
}
.tag-ct{
  width: 570px;
  padding: 15px 0;
  margin: 0 auto;
  .tag-item{
    display: inline-block;
    margin: 5px 15px;
    width:22px;
    height:22px;
    font-size:14px;
    border:1px solid #fff;
    color: #fff;
    border-radius:50%;
    transition: all .3s;
    cursor: pointer;
    &.active{
      color: #333;
      background-color: #fff;
    }
  }
}
.voltage-content{
  position: relative;
  background-color: #30343D;
  padding: 24px;
  padding-left: 115px;
  background-position: 24px center;
  background-repeat: no-repeat;
  background-image: url('~@/assets/detailed-data/dc-01.png');
  &::before{
    position: absolute;
    content: attr(data-index);
    top: 24px;
    left: 24px;
    width: 53px;
    line-height: 24px;
    background-color: #30343D;
    font-size: 22px;
    font-weight: bold;
    color: #89d0fe;
    text-align: center;
  }
}
</style>
