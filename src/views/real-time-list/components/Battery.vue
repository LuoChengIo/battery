<template>
  <div class="details-card text-white">
    <div class="title-h tr bd1">
      <img class="vm" src="~@/assets/detailed-data/00-02.png" alt="" srcset="">
      <span>状态数据</span>
    </div>
    <div class="tag-ct tc">
      <span v-for="(item,index) in batteryComplexList" :key="item.batterySysNo" class="tag-item" :class="{'active':activeIndex===index}" @click="tabclick(index)">{{ item.batterySysNo }}</span>
    </div>
    <!-- <div class="pt10 pb24 tc">
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
        <span>温度点数<span class="ml15">{{ activeItem.probeNumber }}</span>
        </span></div>
    </div> -->
    <div class="dianys">
      <img class="vm mr10" src="~@/assets/detailed-data/sj-08.png" alt="" srcset="">
      <span>总电压<span class="ml15">{{ VoltageNum }}V</span>
      </span>
    </div>
    <!-- <el-row>
      <el-col v-for="(item, index) in activeItem.batteryVoltages" v-show="index<4||isMore" :key="item.id" class="p12" :span="6">
        <div class="voltage-content" :data-index="index">
          <div class="f16 mb24">电压<span class="ml10">{{ item.oneBatteryVolage }}V</span></div>
          <div class="f16">温度<span class="ml10">{{ activeItem.batteryProbes[index].oneProbeTemperature }}℃</span></div>
        </div>
      </el-col>
    </el-row> -->
    <el-row :gutter="24">
      <el-col class="p12" :span="12">
        <div class="voltage-content">
          <div class="flex flex-align-center flex-center pt30 pb30">
            <div class="voltage-act flex flex-align-center">
              <div class="tc pct100">
                <span class="voltage-num ">{{ activeItem.batteryVoltages.length }}</span>
                <span class="dib mt10">电池数据</span>
              </div>
            </div>
            <ul class="num-ul">
              <li v-for="(item, index) in activeItem.batteryVoltages" v-show="index<4" :key="item.id" class="num-item">
                <img class="vm" src="~@/assets/detailed-data/dc-01.png" alt="" srcset="">
                <span class="ml25">{{ item.oneBatteryVolage }}V</span>
              </li>
            </ul>
          </div>
          <div v-if="activeItem.batteryVoltages.length>4" class="more-tip tc poi" @click="dialogVisible1=true">更多
            <i class="el-icon-d-arrow-right ml10" />
          </div>
        </div>
      </el-col>
      <el-col class="p12" :span="12">
        <div class="voltage-content">
          <div class="flex flex-align-center flex-center pt30 pb30">
            <div class="voltage-act lan flex flex-align-center">
              <div class="tc pct100">
                <span class="voltage-num ">{{ activeItem.batteryProbes.length }}</span>
                <span class="dib mt10">温度点数</span>
              </div>
            </div>
            <ul class="num-ul">
              <li v-for="(item, index) in activeItem.batteryProbes" v-show="index<4" :key="item.id" class="num-item">
                <img class="vm" src="~@/assets/detailed-data/dc-02.png" alt="" srcset="">
                <span class="ml25">{{ item.oneProbeTemperature }}℃</span>
              </li>
            </ul>
          </div>
          <div v-if="activeItem.batteryProbes.length>4" class="more-tip tc poi" @click="dialogVisible2=true">更多
            <i class="el-icon-d-arrow-right ml10" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="电池数据列表"
      :visible.sync="dialogVisible1"
      :show-close="false"
      width="300px"
    >
      <ul class="">
        <li class="dialog-item no-padding">
          <span class="inline-two ">电池编号</span>
          <span class="inline-two tr">电压值</span>
        </li>
        <li v-for="(item, index) in activeItem.batteryVoltages" v-show="index<4" :key="item.id" class="dialog-item">
          <span class="inline-two">{{ index+1 }}</span>
          <span class="inline-two tr">{{ item.oneBatteryVolage }}V</span>
        </li>
      </ul>
    </el-dialog>
    <el-dialog
      title="温度点数列表"
      :visible.sync="dialogVisible2"
      :show-close="false"
      width="300px"
    >
      <ul class="">
        <li class="dialog-item no-padding">
          <span class="inline-two ">温度编号</span>
          <span class="inline-two tr">温度值</span>
        </li>
        <li v-for="(item, index) in activeItem.batteryProbes" v-show="index<4" :key="item.id" class="dialog-item">
          <span class="inline-two">{{ index+1 }}</span>
          <span class="inline-two tr">{{ item.oneProbeTemperature }}℃</span>
        </li>
      </ul>
    </el-dialog>
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
      activeIndex: 0,
      isMore: false,
      dialogVisible1: false,
      dialogVisible2: false
    }
  },
  computed: {
    VoltageNum() {
      let num = 0
      this.activeItem.batteryVoltages.forEach(element => {
        num += element.oneBatteryVolage
      })
      return Math.floor(num * 100) / 100
    },
    batteryComplexList() {
      return this.pageData.batteryComplexList
    }
  },
  watch: {},
  mounted() {},
  created() {
    this.activeItem = this.batteryComplexList[0]
  },
  methods: {
    tabclick(index) {
      this.activeIndex = index
      this.activeItem = this.batteryComplexList[index]
    }
  }
}
</script>
<style lang="scss" scoped>
.p12{
  padding:12px;
}
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
// .voltage-content{
//   position: relative;
//   background-color: #30343D;
//   padding: 24px;
//   padding-left: 115px;
//   background-position: 24px center;
//   background-repeat: no-repeat;
//   background-image: url('~@/assets/detailed-data/dc-01.png');
//   &::before{
//     position: absolute;
//     content: attr(data-index);
//     top: 24px;
//     left: 24px;
//     width: 53px;
//     line-height: 24px;
//     background-color: #30343D;
//     font-size: 22px;
//     font-weight: bold;
//     color: #89d0fe;
//     text-align: center;
//   }
// }
.voltage-content{
  padding:0 10px;
  background:#282C35;
  .more-tip{
    line-height: 99px;
    font-size:16px;
    border-top: 1px solid rgba(255,255,255,.5);
  }
}
.dialog-item{
  line-height: 36px;
  font-size: 0;
  padding: 0 0 0 27px;
  color: #333;
  .inline-two{
    font-size: 14px;
  }
  &:hover{
    background-color: rgba(0,0,0,.1);
  }
}
.details-card /deep/{
  background-color: transparent;
  .el-dialog__header{
    text-align: center;
    padding: 13px 0;
  }
  .el-dialog__body{
    padding: 0 24px 30px 24px;
  }
}
.dianys{
  line-height: 80px;
  background:rgba(48,52,61,1);
  margin: 20px 0 14px 0;
  padding:  0 20px;
  font-size: 20px;
}
.voltage-act{
  width:150px;
  height:150px;
  margin-right: 50px;
  text-align: center;
  border-radius: 999px;
  background:#30343D;
  font-size: 14px;
  color: #FB9A4C;
  &.lan{
    color: #3569FE;
    .voltage-num{
      background:rgba(53,105,254,1);
    }
  }
}
.voltage-num{
  display: block;
  margin: 0 auto;
  width:30px;
  height:30px;
  line-height: 30px;
  text-align: center;
  background:rgba(251,154,76,1);
  border-radius:50%;
  font-size: 14px;
  color: #fff;
}
.num-ul{
  margin-left: 50px;
  text-align: right;
}
.num-item{
  line-height: 45px;
  font-size:16px;
  color: #fff;
  & + .num-item{
    margin-top: 50px;
  }
}
</style>
