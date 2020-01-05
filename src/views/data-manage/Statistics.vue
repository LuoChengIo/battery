<!--  -->
<template>
  <div>
    <div class="w-card search-card">
      <el-form :inline="true" :model="searchFrom" label-width="72px" class="form-inline">
        <el-form-item label="设备ID">
          <el-input v-model="searchFrom.equipmentId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="searchFrom.equipmentName" placeholder="设备名称" />
        </el-form-item>
        <el-form-item label="统计时间">
          <el-date-picker
            v-model="searchFrom.timeRange"
            type="daterange"
            range-separator="至"
            :picker-options="pickerOptions0"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="changeDate0"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="searchSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 图表 -->
    <div class="w-card mt20 p10 pb20">
      <h5 class="f14 n title">
        <span class="mr10">设备数据日趋势</span>
        <el-radio-group v-model="chartType" slot-scope="">
          <el-radio-button label="1">充放电数据</el-radio-button>
          <el-radio-button label="2">极值数据</el-radio-button>
        </el-radio-group>
      </h5>
      <line-chart :chart-data="lineChartData" />
    </div>
    <!-- 列表 -->
    <div v-heightAuto class="mt24 pb20 w-card">
      <el-table
        v-loading="listLoading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          label="统计日期"
          align="center"
          prop="addtime"
          width="160"
          :formatter="dateFormat"
        />
        <el-table-column
          align="center"
          prop="charge"
          label="充电电量（kWh）"
          width="140"
        />
        <el-table-column
          align="center"
          prop="discharge"
          label="放电电量（kWh）"
          width="140"
        />
        <el-table-column
          align="center"
          prop="chargeTime"
          label="充电总时长（h）"
          width="130"
        />
        <el-table-column
          align="center"
          prop="dischargeTime"
          label="放电总时长（h）"
          width="130"
        />
        <el-table-column
          align="center"
          prop="chargeProbe"
          label="最大充电电流（A）"
          width="150"
        />
        <el-table-column
          align="center"
          prop="dischargeProbe"
          label="最大放电电流（A）"
          width="150"
        />
        <el-table-column
          align="center"
          prop="voltageDifference"
          label="最大压差（V）"
          width="120"
        />
        <el-table-column
          align="center"
          prop="temperatureDifference"
          label="最大温差（°C）"
          width="140"
        />
        <el-table-column
          align="center"
          prop="highVoltageSysNo"
          label="最高单体电压电池箱编号"
        />
        <el-table-column
          align="center"
          prop="highVoltageOneBatteryNo"
          label="最高单体电压电池单体编号"
        />
        <el-table-column
          align="center"
          prop="oneBatteryVoltageHigh"
          label="最高单体电压值（V）"
        />
        <el-table-column
          align="center"
          prop="lowVoltageSysNo"
          label="最低单体电压电池箱编号"
        />
        <el-table-column
          align="center"
          prop="lowVoltageOneBatteryNo"
          label="最低单体电压单体电池编号"
        />
      </el-table>
      <div class="pt20 pr30 pl30 tr">
        <span class="l f13 text-primary">当前显示 {{ searchFrom.currentSize }} 条，共 {{ searchFrom.total }} 条记录</span>
        <el-pagination
          background
          class="dib"
          prev-text="上一页"
          next-text="下一页"
          :current-page="searchFrom.pageNo"
          :page-sizes="page.pageSizes"
          :page-size="searchFrom.pageRows"
          :total="searchFrom.total"
          layout="sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from './chart/LineChart'
