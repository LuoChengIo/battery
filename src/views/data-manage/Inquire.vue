<template>
  <div>
    <div class="w-card search-card">
      <el-form :inline="true" :model="searchFrom" size="small" label-width="72px" class="form-inline">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="searchFrom.startDateBak"
            type="date"
            placeholder="选择日期"
            @change="changeStartDate"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="searchFrom.endDateBak"
            :clearable="false"
            type="date"
            :picker-options="pickerEndOptions"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="设备ID">
          <el-input v-model="searchFrom.equipmentId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="searchFrom.equipmentName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="所属用户">
          <el-cascader v-model="searchFrom.userArr" :show-all-levels="false" :props="casprops" />
        </el-form-item>
        <el-form-item label="硬件版本">
          <el-input v-model="searchFrom.equipmentSoftVersion" placeholder="硬件版本" />
        </el-form-item>
        <el-form-item label="软件版本">
          <el-input v-model="searchFrom.equipmentHardwareVersion" placeholder="软件版本" />
        </el-form-item>
        <el-form-item label="功能状态码">
          <el-input v-model="searchFrom.statusCode" placeholder="功能状态码" />
        </el-form-item>
        <el-form-item label="故障等级">
          <el-select v-model="searchFrom.failure">
            <el-option v-for="(item,index) in faultLevel" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select v-model="searchFrom.status">
            <el-option v-for="(item,index) in equipmentStatus" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="最高电压值">
          <el-input v-model="searchFrom.oneBatteryVoltageHigh" placeholder="最高电压值" />
        </el-form-item>
        <el-form-item label="最低电压值">
          <el-input v-model="searchFrom.oneBatteryVoltageLow" placeholder="最低电压值" />
        </el-form-item>
        <el-form-item label="压差值">
          <el-input v-model="searchFrom.voltageDifference" placeholder="压差值" />
        </el-form-item>
        <el-form-item label="最高温度值">
          <el-input v-model="searchFrom.highTemperature" placeholder="最高温度值" />
        </el-form-item>
        <el-form-item label="最低温度值">
          <el-input v-model="searchFrom.lowTemperature" placeholder="最低温度值" />
        </el-form-item>
        <el-form-item label="温差值">
          <el-input v-model="searchFrom.temperatureDifference" placeholder="温差值" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w100" @click="resetFrom">重置</el-button>
          <el-button type="danger" class="w100" @click="searchSubmit">搜索</el-button>
          <el-button type="success" class="w100" @click="exportFrom">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-heightAuto class="mt24 pb20 w-card">
      <el-table
        v-loading="listLoading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          label="序号"
          align="center"
          type="index"
          width="90"
        />
        <el-table-column
          align="center"
          prop="equipmentId"
          label="设备ID"
        />
        <el-table-column
          align="center"
          prop="statusCode"
          label="状态功能码"
        />
        <el-table-column
          align="center"
          prop="statusName"
          label="设备状态"
        />
        <el-table-column
          align="center"
          prop="failureName"
          label="故障等级"
        />
        <el-table-column
          align="center"
          prop="oneBatteryVoltageHigh"
          label="最高电压(V)"
        />
        <el-table-column
          align="center"
          prop="oneBatteryVoltageLow"
          label="最低电压(V)"
        />
        <el-table-column
          align="center"
          prop="highTemperature"
          label="最高温度(℃)"
        />
        <el-table-column
          align="center"
          prop="lowTemperature"
          label="最低温度(℃)"
        />
        <el-table-column
          align="center"
          prop="voltageDifference"
          label="压差(V)"
        />
        <el-table-column
          align="center"
          prop="temperatureDifference"
          label="温差(℃)"
        />
        <el-table-column
          align="center"
          prop="collectionTime"
          label="信息采集时间"
          :formatter="dateFormat"
        />
      </el-table>
      <div class="pt20 pr30 pl30 tc">
        <span class="page-tisl">当前显示1 到 {{ searchFrom.currentSize }} 条，共 {{ searchFrom.total }} 条记录</span>
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
import { getUserList } from '@/api/user.js'
import { inquireList } from '@/api/data-manage.js'
import { parseTime } from '@/utils'
import qs from 'qs'
import moment from 'moment'
export default {
  components: {},
  props: {},
  data() {
    return {
      defaultSearchFrom: {},
      searchFrom: {
        startDateBak: new Date(),
        endDateBak: new Date(),
        startDate: '',
        endDate: '',
        userArr: [],
        equipmentId: '',
        equipmentName: '',
        equipmentSoftVersion: '',
        equipmentHardwareVersion: '',
        companId: this.$store.getters.companyInfo.defaultCompanyId,
        userId: '',
        oneBatteryVoltageHigh: '',
        oneBatteryVoltageLow: '',
        highTemperature: '',
        lowTemperature: '',
        voltageDifference: '',
        temperatureDifference: '',
        status: '',
        statusCode: '',
        failure: '',
        pageNo: 1, // 当前页
        pageRows: 10, // 每页显示数
        currentSize: 0, // 当前条数
        total: 0 // 总页数
      },
      listLoading: false,
      tableData: [],
      casprops: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level } = node
          if (level === 0) {
            const nodes = Array.from(this.companyInfo.companyList)
              .map(item => ({
                value: item.companyName,
                label: item.companyName,
                leaf: level >= 2
              }))
            resolve(nodes)
            return
          }
          getUserList({
            ascriptionCompanyName: node.value,
            pageNo: 1, // 当前页
            pageRows: 10000 // 每页显示数
          }).then((res) => {
            const nodes = Array.from(res.userList.list)
              .map(item => ({
                value: item.userId,
                label: item.loginId,
                leaf: level >= 1
              }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes)
          }).catch(() => {
          })
        }
      }
    }
  },
  computed: {
    pickerEndOptions() {
      // 结束时间配置
      return {
        disabledDate: (time) => {
          if (this.searchFrom.startDateBak) {
            var nowMonth = this.searchFrom.startDateBak.getMonth() // 当前月
            var nowYear = this.searchFrom.startDateBak.getFullYear() // 当前年
            var monthStartDate = this.searchFrom.startDateBak.getTime() // 本月的开始时间
            var monthEndDate = new Date(nowYear, nowMonth + 1, 0).getTime() // 本月的结束时间
            return time.getTime() < monthStartDate || time.getTime() > monthEndDate || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    }
  },
  watch: {},
  mounted() {},
  created() {
    this.searchFrom.pageRows = this.page.pageSize
    this.defaultSearchFrom = Object.assign({}, this.searchFrom)
    const nowMonth = this.searchFrom.startDateBak.getMonth() // 当前月
    const nowYear = this.searchFrom.startDateBak.getFullYear() // 当前年
    this.searchFrom.startDateBak = new Date(nowYear, nowMonth, 1) // 本月的开始时间
    this.searchSubmit()
    this.$root.enterDown = this.searchSubmit
  },
  methods: {
    getUserList() {
      getUserList({
        ascriptionCompanyName: this.formInline.companyName,
        pageNo: 1, // 当前页
        pageRows: 10000 // 每页显示数
      }).then((res) => {
        this.userList = res.userList.list
      }).catch(() => {
      })
    },
    dateFormat(row, column) {
      var date = row[column.property]
      if (!date) { return '' }
      return moment(date, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
    },
    searchSubmit() { // 搜索查询
      if (this.listLoading) {
        return
      }
      this.searchFrom.startDate = parseTime(this.searchFrom.startDateBak, '{y}-{m}-{d}')
      this.searchFrom.endDate = parseTime(this.searchFrom.endDateBak, '{y}-{m}-{d}')
      this.searchFrom.userId = this.searchFrom.userArr[1]
      this.listLoading = true
      inquireList(this.searchFrom)
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
    changeStartDate(val) {
      // 开始时间改变
      const nowMonth = val.getMonth() // 当前月
      const nowYear = val.getFullYear() // 当前年
      const currDate = this.searchFrom.endDateBak.getTime()
      const monthStartDate = new Date(nowYear, nowMonth, 1).getTime() // 本月的开始时间
      const monthEndDate = new Date(nowYear, nowMonth + 1, 0).getTime() // 本月的结束时间
      if (currDate < monthStartDate || currDate > monthEndDate) {
        if (monthEndDate > Date.now()) {
          this.searchFrom.endDateBak = new Date()
        }
        this.searchFrom.endDateBak = new Date(nowYear, nowMonth + 1, 0)
      }
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
      // location.href = exportData(this.searchFrom)
      // + this.searchFrom
      this.searchFrom.startDate = parseTime(this.searchFrom.startDateBak, '{y}-{m}-{d}')
      this.searchFrom.endDate = parseTime(this.searchFrom.endDateBak, '{y}-{m}-{d}')
      this.searchFrom.userId = this.searchFrom.userArr[1]
      window.open(process.env.VUE_APP_BASE_DOWN_API + '/data/month/export?' + qs.stringify(this.searchFrom))
      // location.href = process.env.VUE_APP_BASE_DOWN_API + '/data/month/export?' + qs.stringify(this.searchFrom)
    }
  }
}
</script>
<style lang="scss" scoped>
  .cont-minheight{
    min-height: 570px;
  }
</style>
