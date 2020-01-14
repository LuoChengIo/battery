<template>
  <div class="details-card text-white">
    <div class="title-h tr bd1">
      <img class="vm" src="~@/assets/detailed-data/00-03.png" alt="" srcset="">
      <span>极值数据</span>
    </div>
    <!-- 电压极值 -->
    <div class="mb24">
      <h5 class="f18 n text-white mt5">
        <img class="vm" src="~@/assets/detailed-data/04.png" alt="" srcset="">
        <span class="vm">电压极值</span>
      </h5>
      <el-row :gutter="24" class="mt20">
        <el-col :span="12">
          <div class="extremum-card">
            <div class="extremum-title">最高电压</div>
            <div class="extremum-item e1">
              最高单体电压电池箱编号
              <span class="bianhao">{{ equipmentLimitInfo.highVoltageSysNo }}</span>
            </div>
            <div class="extremum-item e1">
              最高单体电压电池单体编号
              <span class="bianhao">{{ equipmentLimitInfo.highVoltageOneBatteryNo }}</span>
            </div>
            <div class="extremum-item e1">
              最高单体电压值
              <span class="bianhao">{{ equipmentLimitInfo.oneBatteryVoltageHigh }}V</span>
            </div>
            <div class="extremum-item e1">
              最高单体温度电池箱编号
              <span class="bianhao">{{ equipmentLimitInfo.highTemperatureSysNo }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="extremum-card">
            <div class="extremum-title">最低电压</div>
            <div class="extremum-item e2">
              最低单体电压电池单体编号
              <span class="bianhao">{{ equipmentLimitInfo.lowVoltageSysNo }}</span>
            </div>
            <div class="extremum-item e2">
              最低单体电压电池箱编号
              <span class="bianhao">{{ equipmentLimitInfo.lowVoltageSysNo }}</span>
            </div>
            <div class="extremum-item e2">
              最低单体电压值
              <span class="bianhao">{{ equipmentLimitInfo.oneBatteryVoltageLow }}V</span>
            </div>
            <div class="extremum-item e2">
              最低单体温度电池单体编号
              <span class="bianhao">{{ equipmentLimitInfo.highTemperatureProbeNo }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="extremum-card mt24">
        <div class="extremum-sdt">
          <img class="vm mr10" src="~@/assets/detailed-data/yc.png" alt="" srcset="">
          压差值 {{ equipmentLimitInfo.voltageDifference }} V
        </div>
      </div>
    </div>
    <!-- 温度极值 -->
    <div class="bt1">
      <h5 class="f18 n text-white mt5">
        <img class="vm" src="~@/assets/detailed-data/05.png" alt="" srcset="">
        <span class="vm">温度极值</span>
      </h5>
      <el-row :gutter="24" class="mt20">
        <el-col :span="12">
          <div class="extremum-card">
            <div class="extremum-title">最高温度</div>
            <div class="extremum-item e3">
              最高单体温度电池单体编号
              <span class="bianhao">{{ equipmentLimitInfo.highTemperatureSysNo }}</span>
            </div>
            <div class="extremum-item e3">
              最高单体温度值
              <span class="bianhao">{{ equipmentLimitInfo.highTemperature }} ℃</span>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="extremum-card">
            <div class="extremum-title">最低温度</div>
            <div class="extremum-item e4">
              最低单体温度电池箱编号
              <span class="bianhao"> {{ equipmentLimitInfo.lowTemperatureSysNo }}</span>
            </div>
            <div class="extremum-item e4">
              最低单体温度值
              <span class="bianhao">{{ equipmentLimitInfo.lowTemperature }} ℃</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="extremum-card mt24">
        <div class="extremum-sdt">
          <img class="vm mr10" src="~@/assets/detailed-data/wc.png" alt="" srcset="">
          温度差 {{ equipmentLimitInfo.temperatureDifference }} ℃
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
    equipmentLimitInfo() {
      return this.pageData.equipmentLimitInfo
    }
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.item{
  float: left;
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
.extremum-card{
  background-color: #30343D;
  font-size: 14px;
  .extremum-title{
    background-color: #3b3f46;
    text-align: center;
    font-size: 18px;
    line-height: 50px;
  }
  .extremum-item{
    position: relative;
    line-height: 30px;
    padding-left: 72px;
    padding-right: 136px;
    &:first-child{
      padding-top: 10px;
    }
    &:last-child{
      padding-bottom: 10px;
    }
    &::before{
      position: absolute;
      top:10px;
      left: 50px;
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 10px;
    }
    &.e1{
      &::before{
        background-color: #4a9ff4;
      }
    }
    &.e2{
      &::before{
        background-color: #C24BF3;
      }
    }
    &.e3{
      &::before{
        background-color: #D11313;
      }
    }
    &.e4{
      &::before{
        background-color: #15D9CD;
      }
    }
    .bianhao{
      position: absolute;
      display: inline-block;
      top:0px;
      width: 136px;
      right: 0;
      line-height: 30px;
    }
  }
  .extremum-sdt{
    font-size: 18px;
    text-align: center;
    line-height: 80px;
  }
}
</style>