// const lineChartData = {
//   expectedData: [100, 120, 161, 134, 105, 160, 165],
//   actualData: [120, 82, 91, 154, 162, 140, 145]
// }
import { dayList } from '@/api/data-manage.js'
import moment from 'moment'
export default {
  components: {
    LineChart
  },
  props: {},
  data() {
    return {
      defaultSearchFrom: {},
      searchFrom: {
        equipmentId: '',
        equipmentName: '',
        timeRange: [],
        startDate: '',
        endDate: '',
        pageNo: 1, // 当前页
        pageRows: 10, // 每页显示数
        currentSize: 0, // 当前条数
        total: 0 // 总页数
      },
      listLoading: false,
      tableData: [],
      chartType: '1'
    }
  },
  computed: {
    lineChartData() {
      const chartdata = {
        xAxisData: [],
        seriesData: [],
        formatter: ''
      }
      let arrName = [{ key: 'charge', value: '充电功率' }, { key: 'discharge', value: '放电功率' }, { key: 'chargeTime', value: '充电总时长' }, { key: 'dischargeTime', value: '放电总时长' }, { key: 'chargeProbe', value: '最大充电电流' }, { key: 'dischargeProbe', value: '最大放电电流' }]
      chartdata.formatter = '{b}<br />{a0}: {c0}W<br />{a1}: {c1}W<br />{a2}: {c2}h<br />{a3}: {c3}h<br />{a4}: {c4}A<br />{a5}: {c5}A'
      if (this.chartType === '2') {
        arrName = [{ key: 'voltageDifference', value: '最大压差' }, { key: 'temperatureDifference', value: '最大温差' }, { key: 'oneBatteryVoltageHigh', value: '最高单体电压' }, { key: 'lowVoltageOneBatteryNo', value: '最低单体电压' }, { key: 'highTemperature', value: '最高单体温度' }, { key: 'lowTemperature', value: '最低单体温度' }]
        chartdata.formatter = '{b}<br />{a0}: {c0}V<br />{a1}: {c1}°C<br />{a2}: {c2}V<br />{a3}: {c3}V<br />{a4}: {c4}°C<br />{a5}: {c5}°C'
      }
      this.tableData.forEach(ele => {
        chartdata.xAxisData.push(moment(ele.addtime).format('YYYY/MM/DD'))
      })
      arrName.forEach(element => {
        const obj = {
          name: element.value,
          itemStyle: {
            normal: {
              lineStyle: {
                width: 1
              }
            }
          },
          symbol: 'none',
          smooth: false,
          type: 'line',
          data: [],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }
        this.tableData.forEach(ele => {
          obj.data.push(ele[element.key])
        })
        chartdata.seriesData.push(obj)
      })
      return chartdata
    }
  },
  watch: {},
  mounted() {},
  created() {
    this.searchFrom.pageRows = this.page.pageSize
    this.defaultSearchFrom = Object.assign({}, this.searchFrom)
    this.$root.enterDown = this.searchSubmit
  },
  methods: {
    searchSubmit() { // 搜索查询
      if (this.listLoading) {
        return
      }
      if (!this.searchFrom.equipmentId && !this.searchFrom.equipmentName) {
        this.$message.info('请输入搜索设备id或设备名称')
        return
      }
      if (!this.searchFrom.timeRange.length) {
        this.$message.info('请输入搜索时间范围')
        return
      }
      if (this.searchFrom.timeRange.length) {
        this.searchFrom.startDate = this.searchFrom.timeRange[0]
        this.searchFrom.endDate = this.searchFrom.timeRange[1]
      }
      this.listLoading = true
      dayList(this.searchFrom)
        .then(res => {
          this.tableData = res.data.list
          this.searchFrom.currentSize = res.data.list.length
          this.searchFrom.total = res.data.total
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    handleSizeChange(val) { // 切换每页显示数
      this.searchFrom.pageNo = 1
      this.searchFrom.pageRows = val
      this.searchSubmit()
    },
    handleCurrentChange(val) { // 切换页码
      this.searchFrom.pageNo = val
      this.searchSubmit()
    },
    resetFrom() { // 重置搜索条件
      this.searchFrom = Object.assign({}, this.defaultSearchFrom)
      this.searchSubmit()
    },
    exportFrom() { // 导出表格数据
      location.href = '#'
    },
    dateFormat(row, column) {
      var date = row[column.property]
      if (!date) { return '' }
      return moment(date).format('YYYY-MM-DD')
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
