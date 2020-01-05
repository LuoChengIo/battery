<template>
  <div>
    <div class="w-card search-card">
      <el-form :inline="true" :model="searchFrom" label-width="72px" class="form-inline">
        <el-form-item label="设备ID">
          <el-input v-model="searchFrom.equipmentId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="searchFrom.equipmentName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="所属公司">
          <el-select v-model="searchFrom.companyId" filterable placeholder="请选择">
            <el-option
              v-for="item in companyInfo.companyList"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select v-model="searchFrom.status">
            <el-option v-for="(item,index) in equipmentStatus" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="出入库状态">
          <el-select v-model="searchFrom.status">
            <el-option label="全部" value="" />
            <el-option label="未入库" value="1" />
            <el-option label="已入库" value="2" />
            <el-option label="已出库" value="3" />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="resetFrom">重置</el-button>
          <el-button type="success" @click="searchSubmit">搜索</el-button>
          <el-button type="success" icon="el-icon-plus" @click="dialogAddEdit(1)">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-heightAuto class="mt24 pb20 w-card">
      <el-table
        v-loading="listLoading"
        :data="tableData"
        border
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
          label="设备名称"
        />
        <el-table-column
          align="center"
          prop="companyName"
          label="所属公司"
        />
        <el-table-column
          align="center"
          prop="equipmentSoftVersion"
          label="软件版本"
        />
        <el-table-column
          align="center"
          prop="equipmentHardwareVersion"
          label="硬件版本"
        />
        <el-table-column
          align="center"
          prop="updatetime"
          label="创建时间"
          :formatter="dateFormat"
        />
        <el-table-column
          align="center"
          label="在线状态"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isOnline==1" type="success">在线</el-tag>
            <el-tag v-else type="danger">离线</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="statename"
          label="设备状态"
        />
        <!-- <el-table-column
          align="center"
          prop="status"
          label="出入库状态"
        /> -->
        <el-table-column
          align="center"
          label="操作"
          width="450"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="dialogAddEdit(2,scope.row)">编辑</el-button>
            <el-button type="success" size="mini" @click="goToPage(scope.row,1)">查看详情</el-button>
            <el-button type="warning" size="mini" @click="goToPage(scope.row,2)">命令下发</el-button>
            <el-button type="danger" size="mini" @click="dialogDdelete(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
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
    <!-- 新增修改设备信息 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="645px"
    >
      <el-form ref="addEditFrom" :inline="true" :rules="rules" :model="formInline" label-width="102px" class="demo-form-inline">
        <el-form-item label="设备编号" prop="equipmentId">
          <el-input v-model="formInline.equipmentId" placeholder="" />
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="formInline.equipmentName" maxlength="30" placeholder="" />
        </el-form-item>
        <el-form-item label="所属公司" prop="companyName">
          <el-select v-model="formInline.companyName" style="width:185px;" filterable placeholder="请选择" @change="companyChange">
            <el-option
              v-for="item in companyInfo.companyList"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属用户" prop="adduserid">
          <el-select v-model="formInline.adduserid" style="width:185px;" filterable placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.loginId"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addEditSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList } from '@/api/user.js'
import { equipmentList, equipmentDel, equipmentSave } from '@/api/equipment-manage.js'
import moment from 'moment'
export default {
  components: {},
  props: {},
  data() {
    return {
      defaultSearchFrom: {},
      searchFrom: {
        equipmentId: '',
        equipmentName: '',
        companyId: this.$store.getters.companyInfo.defaultCompanyId,
        state: '',
        status: '',
        pageNo: 1, // 当前页
        pageRows: 10, // 每页显示数
        currentSize: 0, // 当前条数
        total: 0 // 总页数
      },
      listLoading: false,
      tableData: [{
        data1: 1
      }],
      dialogFormVisible: false,
      dialogVisible: false,
      dialogTitle: '',
      formInline: {
        id: '',
        equipmentId: '',
        companyName: '',
        equipmentName: '',
        adduserid: ''
      },
      rules: {
        equipmentId: [
          { required: true, message: '请输入设备id', trigger: 'blur' }
        ],
        equipmentName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请选择所属公司', trigger: 'change' }
        ],
        adduserid: [
          { required: true, message: '请选择所属用户', trigger: 'change' }
        ]
      },
      formData: '',
      userList: [],
      formLabelWidth: '120px'
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
    dateFormat(row, column) {
      var date = row[column.property]
      if (!date) { return '' }
      return moment(date, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
    },
    goToPage(item, type) {
      if (type === 1) {
        this.$router.push({ path: '/real/detailed-data', query: { id: item.equipmentId }})
      } else if (type === 2) {
        this.$router.push({ path: '/equipment/order-issuedt', query: { id: item.equipmentId }})
      }
    },
    searchSubmit() { // 搜索查询
      if (this.listLoading) {
        return
      }
      this.listLoading = true
      equipmentList(this.searchFrom)
        .then(res => {
          res.data.list.forEach(element => {
            if (element.status != null) {
              var arr = this.equipmentStatus.filter(ele => {
              // eslint-disable-next-line eqeqeq
                return ele.value == (element.status + '')
              })
              element.statename = arr[0].label
            }
          })
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
    dialogAddEdit(type, item) {
      this.dialogType = type
      this.formInline.disabled = false
      this.treeDialogData = []
      this.userList = []
      this.checkedAll = false
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.addEditFrom.clearValidate()
        }, 50)
      })

      if (type === 1) {
        // 添加角色
        this.formInline = {
          id: '',
          equipmentId: '',
          companyName: '',
          equipmentName: '',
          adduserid: ''
        }
        this.dialogTitle = '新建设备'
      } else if (type === 2) {
        this.formInline = {
          id: item.id,
          equipmentId: item.equipmentId,
          companyName: item.companyName,
          equipmentName: item.equipmentName,
          adduserid: item.adduserid
        }
        this.dialogTitle = '编辑设备'
        getUserList({
          ascriptionCompanyName: this.formInline.companyName,
          pageNo: 1, // 当前页
          pageRows: 10000 // 每页显示数
        }).then((res) => {
          this.userList = res.userList.list
        }).catch(() => {
        })
      }
      this.dialogVisible = true
    },
    dialogDdelete(item, index) { // 删除设备
      this.$confirm('你确定要删除该设备吗？删除后，设备记录将删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipmentDel({
          id: item.id
        }).then(() => {
          this.tableData.splice(index, 1)
          this.$message.success('删除成功！')
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    addEditSubmit() { // 编辑角色
      this.$refs['addEditFrom'].validate((valid) => {
        if (valid) {
          let actionFuc = equipmentSave
          if (this.dialogType === 2) {
            actionFuc = equipmentSave
          }
          actionFuc(this.formInline).then(() => {
            this.$message.success('保存成功！')
            this.dialogVisible = false
            this.searchSubmit()
          }).catch(() => {
          })
        } else {
          return false
        }
      })
    },
    companyChange(val) {
      this.formInline.adduserid = ''
      this.userList = []
      getUserList({
        ascriptionCompanyName: val,
        pageNo: 1, // 当前页
        pageRows: 10000 // 每页显示数
      }).then((res) => {
        this.userList = res.userList.list
      }).catch(() => {
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .cont-minheight{
    min-height: 740px;
  }
  .dialog-footer{
    text-align: center;
  }
</style>
