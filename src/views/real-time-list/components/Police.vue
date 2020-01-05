<template>
  <div class="w-card text-primary f13">
    <div class="rel">
      <div class="left-ct bb br">
        <span>电池温度报警</span>
      </div>
      <div class="clearfix right-ct">
        <div class="float-two">
          <div v-for="(item,index) in batteryTemperature" :key="index" class="text-secondary item bb br tc">
            {{ item.text }}
          </div>
        </div>
        <div class="float-two">
          <div v-for="(item,index) in batteryTemperature" :key="index" class="item bb tc">
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>
    <div class="rel">
      <div class="left-ct bb br">
        <span>电池电压报警</span>
      </div>
      <div class="clearfix right-ct">
        <div class="float-two">
          <div v-for="(item,index) in batteryVoltage" :key="index" class="text-secondary item bb br tc">
            {{ item.text }}
          </div>
        </div>
        <div class="float-two">
          <div v-for="(item,index) in batteryVoltage" :key="index" class="item bb tc">
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>
    <div class="rel">
      <div class="left-ct bb br">
        <span>电池电流报警</span>
      </div>
      <div class="clearfix right-ct">
        <div class="float-two">
          <div v-for="(item,index) in batteryCurrent" :key="index" class="text-secondary item bb br tc">
            {{ item.text }}
          </div>
        </div>
        <div class="float-two">
          <div v-for="(item,index) in batteryCurrent" :key="index" class="item bb tc">
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>
    <div class="rel">
      <div class="left-ct br">
        <span>其他报警</span>
      </div>
      <div class="clearfix right-ct">
        <div class="float-two">
          <div v-for="(item,index) in elseArr" :key="index" class="text-secondary item br tc" :class="{'bb':index!=elseArr.length-1}">
            {{ item.text }}
          </div>
        </div>
        <div class="float-two">
          <div v-for="(item,index) in elseArr" :key="index" class="item tc" :class="{'bb':index!=elseArr.length-1}">
            {{ item.value }}
          </div>
        </div>
      </div>
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
    }
  },
  computed: {
    batteryTemperature() {
      const batteryTemperature = [
        { text: '电池充电高温报警', value: this.equipmenwarnPo.batteryChargeHigh || 0 },
        { text: '电池充电低温报警', value: this.equipmenwarnPo.batteryChargeLow || 0 },
        { text: '电池放电高温报警', value: this.equipmenwarnPo.batteryDischargeHigh || 0 },
        { text: '电池放电低温报警', value: this.equipmenwarnPo.batteryDischargeLow || 0 },
        { text: '温差过大报警', value: this.equipmenwarnPo.temperatureDifference || 0 }
      ]
      return batteryTemperature
    },
    batteryVoltage() {
      const batteryTemperature = [
        { text: '总压过压报警', value: this.equipmenwarnPo.voltageHigh || 0 },
        { text: '总压欠压报警', value: this.equipmenwarnPo.voltageLow || 0 },
        { text: '单体电池过压报警', value: this.equipmenwarnPo.oneBatteryVoltageOut || 0 },
        { text: '单体电池欠压报警', value: this.equipmenwarnPo.oneBatteryVoltageLow || 0 },
        { text: '压差过大报警', value: this.equipmenwarnPo.voltageDifference || 0 }
      ]
      return batteryTemperature
    },
    batteryCurrent() {
      const batteryTemperature = [
        { text: '放电过流报警', value: this.equipmenwarnPo.batteryDischargeOut || 0 },
        { text: '充电过流报警', value: this.equipmenwarnPo.batteryChargeOut || 0 }
      ]
      return batteryTemperature
    },
    elseArr() {
      const batteryTemperature = [
        { text: '绝缘报警', value: this.equipmenwarnPo.resistance || 0 },
        { text: 'SOC低报警', value: this.equipmenwarnPo.socLow || 0 },
        { text: 'SOC过高报警', value: this.equipmenwarnPo.socHigh || 0 },
        { text: 'DC-DC状态报警', value: this.equipmenwarnPo.dcStatus || 0 },
        { text: '高压互琐状态报警', value: this.equipmenwarnPo.highLock || 0 }
      ]
      return batteryTemperature
    },
    equipmenwarnPo() {
      return this.pageData.equipmenwarnPo
    }
  },
  watch: {},
  mounted() {

  },
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.item{
  line-height: 50px;
  padding:0 20px;
}
.bt{
  border-top: 1px solid #D4DBEA;
}
.br{
  border-right: 1px solid #D4DBEA;
}
.bb{
  border-bottom: 1px solid #D4DBEA;
}
.bl{
  border-left: 1px solid #D4DBEA;
}
.pct75 {
  width: 75%;
}
.right-ct{
  margin-left: 33.3%;
}
.left-ct{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 33.3%;
  span{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
</style>
