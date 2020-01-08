<template>
  <div>
    <div class="w-card search-card">
      <el-form :inline="true" :model="searchFrom" size="small" label-width="72px" class="form-inline">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchFrom.rangeDate"
            type="daterange"
            range-separator="至"
            :picker-options="pickerOptions0"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate0"
          />
        </el-form-item>
        <el-form-item label="设备ID">
          <el-input v-model="searchFrom.equipmentId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w120" @click="resetFrom">重置</el-button>
          <el-button type="success" class="w120" @click="searchSubmit">搜索</el-button>
        </el-form-item>
        <br>
        <el-form-item label="故障等级">
          <el-radio-group v-model="searchFrom.failure">
            <el-radio v-for="(item,index) in faultLevel" :key="item.value" :class="'radio'+index" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
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
          label="设备ID"
          width="120"
        >
          <template slot-scope="scope">
            <router-link :to="{ path: '/real/detailed-data', query: { id: scope.row.equipmentId }}">
              {{ scope.row.equipmentId }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="equipmentName"
          width="140px"
          label="设备名称"
        />
        <el-table-column
          align="center"
          prop="soc"
          width="80px"
          label="soc(%)"
        />
        <el-table-column
          align="center"
          prop="statusName"
          width="120"
          sortable
          label="设备状态"
        />
        <el-table-column
          align="center"
          prop="failureName"
          width="120"
          sortable
          label="故障等级"
        />
        <el-table-column
          align="center"
          prop="statusCode"
          width="120"
          label="状态功能码"
        />
        <el-table-column align="center" width="160px" label="电压（最高|最低）">
          <template slot-scope="scope">
            <div>
              {{ scope.row.oneBatteryVoltageHigh }}|{{ scope.row.oneBatteryVoltageLow }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="160px" label="温度（最高|最低）">
          <template slot-scope="scope">
            <div>
              {{ scope.row.highTemperature }}|{{ scope.row.lowTemperature }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="sysProbe"
          width="150"
          label="总电流（单位A）"
        />
        <el-table-column
          align="center"
          prop="sysVoltage"
          width="150"
          label="总电压（单位V）"
        />
        <el-table-column
          align="center"
          prop="voltageDifference"
          width="140"
          label="压差（单位V）"
        />
        <el-table-column
          align="center"
          prop="temperatureDifference"
          width="120px"
          label="温差（°C）"
        />
        <el-table-column
          align="center"
          prop="collectionTime"
          width="160px"
          :formatter="dateFormat"
          label="信息采集时间"
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
import { dataList } from '@/api/real-time-list.js'
import moment from 'moment'
export default {
  components: {},
  props: {},
  data() {
    return {
      defaultSearchFrom: {},
      searchFrom: {
        equipmentId: '',
        statusName: '',
        status: '',
        failure: this.$route.query.failure || '',
        startDate: '',
        endDate: '',
        rangeDate: [],
        failureName: [],
        pageNo: 1, // 当前页
        pageRows: 10, // 每页显示数
        currentSize: 0, // 当前条数
        total: 0 // 总页数
      },
      listLoading: false,
      tableData: []
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {
    this.searchFrom.pageRows = this.page.pageSize
    this.defaultSearchFrom = Object.assign({}, this.searchFrom)
    this.searchSubmit()
    this.$root.enterDown = this.searchSubmit
  },
  methods: {
    searchSubmit() { // 搜索查询
      if (this.listLoading) {
        return
      }
      this.listLoading = true
      dataList(this.searchFrom)
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
    dateFormat(row, column) {
      var date = row[column.property]
      if (!date) { return '' }
      return moment(date, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
<style lang="scss" scoped>
  .cont-minheight{
    min-height: 740px;

  }
  .search-card /deep/{
    .el-radio__inner{
      width: 12px;
      height: 12px;
    }
    .el-radio__input.is-checked {
      .el-radio__inner{
        background-color: #fff;
        &::after{
          width: 8px;
          height: 8px;
        }
      }
    }
    .radio1 {
      .el-radio__input.is-checked {
        .el-radio__inner{
          border-color: #e42421;
          &::after{
            background-color: #e42421;
          }
        }
      }
    }
    .radio2 {
      .el-radio__input.is-checked {
        .el-radio__inner{
          border-color: #f4741d;
          &::after{
            background-color: #f4741d;
          }
        }
      }
    }
    .radio3 {
      .el-radio__input.is-checked {
        .el-radio__inner{
          border-color: #f9ed1d;
          &::after{
            background-color: #f9ed1d;
          }
        }
      }
    }
    .radio4,.radio0 {
      .el-radio__input.is-checked {
        .el-radio__inner{
          border-color: #4241f4;
          &::after{
            background-color: #4241f4;
          }
        }
      }
    }
  }
</style>
