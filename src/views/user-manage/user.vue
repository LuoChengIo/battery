<template>
  <div>
    <div class="w-card search-card">
      <el-form :inline="true" :model="searchFrom" size="small" label-width="72px" class="form-inline">
        <el-form-item label="用户ID">
          <el-input v-model="searchFrom.operatorId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="searchFrom.loginId" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="所属公司">
          <el-autocomplete
            v-model="searchFrom.ascriptionCompanyName"
            popper-class="my-autocomplete"
            value-key="companyName"
            :fetch-suggestions="querySearch"
            placeholder="请输入所属公司"
          >
            <i
              slot="suffix"
              class="el-icon-search el-input__icon"
            />
            <template slot-scope="{ item }">
              <div class="name">{{ item.companyName }}</div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="searchFrom.status">
            <el-option label="全部" value="" />
            <el-option label="启用" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w120" @click="resetFrom">重置</el-button>
          <el-button type="success" class="w120" @click="searchSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-heightAuto class="mt24 p20 w-card">
      <div class="mb20">
        <el-button size="large" class="w140" type="warning" @click="operationHandle('',6)">新增</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          prop="userId"
          label="用户ID"
        />
        <el-table-column
          align="center"
          prop="loginId"
          label="用户名称"
        />
        <el-table-column
          align="center"
          prop="ascriptionCompanyName"
          label="所属公司"
        />
        <el-table-column
          align="center"
          prop="parentName"
          label="父账户"
        />
        <el-table-column
          align="center"
          prop="equipmentNum"
          label="设备数量"
        />
        <el-table-column
          align="center"
          label="状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status==='0'" type="success">启用</span>
            <span v-else type="danger" class="text-danger">停用</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          :formatter="dateFormat"
        />
        <el-table-column
          align="center"
          label="操作"
          width="250"
        >
          <template slot-scope="scope">
            <img class="img-btn" src="@/assets/chakan.png" title="查看" @click="operationHandle(scope.row,1)">
            <img class="img-btn" src="@/assets/bianji.png" title="编辑" @click="operationHandle(scope.row,2)">
            <img v-if="scope.row.status=='0'" class="img-btn" src="@/assets/stop.png" title="停用" @click="operationHandle(scope.row,3)">
            <img v-if="scope.row.status=='1'" class="img-btn" src="@/assets/use.png" title="启用" @click="operationHandle(scope.row,4)">
            <img class="img-btn" src="@/assets/reset.png" title="密码重置" @click="operationHandle(scope.row,5)">
          </template>
        </el-table-column>
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
    <!-- 弹框 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :show-close="false"
      width="988px"
    >
      <div>
        <div class="dg-right-ct ">
          <div class="mb5 f18">
            角色权限
          </div>
          <el-tree
            ref="vuetree"
            :data="treeDialogData"
            default-expand-all
            node-key="id"
            highlight-current
            :props="defaultProps"
          />`
        </div>
        <div class="dg-left-ct">
          <el-form class="custom-from" :disabled="formInline.disabled" label-width="72px" style="min-height: 191px;" :inline="true" :model="formInline">
            <el-form-item v-if="dialogType==1||dialogType==2" label="账户ID">
              <el-input v-model="formInline.userId" disabled placeholder="" />
            </el-form-item>
            <el-form-item label="用户名称">
              <el-input v-model="formInline.loginId" placeholder="" />
            </el-form-item>
            <el-form-item label="所属公司">
              <el-autocomplete
                v-model="formInline.ascriptionCompanyName"
                popper-class="my-autocomplete"
                value-key="companyName"
                :fetch-suggestions="querySearch"
                placeholder="请输入所属公司"
                @select="companyChange"
              >
                <i
                  slot="suffix"
                  class="el-icon-search el-input__icon"
                />
                <template slot-scope="{ item }">
                  <div class="name">{{ item.companyName }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item v-if="dialogType==1||dialogType==2" label="上级用户">
              <el-input v-model="formInline.parentName" disabled placeholder="" />
            </el-form-item>
            <el-form-item v-if="dialogType==1||dialogType==2" label="用户等级">
              <el-input v-model="formInline.userType" disabled maxlength="30" placeholder="" />
            </el-form-item>
            <el-form-item label="子账户数">
              <el-input v-model="formInline.subOperatorNum" maxlength="30" placeholder="" />
            </el-form-item>
          </el-form>
          <div class="transfer p10">
            <el-row class="hp100">
              <el-col :span="6" class="ovh hp100">
                <div>可选角色(可选<span class="text-danger">{{ transferData.length }}</span>项)</div>
                <el-scrollbar class="custom-scollbar" style="height:calc(100% - 21px)">
                  <el-checkbox-group v-model="leftChecked">
                    <el-checkbox v-for="item in transferData" :key="item.key" :label="item.key">{{ item.label }}</el-checkbox>
                  </el-checkbox-group>
                </el-scrollbar>
              </el-col>
              <el-col :span="8" class="hp100">
                <el-button type="info" :disabled="!leftChecked.length" style="margin-top: 42px;" size="medium" icon="el-icon-arrow-right" @click="transChange('right')" />
                <br>
                <el-button type="info" :disabled="!rightChecked.length" style="margin-left:0;margin-top: 10px;" size="medium" icon="el-icon-arrow-left" @click="transChange('left')" />
              </el-col>
              <el-col :span="10" class="ovh hp100">
                <div>已选角色(已选<span class="text-danger">{{ rightTransferData.length }}</span>项)</div>
                <el-scrollbar class="custom-scollbar" style="height:calc(100% - 21px)">
                  <el-checkbox-group v-model="rightChecked" @change="transferChange">
                    <el-checkbox v-for="item in rightTransferData" :key="item.key" :label="item.key">{{ item.label }}</el-checkbox>
                  </el-checkbox-group>
                </el-scrollbar>
              </el-col>
            </el-row>
            <!-- <el-transfer v-model="formInline.transfer" :titles="['可选角色', '已选角色']" :data=" " :right-default-checked="rightDefaultchecked" @right-check-change="transferChange" /> -->
          </div>
        </div>

      </div>
      <div slot="footer" class="dialog-footer tc">
        <el-button v-if="dialogType!==1" type="danger" class="dialog-btn" @click="addEditSubmit">确定</el-button>
        <el-button type="success" class="dialog-btn" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, getCompanyList, midifyUserStatus, passwordReset, getFunctionListByRoleList, getUserInformation, addUser, modifyUserInformation, getRoleList } from '@/api/user.js'
import { validUsername } from '@/utils/validate'
import { encryptedData } from '@/utils/index'
import moment from 'moment'
export default {
  components: {},
  props: {},
  data() {
    return {
      defaultSearchFrom: {},
      searchFrom: {
        operatorId: '',
        loginId: '',
        ascriptionCompanyName: '',
        status: '',
        pageNo: 1, // 当前页
        pageRows: 10, // 每页显示数
        currentSize: 0, // 当前条数
        total: 0 // 总页数
      },
      listLoading: false,
      tableData: [],
      dialogType: 1,
      dialogVisible: false,
      dialogTitle: '',
      formInline: {
        userId: '',
        loginId: '',
        ascriptionCompanyId: '',
        ascriptionCompanyName: '',
        subOperatorNum: '',
        roleString: '',
        transfer: [],
        disabled: false,
        checkAll: false
      },
      treeDialogData: [],
      leftChecked: [],
      rightChecked: [],
      transferData: [],
      rightTransferData: [],
      defaultProps: {
        children: 'twoLevelFunctionList',
        label: 'functionName'
      },
      rightDefaultchecked: []
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
    querySearch(queryString, cb) {
      // 公司输入建议
      const results = []
      getCompanyList({
        companyName: queryString,
        pageNo: 1, // 当前页
        pageRows: 1000 // 每页显示数
      })
        .then(res => {
          cb(res.companyList.list)
        })
        .catch(() => {
          cb(results)
        })
    },
    companyChange(item, callback) {
      // 选择公司后 展示对应的角色
      this.formInline.ascriptionCompanyId = item.companyId
      getRoleList({
        ascriptionCompanyName: item.companyName,
        pageNo: 1, // 当前页
        pageRows: 100000 // 每页显示数
      })
        .then(res => {
          var transferData = res.roleList.list || []
          transferData.forEach(element => {
            element.key = element.roleId
            element.label = element.roleName
          })
          this.transferData = transferData
          callback && callback()
        })
        .catch(() => {
        })
    },
    searchSubmit() { // 搜索查询
      if (this.listLoading) {
        return
      }
      this.listLoading = true
      getUserList(this.searchFrom)
        .then(res => {
          this.tableData = res.userList.list
          this.searchFrom.currentSize = res.userList.size
          this.searchFrom.total = res.userList.total
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    transferChange(val) {
      // 选择角色
      console.log(val)
      if (!val.length) {
        this.treeDialogData = []
        return
      }
      const roleString = val.join('|') + '|'
      getFunctionListByRoleList({
        roleString: roleString
      }).then((res) => {
        const data = res.functionList
        function dataFor(tree) {
          tree.forEach(element => {
            element.id = element.functionId
            if (element.twoLevelFunctionList && element.twoLevelFunctionList.length) {
              dataFor(element.twoLevelFunctionList)
            }
          })
        }
        dataFor(data)
        this.treeDialogData = data
      }).catch(() => {
      })
    },
    addEditSubmit() { // 编辑角色
      let actionFuc = addUser
      if (this.dialogType === 2) {
        actionFuc = modifyUserInformation
      }
      if (!this.formInline.loginId) {
        this.$message.warning('请填写用户名称')
        return
      }
      if (!validUsername(this.formInline.loginId)) {
        this.$message.warning('请填写正确的用户名~')
        return
      }
      if (!this.formInline.ascriptionCompanyName) {
        this.$message.warning('请选择所属公司')
        return
      }
      if (!this.formInline.subOperatorNum) {
        this.$message.warning('请填写子账户数')
        return
      }
      if (isNaN(Number(this.formInline.subOperatorNum))) {
        this.$message.warning('请填写正确的子账户数')
        return
      }
      this.formInline.transfer = []
      this.rightTransferData.forEach(element => {
        this.formInline.transfer.push(element.key)
      })
      if (!this.formInline.transfer.length) {
        this.$message.warning('请选择用户角色')
        return
      }
      this.formInline.roleString = this.formInline.transfer.join('|') + '|'
      actionFuc(this.formInline).then(() => {
        this.$message.success('保存成功！')
        this.dialogVisible = false
        this.searchSubmit()
      }).catch(() => {
      })
    },
    operationHandle(item, type) {
      // 系列操作
      this.dialogType = type
      this.formInline.disabled = false
      this.formInline = Object.assign(this.formInline, {
        operatorId: '',
        loginId: '',
        ascriptionCompanyId: '',
        ascriptionCompanyName: '',
        subOperatorNum: '',
        roleString: '',
        transfer: []
      })
      this.transferData = []
      this.rightTransferData = []
      this.treeDialogData = []
      this.leftChecked = []
      this.rightChecked = []
      if (type === 6) {
        // 添加用户
        this.dialogTitle = '添加用户'
        this.treeDialogData = []
        this.dialogVisible = true
      } else if (type === 1 || type === 2) {
        getUserInformation({
          userId: item.userId
        }).then((res) => {
          const data = res.userInformation
          data.subOperatorNum = data.subUserNum
          // data.operatorId = data.userId
          this.formInline = Object.assign(this.formInline, data)
          this.companyChange({
            companyId: data.ascriptionCompanyId,
            companyName: data.ascriptionCompanyName
          }, () => {
            var transfer = []
            data.roleList.forEach(element => {
              transfer.push(element.roleId)
            })
            this.formInline.transfer = transfer
            this.leftChecked = [...transfer]
            this.transChange('right')
            this.transferChange(transfer)
          })
        }).catch(() => {
        })
        this.dialogTitle = '编辑公司'
        if (type === 1) {
          this.formInline.disabled = true
          this.dialogTitle = '查看公司'
        }
        this.dialogVisible = true
      } else if (type === 4) {
        // 启用
        midifyUserStatus({
          userId: item.userId,
          operateFlag: 0
        }).then(() => {
          this.$message.success('操作成功')
          item.status = '0'
        })
      } else if (type === 3) {
        // 停用
        this.$confirm('用户停用后将不能使用，是否确认停用？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          midifyUserStatus({
            userId: item.userId,
            operateFlag: 1
          }).then(() => {
            this.$message.success('操作成功')
            item.status = '1'
          })
        }).catch(() => {
        })
      } else if (type === 5) {
        // 重置密码
        this.$prompt('请输入密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'password',
          inputErrorMessage: '请输入6位以上密码',
          closeOnClickModal: false,
          inputValidator: (val) => {
            if (val.length < 6) {
              return false
            } else {
              return true
            }
          }
        }).then(({ value }) => {
          passwordReset({
            loginId: item.loginId,
            companyId: item.ascriptionCompanyId,
            password: encryptedData(value)
          }).then(() => {
            this.$message.success('重置成功')
          })
        })
      }
    },
    transChange(type) {
      if (type === 'right') {
        this.transferData.forEach((element, index) => {
          this.leftChecked.forEach(ele => {
            if (element.key === ele) {
              this.rightTransferData.push(element)
              this.transferData.splice(index, 1)
            }
          })
        })
        this.leftChecked = []
      } else {
        this.rightTransferData.forEach((element, index) => {
          this.rightChecked.forEach(ele => {
            if (element.key === ele) {
              this.transferData.push(element)
              this.rightTransferData.splice(index, 1)
            }
          })
        })
        this.rightChecked = []
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .cont-minheight{
    min-height: 740px;
  }
  .bd1{
    border-bottom: 1px solid #ddd;
  }
  .dg-left-ct{
    margin-right: 265px;
  }
  .dg-right-ct{
    float: right;
    width: 250px;
    height: 516px;
  }
  .demo-form-inline{
    .el-input{
      width: 155px;
    }
  }
  .transfer /deep/{
    height: 180px;
    border-top: 1px solid #333;
    .el-transfer-panel{
      border: none;
    }
    .el-checkbox__inner{
      width: 12px;
      height: 12px;
    }
    .el-checkbox__inner::after{
      left: 3px;
      top: 0;
    }
    .el-checkbox__label{
      font-size: 12px;
    }
    .el-checkbox{
      display:block;
    }
  }
</style>
