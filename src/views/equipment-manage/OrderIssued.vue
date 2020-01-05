<template>
  <div>
    <div class="w-card search-card">
      <el-form :inline="true" :model="searchFrom" label-width="72px" class="form-inline my-inline-form">
        <el-form-item label="设备ID">
          <el-input v-model="searchFrom.equipmentId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="searchFrom.equipmentName" disabled placeholder="" />
        </el-form-item>
        <el-form-item label="所属公司">
          <el-input v-model="searchFrom.companyName" disabled placeholder="" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" :loading="searchLoading" @click="searchSubmit">搜索</el-button>
          <el-button type="primary" @click="readDevice">读取</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-heightAuto class="mt20 p20 w-card">
      <h5 class="title mb20">电流参数 <el-checkbox v-model="checkAll1" class="ml20" @change="(val)=>checkAllHandle(currentParameter,val)">全选</el-checkbox></h5>
      <el-form :inline="true" class="form-inline my-inline-form">
        <el-form-item v-for="(item,index) in currentParameter" :key="index">
          <el-checkbox v-model="item.checked" @change="checkMousd('checkAll1',currentParameter)" />
          <span class="w150">{{ item.text }}</span>
          <el-input v-model="item.value" :disabled="!item.checked" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <h5 class="title mb20">单体电压参数<el-checkbox v-model="checkAll2" class="ml20" @change="(val)=>checkAllHandle(monomerVoltageParameter,val)">全选</el-checkbox></h5>
      <el-form :inline="true" class="form-inline my-inline-form">
        <el-form-item v-for="(item,index) in monomerVoltageParameter" :key="index">
          <el-checkbox v-model="item.checked" @change="checkMousd('checkAll2',monomerVoltageParameter)" />
          <span class="w150">{{ item.text }}</span>
          <el-input v-model="item.value" :disabled="!item.checked" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <h5 class="title mb20">总电压参数<el-checkbox v-model="checkAll3" class="ml20" @change="(val)=>checkAllHandle(totalVoltageParameter,val)">全选</el-checkbox></h5>
      <el-form :inline="true" class="form-inline my-inline-form">
        <el-form-item v-for="(item,index) in totalVoltageParameter" :key="index">
          <el-checkbox v-model="item.checked" @change="checkMousd('checkAll3',totalVoltageParameter)" />
          <span class="w150">{{ item.text }}</span>
          <el-input v-model="item.value" :disabled="!item.checked" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <h5 class="title mb20">充电参数<el-checkbox v-model="checkAll4" class="ml20" @change="(val)=>checkAllHandle(chargingParameter,val)">全选</el-checkbox></h5>
      <el-form :inline="true" class="form-inline my-inline-form">
        <el-form-item v-for="(item,index) in chargingParameter" :key="index">
          <el-checkbox v-model="item.checked" @change="checkMousd('checkAll4',chargingParameter)" />
          <span class="w150">{{ item.text }}</span>
          <el-input v-model="item.value" :disabled="!item.checked" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <h5 class="title mb20">放电参数<el-checkbox v-model="checkAll5" class="ml20" @change="(val)=>checkAllHandle(dischargeParameter,val)">全选</el-checkbox></h5>
      <el-form :inline="true" class="form-inline my-inline-form">
        <el-form-item v-for="(item,index) in dischargeParameter" :key="index">
          <el-checkbox v-model="item.checked" @change="checkMousd('checkAll5',dischargeParameter)" />
          <span class="w150">{{ item.text }}</span>
          <el-input v-model="item.value" :disabled="!item.checked" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <h5 class="title mb20">其他参数<el-checkbox v-model="checkAll6" class="ml20" @change="(val)=>checkAllHandle(elseParameter,val)">全选</el-checkbox></h5>
      <el-form :inline="true" class="form-inline my-inline-form">
        <el-form-item v-for="(item,index) in elseParameter" :key="index">
          <el-checkbox v-model="item.checked" @change="checkMousd('checkAll6',elseParameter)" />
          <span class="w150">{{ item.text }}</span>
          <el-input v-if="!item.type" v-model="item.value" :disabled="!item.checked" placeholder="请输入内容" />
          <el-select v-else v-model="item.value" :disabled="!item.checked" placeholder="请选择">
            <el-option
              v-for="citem in item.options"
              :key="citem.value"
              :label="citem.name"
              :value="citem.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="mt30 tc">
        <el-button type="primary" :loading="searchLoading" @click="searchSubmit">重置</el-button>
        <el-tooltip content="只对勾选中的值进行命令下发！" placement="top">
          <el-button type="success" @click="submitFrom">下发</el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
