<template>
  <div>
    <div class="w-card p10 pb20">
      <h5 class="f14 n title">充/放电趋势</h5>
      <el-form :inline="true" :model="searchFrom" class="form-inline tr">
        <el-form-item>
          <img class="vm dataicon" src="~@/assets/detailed-data/icon_input_date@2x.png" alt="" srcset="">
          <el-date-picker
            v-model="searchFrom.data2"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button type="primary ml10" @click="searchSubmit">确定</el-button>
        </el-form-item>
      </el-form>
      <line-chart :chart-data="lineChartData" />
    </div>
    <el-row class="mt10" :gutter="10">
      <el-col :span="12">
        <div class="w-card p10">
          <h5 class="f14 n title">开机-关机时间分布</h5>
          <pie-chart :chart-data="pieChartData1" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="w-card p10">
          <h5 class="f14 n title">充电-放电时间分布</h5>
          <pie-chart :chart-data="pieChartData2" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineChart from './chart/LineChart'
import PieChart from './chart/PieChart'
const lineChartData = {
  expectedData: [100, 120, 161, 134, 105, 160, 165],
  actualData: [120, 82, 91, 154, 162, 140, 145]
}
const pieChartData1 = [
  { value: 320, legendname: '开机时间', name: '开机时间 71%', itemStyle: { color: '#3FAFFF' }},
  { value: 240, legendname: '关机时间', name: '关机时间 72%', itemStyle: { color: '#4C4C4C' }}
]
const pieChartData2 = [
  { value: 320, legendname: '充电时间', name: '开机时间 31%', itemStyle: { color: '#F37272' }},
  { value: 240, legendname: '放电时间', name: '放电时间 32%', itemStyle: { color: '#3FAFFF' }},
  { value: 240, legendname: '关机时间', name: '关机时间 22%', itemStyle: { color: '#4C4C4C' }}
]
export default {
  components: {
    LineChart,
    PieChart
  },
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
      lineChartData,
      pieChartData1,
      pieChartData2,
      searchFrom: {}
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {},
  methods: {
    searchSubmit() {

    }
  }
}
</script>
<style lang="scss" scoped>
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
.dataicon{
  width: 26px;
  height: 26px;
  margin-right: 10px;
}
</style>
