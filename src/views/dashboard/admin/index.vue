<template>
  <div class="dashboard-editor-container">
    <panel-group :numobj="equipmentChargeSum" />
    <div class="mt24">
      <div class="w-card left-ct p24">
        <div class="model w66">
          <h5 class="f0 n title"><img src="@/assets/icon_warning01@2x.png" class="img-icon">
            <span class="f18 vm">警告数量</span>
          </h5>
          <line-chart :chart-data="lineChartData" />
        </div>
        <div class="model  w33">
          <!-- <el-row v-for="(item,index) in warningData" :key="index" class="mt20 mb20 f13">
            <el-col :span="8" class="text-primary">
              <router-link :to="{ path: '/real/time-list', query: { failure: item.value }}">
                <img class="warn-icon" :src="item.imgsrc" alt="" srcset="">
                {{ item.title }}
              </router-link>
            </el-col>
            <el-col :span="8" :class="item.myclass" class="tc">
              {{ item.quantity }}
            </el-col>
          <el-col :span="8" :class="item.myclass" class="tc">
            {{ item.yearonyear }}
          </el-col>
          </el-row> -->
          <router-link v-for="(item,index) in warningData" :key="index" :to="{ path: '/real/time-list', query: { failure: item.value }}" class="warning-card poi" tag="div">
            <img class="warn-icon vm mr15" :src="item.imgsrc" alt="" srcset="">
            <span class="dib vm mr15" style="width:56px;">{{ item.title }}</span>
            <span :class="item.myclass">{{ item.quantity }}</span>
          </router-link>
        </div>
      </div>
      <div class="mt24">
        <!-- <div class="w-card p10">
          <h5 class="f14 n title">设备数量</h5>
          <bar-chart :chart-data="barChartData" />
        </div> -->
        <el-row :gutter="24">
          <el-col :span="12">
            <div class="w-card p10">
              <h5 class="f0 n title"><img src="@/assets/data.png" class="img-icon"><span class="f18 vm">设备在线状态</span></h5>
              <pie-chart2 :chart-data="pieChartData1" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="w-card p10">
              <h5 class="f0 n title"><img src="@/assets/data1.png" class="img-icon"><span class="f18 vm">设备充电状态</span></h5>
              <pie-chart :chart-data="pieChartData2" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { homeCount } from '@/api/home.js'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
import PieChart2 from './components/PieChart2'
const warningData = [{
  imgsrc: require('@/assets/icon_warning01@2x.png'),
  title: '一级报警',
  key: 'alarmLevel1',
  value: '1',
  quantity: '0',
  yearonyear: '10.85↑',
  myclass: 'warn-text1'
}, {
  imgsrc: require('@/assets/icon_warning02@2x.png'),
  title: '二级报警',
  key: 'alarmLevel2',
  value: '2',
  quantity: '0',
  yearonyear: '10.85↑',
  myclass: 'warn-text2'
}, {
  imgsrc: require('@/assets/icon_warning03@2x.png'),
  title: '三级报警',
  key: 'alarmLevel3',
  value: '3',
  quantity: '0',
  yearonyear: '10.85↓',
  myclass: 'warn-text3'
}, {
  imgsrc: require('@/assets/icon_warning04@2x.png'),
  title: '正常',
  key: 'normalNum',
  value: '0',
  quantity: '0',
  yearonyear: '10.85↑',
  myclass: 'warn-text4'
}]
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart2,
    PieChart
  },
  data() {
    return {
      warningData,
      lineChartData: [],
      barChartData: [],
      pieChartData1: [],
      pieChartData2: [],
      equipmentChargeSum: {
        equipmentCounts: 0,
        disChargeSum: 0,
        chargeSum: 0,
        carbonReduction: 0
      },
      timeout: null
    }
  },
  created() {
    this.getPageData()
  },
  beforeDestroy() {
    clearInterval(this.timeout)
  },
  methods: {
    getPageData() {
      homeCount().then(res => {
        const equipmentChargeSum = res.equipmentChargeSum
        for (const key in equipmentChargeSum) {
          if (equipmentChargeSum.hasOwnProperty(key)) {
            const element = equipmentChargeSum[key]
            equipmentChargeSum[key] = Number(element)
          }
        }
        this.equipmentChargeSum = equipmentChargeSum
        // 在线图标
        this.pieChartData1 = [
          { value: equipmentChargeSum.onLine || 14, legendname: '在线', name: '在线', itemStyle: { color: '#3147EB' }},
          { value: equipmentChargeSum.offLine || 12, legendname: '离线', name: '离线', itemStyle: { color: '#E7C86B' }}
        ]
        this.pieChartData2 = [
          { value: equipmentChargeSum.chargeState || 0, legendname: '充电', name: '充电', itemStyle: { color: '#6060F6' }},
          { value: equipmentChargeSum.defendState || 0, legendname: '保护', name: '保护', itemStyle: { color: '#E76AB4' }},
          { value: equipmentChargeSum.checkState || 0, legendname: '自检', name: '自检', itemStyle: { color: '#6DCFEA' }},
          { value: equipmentChargeSum.disChargeState || 0, legendname: '放电', name: '放电', itemStyle: { color: '#E7C86B' }}
        ]
        if (res) {
          this.warningData.forEach(element => {
            element.quantity = res[element.key] || 0
          })
        }
        this.lineChartData = res.alarmList
        this.barChartData = res.equipmentList
        if (res.interval && !this.timeout) {
          this.timeout = setInterval(() => {
            this.getPageData()
          }, Number(res.interval) * 1000)
        }
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  .title{
    position: relative;
    color:#F4FBFF;
    &::after{
      content: '';
      position:absolute;
      left: 0;
      top: 4px;
      width:2px;
      height: 12px;
      // background:rgba(39,141,236,1);
      background-image: url('../../../assets/data.png');
      border-radius:2px;
    }
  }
  .warn-icon{
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
  .left-ct{
    // float: left;
    width: 100%;
    .blue-title{
      font-size:13px;
      line-height: 36px;
      color: #278DEC;
      background-color: #DEEFFF;
    }
  }
  .img-icon{
    margin-right: 5px;
    vertical-align: middle;
    height: 100%;
  }
  .w66{
    width: 66%;
  }
  .w33{
   width: 33%
  }
  .model{
    float:left;
    background-color:#282C35;
  }
}
.warning-card{
  height:70px;
  background:rgba(51,55,64,1);
  border-radius:4px;
  padding:10px 20px;
  line-height: 50px;
  font-size: 14px;
  color: #fff;
  &+.warning-card{
    margin-top: 24px;
  }
}
.warn-text1{
  color:#E62327;
}
.warn-text2{
  color:#FE761E;
}
.warn-text3{
  color:#FFF11E;
}
.warn-text4{
  color:#6380FE;
}
</style>
