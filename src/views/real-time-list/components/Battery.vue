<template>
  <div>
    <div class="w-card battery-ct">
      <div class="mb10">
        <el-tag v-for="(item,index) in equipmenbatterys" :key="item.batterySysNo" :type="activeIndex===index?'success':'info'" class="mr10 poi" @click="tabclick(index)">{{ item.batterySysNo }}</el-tag>
      </div>
      <h2 class="tc f18 text-primary mb40">总电压<span class="ml15">{{ VoltageNum }}V</span></h2>

      <el-row :gutter="38">
        <el-col :span="12">
          <div class="gray-card">
            <div class="tc battery-num">
              <div class="f22 text-primary">{{ activeItem.batteryNumber }}</div>
              <p class="f14 text-secondary">电池数据</p>
            </div>
            <div com class="voltage flex text-primary flex-align-center">
              <div>
                <div v-for="(item,index) in activeItem.batteryVolages" :key="item.id" class="voltage-item ">
                  <span class="dib vm battery-icon">{{ index+1 }}</span>
                  <span class="dib vm f18">{{ item.oneBatteryVolage }}V</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="gray-card">
            <div class="tc battery-num temperature">
              <div class="f22 text-primary">{{ activeItem.probeNumber }}</div>
              <p class="f14 text-secondary">温度点数</p>
            </div>
            <div com class="voltage flex text-primary flex-align-center">
              <div>
                <div v-for="(item,index) in activeItem.batteryProbes" :key="item.id" class="voltage-item temperature">
                  <span class="dib vm battery-icon temperature">{{ index+1 }}</span>
                  <span class="dib vm f18">{{ item.oneProbeTemperature }}℃</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
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
</style>
