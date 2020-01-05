<template>
  <div class="dashboard-editor-container">
    <panel-group :numobj="equipmentChargeSum" />
    <div class="mt10">
      <div class="w-card left-ct p10">
        <h5 class="f14 n title">警告数量</h5>
        <el-row :gutter="20" class="tc blue-title mt20">
          <el-col :span="12">
            故障等级
          </el-col>
          <el-col :span="12">
            数量
          </el-col>
          <!-- <el-col :span="8">
            同比
          </el-col> -->
        </el-row>
        <el-row v-for="(item,index) in warningData" :key="index" class="mt20 mb20 f13">
          <el-col :span="12" class="text-primary">
            <router-link :to="{ path: '/real/time-list', query: { failure: item.value }}">
              <img class="warn-icon" :src="item.imgsrc" alt="" srcset="">
              {{ item.title }}
            </router-link>
          </el-col>
          <el-col :span="12" :class="item.myclass" class="tc">
            {{ item.quantity }}
          </el-col>
          <!-- <el-col :span="8" :class="item.myclass" class="tc">
            {{ item.yearonyear }}
          </el-col> -->
        </el-row>
        <div>
          <line-chart :chart-data="lineChartData" />
        </div>
      </div>
      <div class="right-ct">
        <div class="w-card p10">
          <h5 class="f14 n title">设备数量</h5>
          <bar-chart :chart-data="barChartData" />
        </div>
        <el-row class="mt10" :gutter="10">
          <el-col :span="12">
            <div class="w-card p10">
              <h5 class="f14 n title">设备在线状态</h5>
              <pie-chart :chart-data="pieChartData1" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="w-card p10">
              <h5 class="f14 n title">设备充电状态</h5>
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
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
const warningData = [{
  imgsrc: require('@/assets/icon_warning01@2x.png'),
  title: '一级警告',
  key: 'alarmLevel1',
  value: '1',
  quantity: '0',
  yearonyear: '10.85↑',
  myclass: 'text-danger'
}, {
  imgsrc: require('@/assets/icon_warning02@2x.png'),
  title: '二级警告',
  key: 'alarmLevel2',
  value: '2',
  quantity: '0',
  yearonyear: '10.85↑',
  myclass: 'text-danger'
}, {
  imgsrc: require('@/assets/icon_warning03@2x.png'),
  title: '三级警告',
  key: 'alarmLevel3',
  value: '3',
  quantity: '0',
  yearonyear: '10.85↓',
  myclass: 'text-danger'
}, {
  imgsrc: require('@/assets/icon_warning04@2x.png'),
  title: '正常',
  key: 'normalNum',
  value: '0',
  quantity: '0',
  yearonyear: '10.85↑',
  myclass: 'text-success'
}]
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    BarChart,
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
          { value: equipmentChargeSum.onLine || 0, legendname: '在线', name: '在线', itemStyle: { color: '#3FAFFF' }},
          { value: equipmentChargeSum.offLine || 0, legendname: '离线', name: '离线', itemStyle: { color: '#4C4C4C' }}
        ]
        this.pieChartData2 = [
          { value: equipmentChargeSum.chargeState || 0, legendname: '充电状态', name: '充电状态', itemStyle: { color: '#3FAFFF' }},
          { value: equipmentChargeSum.defendState || 0, legendname: '保护状态', name: '保护状态', itemStyle: { color: '#F37272' }},
          { value: equipmentChargeSum.disChargeState || 0, legendname: '放电状态', name: '放电状态', itemStyle: { color: '#3366F3' }},
          { value: equipmentChargeSum.checkState || 0, legendname: '自检', name: '自检状态', itemStyle: { color: '#8D64FF' }}
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
    color:#001C37;
    padding-left: 8px;
    &::after{
      content: '';
      position:absolute;
      left: 0;
      top: 4px;
      width:2px;
      height: 12px;
      background:rgba(39,141,236,1);
      border-radius:2px;
    }
  }
  .warn-icon{
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 10px;
  }
  .left-ct{
    float: left;
    width: 350px;
    min-height: 723px;
    .blue-title{
      font-size:13px;
      line-height: 36px;
      color: #278DEC;
      background-color: #DEEFFF;
    }
  }
  .right-ct{
    margin-left: 360px;
  }
}
</style>