// import { equipmentid } from '@/api/real-time-list.js'
import { getEquipment, readDevice, downCode } from '@/api/equipment-manage.js'
export default {
  components: {},
  props: {},
  data() {
    return {
      searchFrom: {
        equipmentId: this.$route.query.id || '',
        equipmentName: '',
        companyName: '',
        companyId: ''
      },
      activeItem: {},
      searchLoading: false,
      valueFrom: {},
      checkAll1: false,
      checkAll2: false,
      checkAll3: false,
      checkAll4: false,
      checkAll5: false,
      checkAll6: false,
      currentParameter: [ // 电流参数
        { checked: false, name: 'E0001', tip: '', text: '单体充电截止电压值(mV)', value: '' },
        { checked: false, name: 'E0002', tip: '', text: '单体电池充电恢复电压值(mV)', value: '' },
        { checked: false, name: 'E0003', tip: '', text: '额定容量(0.1Ah)', value: '' },
        { checked: false, name: 'E0004', tip: '', text: '压差过大三级报警值(mV)', value: '' },
        { checked: false, name: 'E0005', tip: '', text: '压差过大二级报警值(mV)', value: '' },
        { checked: false, name: 'E0006', tip: '', text: '压差过大一级报警值(mV)', value: '' },
        { checked: false, name: 'E0007', tip: '', text: '温差过大三级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'E0008', tip: '', text: '温差过大二级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'E0009', tip: '', text: '温差过大一级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'E0010', tip: '', text: '充电过流三级报警值(0.1A)', float: true, value: '' },
        { checked: false, name: 'E0011', tip: '', text: '充电过流二级报警值(0.1A)', float: true, value: '' },
        { checked: false, name: 'E0012', tip: '', text: '充电过流一级报警值(0.1A)', float: true, value: '' },
        { checked: false, name: 'E0013', tip: '', text: '充电过流三级报警恢复值(0.1A)', float: true, value: '' },
        { checked: false, name: 'E0014', tip: '', text: '充电过流二级报警恢复值(0.1A)', float: true, value: '' },
        { checked: false, name: 'E0015', tip: '', text: '充电过流一级报警恢复值(0.1A)', float: true, value: '' },
        { checked: false, name: 'E0016', tip: '', text: '放电过流三级报警值(0.1A)', float: true, value: '' },
        { checked: false, name: 'E0017', tip: '', text: '放电过流二级报警值(0.1A)', float: true, value: '' },
        { checked: false, name: 'E0018', tip: '', text: '放电过流一级报警值(0.1A)', float: true, value: '' },
        { checked: false, name: 'E0019', tip: '', text: '放电过流三级报警恢复值(0.1A)', float: true, value: '' },
        { checked: false, name: 'E0020', tip: '', text: '放电过流二级报警恢复值(0.1A)', float: true, value: '' },
        { checked: false, name: 'E0021', tip: '', text: '放电过流一级报警恢复值(0.1A)', float: true, value: '' }
      ],
      monomerVoltageParameter: [ // 单体电压参数
        { checked: false, name: 'V0001', tip: '', text: '单体过压三级报警值(mV)', value: '' },
        { checked: false, name: 'V0002', tip: '', text: '单体过压二级报警值(mV)', value: '' },
        { checked: false, name: 'V0003', tip: '', text: '单体过压一级报警值(mV)', value: '' },
        { checked: false, name: 'V0004', tip: '', text: '单体过压三级报警恢复值(mV)', value: '' },
        { checked: false, name: 'V0005', tip: '', text: '单体过压二级报警恢复值(mV)', value: '' },
        { checked: false, name: 'V0006', tip: '', text: '单体过压一级报警恢复值(mV)', value: '' },
        { checked: false, name: 'V0007', tip: '', text: '单体欠压三级报警值(mV)', value: '' },
        { checked: false, name: 'V0008', tip: '', text: '单体欠压二级报警值(mV)', value: '' },
        { checked: false, name: 'V0009', tip: '', text: '单体欠压一级报警值(mV)', value: '' },
        { checked: false, name: 'V0010', tip: '', text: '单体欠压三级报警恢复值(mV)', value: '' },
        { checked: false, name: 'V0011', tip: '', text: '单体欠压二级报警恢复值(mV)', value: '' },
        { checked: false, name: 'V0012', tip: '', text: '单体欠压一级报警恢复值(mV)', value: '' }
      ],
      totalVoltageParameter: [ // 总电压参数
        { checked: false, name: 'A0001', tip: '', text: '总电压过压三级报警值(0.1V)', float: true, value: '' },
        { checked: false, name: 'A0002', tip: '', text: '总电压过压二级报警值(0.1V)', float: true, value: '' },
        { checked: false, name: 'A0003', tip: '', text: '总电压过压一级报警值(0.1V)', float: true, value: '' },
        { checked: false, name: 'A0004', tip: '', text: '总电压过压三级报警恢复值(0.1V)', float: true, value: '' },
        { checked: false, name: 'A0005', tip: '', text: '总电压过压二级报警恢复值(0.1V)', float: true, value: '' },
        { checked: false, name: 'A0006', tip: '', text: '总电压过压一级报警恢复值(0.1V)', float: true, value: '' },
        { checked: false, name: 'A0007', tip: '', text: '总电压欠压三级报警值(0.1V)', float: true, value: '' },
        { checked: false, name: 'A0008', tip: '', text: '总电压欠压二级报警值(0.1V)', float: true, value: '' },
        { checked: false, name: 'A0009', tip: '', text: '总电压欠压一级报警值(0.1V)', float: true, value: '' },
        { checked: false, name: 'A0010', tip: '', text: '总电压欠压三级报警恢复值(0.1V)', float: true, value: '' },
        { checked: false, name: 'A0011', tip: '', text: '总电压欠压二级报警恢复值(0.1V)', float: true, value: '' },
        { checked: false, name: 'A0012', tip: '', text: '总电压欠压一级报警恢复值(0.1V)', float: true, value: '' }

      ],
      chargingParameter: [ // 充电参数
        { checked: false, name: 'C0001', tip: '', text: '充电温度过高三级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'C0002', tip: '', text: '充电温度过高二级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'C0003', tip: '', text: '充电温度过高一级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'C0004', tip: '', text: '充电温度高三级报警恢复值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'C0005', tip: '', text: '充电温度高二级报警恢复值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'C0006', tip: '', text: '充电温度高一级报警恢复值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'C0007', tip: '', text: '充电温度过低三级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'C0008', tip: '', text: '充电温度过低二级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'C0009', tip: '', text: '充电温度过低一级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'C0010', tip: '', text: '充电温度过低三级报警值恢复值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'C0011', tip: '', text: '充电温度过低二级报警值恢复值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'C0012', tip: '', text: '充电温度过低一级报警值恢复值(0.1℃)', float: true, value: '' }
      ],
      dischargeParameter: [ // 放电参数
        { checked: false, name: 'D0001', tip: '', text: '放电温度过高三级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'D0002', tip: '', text: '放电温度过高二级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'D0003', tip: '', text: '放电温度过高一级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'D0004', tip: '', text: '放电温度高三级报警恢复值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'D0005', tip: '', text: '放电温度高二级报警恢复值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'D0006', tip: '', text: '放电温度高一级报警恢复值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'D0007', tip: '', text: '放电温度过低三级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'D0008', tip: '', text: '放电温度过低二级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'D0009', tip: '', text: '放电温度过低一级报警值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'D0010', tip: '', text: '放电温度过低三级报警值恢复值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'D0011', tip: '', text: '放电温度过低二级报警值恢复值(0.1℃)', float: true, value: '' },
        { checked: false, name: 'D0012', tip: '', text: '放电温度过低一级报警值恢复值(0.1℃)', float: true, value: '' }
      ],
      elseParameter: [ // 其他参数
        { checked: false, name: 'Q0001', tip: '', text: '充电加热使能', value: '', type: 'select', options: [{ name: '使能', value: 1 }, { name: '禁止', value: 0 }] },
        { checked: false, name: 'Q0002', tip: '', text: '充电加热开始温度(0.1℃)', float: true, value: '' },
        { checked: false, name: 'Q0003', tip: '', text: '充电加热截止温度(0.1℃)', float: true, value: '' },
        { checked: false, name: 'Q0004', tip: '', text: 'SOC过低三级报警值（%）', float: true, value: '' },
        { checked: false, name: 'Q0005', tip: '', text: 'SOC过低二级报警值（%）', float: true, value: '' },
        { checked: false, name: 'Q0006', tip: '', text: 'SOC过低一级报警值(%)', float: true, value: '' },
        { checked: false, name: 'Q0007', tip: '', text: '正常充电电流设置值(0.1A)', float: true, value: '' },
        { checked: false, name: 'Q0008', tip: '', text: '充电加热电流设置值(0.1A)', float: true, value: '' },
        { checked: false, name: 'Q0009', tip: '', text: '总放电电量（0.1KWh）', float: true, value: '' },
        { checked: false, name: 'Q0010', tip: '', text: '总充电电量（0.1KWh）', float: true, value: '' },
        { checked: false, name: 'Q0011', tip: '', text: '被动均衡使能', value: '', type: 'select', options: [{ name: '使能', value: 1 }, { name: '禁止', value: 0 }] },
        { checked: false, name: 'Q0012', tip: '', text: '被动均衡开启电压差值（mV）', value: '' },
        { checked: false, name: 'Q0013', tip: '', text: '被动均衡开启压差值（mV）', value: '' },
        { checked: false, name: 'Q0014', tip: '', text: '远程升级使能', value: '', type: 'select', options: [{ name: '使能', value: 1 }, { name: '禁止', value: 0 }] }
      ],
      defaultCurrentParameter: [],
      defaultMonomerVoltageParameter: [],
      defaultTotalVoltageParameter: [],
      defaultChargingParameter: [],
      defaultDischargeParameter: [],
      defaultElseParameter: []
    }
  },
  computed: {
    getParams() {
      const obj = { equipmentId: this.searchFrom.equipmentId }
      const setData = (element) => {
        if (element.checked) {
          obj[element.name] = element.value
        }
      }
      this.currentParameter.forEach(setData)
      this.monomerVoltageParameter.forEach(setData)
      this.totalVoltageParameter.forEach(setData)
      this.chargingParameter.forEach(setData)
      this.dischargeParameter.forEach(setData)
      this.elseParameter.forEach(setData)
      return obj
    }
  },
  watch: {},
  mounted() {},
  created() {
    if (this.$route.query.id) {
      this.searchSubmit()
    }
    this.$root.enterDown = this.searchSubmit
  },
  methods: {
    checkAllHandle(list, val) {
      if (val) {
        list.forEach(element => {
          element.checked = true
        })
        return
      }
      list.forEach(element => {
        element.checked = false
      })
    },
    checkMousd(flg, list) {
      this[flg] = !list.some(element => {
        return !element.checked
      })
    },
    searchSubmit() {
      // 搜索设备
      this.searchLoading = true
      this.searchFrom.companyName = ''
      this.searchFrom.equipmentName = ''
      getEquipment({
        equipmentId: this.searchFrom.equipmentId
      }).then((res) => {
        if (!res.paramsData) {
          this.$message.warning('搜索不到该设备id~')
          return
        }
        this.searchFrom.equipmentName = res.equipmentName
        this.searchFrom.companyName = res.companyName
        const setData = (element) => {
          let value = res.paramsData[element.name.toLowerCase()]
          value = Number(value)
          if (value || value === 0) {
            element.checked = false
            element.value = value
          }
        }
        this.currentParameter.forEach(setData)
        this.monomerVoltageParameter.forEach(setData)
        this.totalVoltageParameter.forEach(setData)
        this.chargingParameter.forEach(setData)
        this.dischargeParameter.forEach(setData)
        this.elseParameter.forEach(setData)
        this.defaultCurrentParameter = [...this.currentParameter]
        this.defaultMonomerVoltageParameter = [...this.monomerVoltageParameter]
        this.defaultTotalVoltageParameter = [...this.totalVoltageParameter]
        this.defaultDischargeParameter = [...this.chargingParameter]
        this.defaultChargingParameter = [...this.dischargeParameter]
        this.defaultElseParameter = [...this.elseParameter]
        this.activeItem = Object.assign({}, this.searchFrom)
      }).catch(() => {
      }).finally(() => {
        this.searchLoading = false
      })
    },
    readDevice() {
      // 读取设备信息
      if (!this.searchFrom.companyName) {
        this.$message.warning('请先进行设备搜索~')
        return
      }
      readDevice({
        equipmentId: this.searchFrom.equipmentId
      }).then((res) => {
        this.$message.success('操作成功')
      }).catch(() => {
      }).finally(() => {
      })
    },
    resetFrom() {
      // 重置表单
      this.currentParameter = [...this.defaultCurrentParameter]
      this.monomerVoltageParameter = [...this.defaultMonomerVoltageParameter]
      this.totalVoltageParameter = [...this.defaultTotalVoltageParameter]
      this.dischargeParameter = [...this.defaultDischargeParameter]
      this.chargingParameter = [...this.defaultChargingParameter]
      this.elseParameter = [...this.defaultElseParameter]
    },
    submitFrom() {
      if (this.activeItem.companyId !== this.searchFrom.companyId) {
        this.$message.warning('请确保输入正确的设备id~')
        return
      }
      const filterFun = (element, index, arr) => {
        const value = Number(element.value)
        if (element.checked) {
          if (!element.value.toString()) { // 值为空
            return true
          }
          if (isNaN(value)) { // 不是数字
            return true
          }
          if (!Number.isInteger(value) && element.text.indexOf('0.') === -1) { // 只能输入整形的填入了小数
            return true
          }
        }
        return false
      }
      const currentParameter = this.currentParameter.filter(filterFun)
      const monomerVoltageParameter = this.monomerVoltageParameter.filter(filterFun)
      const totalVoltageParameter = this.totalVoltageParameter.filter(filterFun)
      const chargingParameter = this.chargingParameter.filter(filterFun)
      const dischargeParameter = this.dischargeParameter.filter(filterFun)
      const elseParameter = this.elseParameter.filter(filterFun)
      const valueFun = (element) => {
        setTimeout(() => {
          const value = Number(element.value)
          if (!element.value.toString()) { // 值为空
            this.$message.warning('请输入' + element.text)
            return true
          }
          if (isNaN(value)) { // 不是数字
            this.$message.warning('请输入正确的' + element.text)
            return true
          }
          if (!Number.isInteger(value) && !element.float) { // 只能输入整形的填入了小数
            this.$message.warning(element.text + '：不能输入小数！')
            return true
          }
        }, 200)
      }
      if (currentParameter.length) {
        currentParameter.forEach(valueFun)
        return
      }
      if (monomerVoltageParameter.length) {
        monomerVoltageParameter.forEach(valueFun)
        return
      }
      if (totalVoltageParameter.length) {
        totalVoltageParameter.forEach(valueFun)
        return
      }
      if (chargingParameter.length) {
        chargingParameter.forEach(valueFun)
        return
      }
      if (dischargeParameter.length) {
        dischargeParameter.forEach(valueFun)
        return
      }
      if (elseParameter.length) {
        elseParameter.forEach(valueFun)
        return
      }
      this.$confirm('你确定要对选中的值进行命令下发吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        downCode(this.getParams).then((res) => {
          this.$message.success('下发命令成功')
        }).catch(() => {
        }).finally(() => {

        })
      }).catch(() => {

      })
    }
  }
}
</script>
<style lang="scss" scoped>
.my-inline-form{
  .el-form-item__content,.el-form-item{
    vertical-align: middle;
  }
}
.title{
  font-size: 14px;
  line-height: 35px;
  border-bottom: 1px solid #D4DBEA;
}
.w150{
  width: 140px;
  padding: 0 8px;
  text-align: justify;
  display: inline-block;
  white-space: normal;
  vertical-align: middle;
  line-height: normal;
}
.cont-minheight{
  min-height: 740px;
}
</style>
