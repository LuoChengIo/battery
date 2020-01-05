<template>
  <div>
    <div class="w-card search-card">
      <el-form :inline="true" :model="searchFrom" label-width="72px" class="form-inline">
        <el-form-item label="角色ID">
          <el-input v-model="searchFrom.roleId" placeholder="请输入角色ID" />
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="searchFrom.roleName" placeholder="请输入角色名称" />
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
        <el-form-item>
          <el-button type="primary" @click="resetFrom">重置</el-button>
          <el-button type="success" @click="searchSubmit">搜索</el-button>
          <el-button type="success" icon="el-icon-plus" @click="dialogAddEdit(1)">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mt20">
      <el-row :gutter="20">
        <el-col :span="18">
          <div v-heightAuto class="w-card pb20">
            <el-table
              v-loading="listLoading"
              :data="tableData"
              border
              style="width: 100%"
              @row-click="rowClick"
            >
              <el-table-column
                align="center"
                prop="roleId"
                label="角色ID"
              />
              <el-table-column
                align="center"
                prop="roleName"
                label="角色名称"
              />
              <el-table-column
                align="center"
                prop="ascriptionCompanyName"
                label="所属公司"
              />
              <el-table-column
                align="center"
                prop="createTime"
                :formatter="dateFormat"
                label="创建时间"
              />
              <el-table-column
                align="center"
                label="操作"
                width="250"
              >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click.stop="dialogAddEdit(2,scope.row)">编辑</el-button>
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
          </div></el-col>
        <el-col :span="6">
          <div v-heightAuto v-loading="treeLoading" class="w-card p20">
            <h4 class="n pb10 f14 ell" :title="activeRowTItle">角色权限列表【{{ activeRowTItle }}】</h4>
            <el-tree :data="treeData" :default-expand-all="true" :props="defaultProps" />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 弹框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="670px"
    >
      <el-form :inline="true" :model="formInline" :disabled="formInline.disabled" label-width="102px" class="demo-form-inline">
        <el-form-item v-if="dialogType===2" label="角色ID">
          <el-input v-model="formInline.roleId" disabled placeholder="" />
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="formInline.roleName" maxlength="30" placeholder="" />
        </el-form-item>
        <el-form-item label="所属公司">
          <el-autocomplete
            v-model="formInline.ascriptionCompanyName"
            popper-class="my-autocomplete"
            :disabled="dialogType===2?true:false"
            value-key="companyName"
            :fetch-suggestions="querySearch"
            placeholder="请输入所属公司"
            @select="getFunctions"
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
        <div class="mb5">
          <el-checkbox v-model="checkedAll" @change="checkedAllHadle">全选角色权限</el-checkbox>
        </div>
        <div class="tree-ct">
          <el-tree
            ref="vuetree"
            :data="treeDialogData"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            :props="defaultProps"
          />
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addEditSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyList, addRole, modifyRoleInformation, deleteRole, getRoleFunction, getCompanyInformation } from '@/api/user.js'
import moment from 'moment'
export default {
  components: {},
  props: {},
  data() {
    return {
      defaultSearchFrom: {},
      searchFrom: {
        roleId: '',
        roleName: '',
        ascriptionCompanyName: '',
        pageNo: 1, // 当前页
        pageRows: 10, // 每页显示数
        currentSize: 0, // 当前条数
        total: 0 // 总页数
      },
      timeout: null,
      listLoading: false,
      tableData: [],
      dialogType: 1,
      dialogVisible: false,
      dialogTitle: '',
      formInline: {
        roleId: '',
        roleName: '',
        ascriptionCompanyName: '',
        ascriptionCompanyId: '',
        oneLevelFunctionString: '',
        twoLevelFunctionString: '',
        disabled: false,
        checkAll: false
      },
      treeDialogData: [],
      treeData: [],
      activeRowTItle: '',
      defaultProps: {
        children: 'twoLevelFunctionList',
        label: 'functionName'
      },
      checkedAll: false,
      treeLoading: false
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
    checkedAllHadle(val) {
      if (val) {
        // 全选
        this.$refs.vuetree.setCheckedNodes(this.treeDialogData)
      } else {
        // 取消选中
        this.$refs.vuetree.setCheckedKeys([])
      }
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
          // const arr = res.companyList.list.filter((element)=>{
          // })
          cb(res.companyList.list)
        })
        .catch(() => {
          cb(results)
        })
    },
    searchSubmit() { // 搜索查询
      if (this.listLoading) {
        return
      }
      this.listLoading = true
      getRoleList(this.searchFrom)
        .then(res => {
          this.tableData = res.roleList.list
          this.searchFrom.currentSize = res.roleList.size
          this.searchFrom.total = res.roleList.total
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    rowClick(row) {
      if (this.treeLoading) {
        return
      }
      this.treeLoading = true
      this.activeRowTItle = row.roleName
      this.getRoleFunction(row, (res) => {
        const data = res.roleFunctionList
        function dataFor(tree) {
          tree.forEach(element => {
            element.id = element.functionId
            if (element.twoLevelFunctionList && element.twoLevelFunctionList.length) {
              dataFor(element.twoLevelFunctionList)
            }
          })
        }
        dataFor(data)
        this.treeLoading = false
        this.treeData = data
      })
    },
    getRoleFunction(item, callback) {
      // 查询功能列表
      getRoleFunction({
        roleId: item.roleId
      }).then((res) => {
        callback && callback(res)
      }).catch(() => {
      })
    },
    getFunctions(item, callback) {
      this.formInline.ascriptionCompanyId = item.companyId
      // 获取当前公司的权限
      getCompanyInformation({
        companyId: item.companyId
      }).then((res) => {
        const data = res.companyInformation.superUserFunctionList
        data.loginId = data.adminId
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
        callback && callback()
      }).catch(() => {
      })
    },
    dialogAddEdit(type, item) {
      this.dialogType = type
      this.formInline.disabled = false
      this.treeDialogData = []
      this.checkedAll = false
      if (type === 1) {
        // 添加角色
        this.formInline = Object.assign(this.formInline, {
          roleId: '',
          roleName: '',
          ascriptionCompanyName: '',
          ascriptionCompanyId: ''
        })
        this.dialogTitle = '新建角色'
      } else if (type === 2) {
        this.formInline = Object.assign(this.formInline, item)
        this.dialogTitle = '编辑角色'
        this.getFunctions({
          companyId: item.ascriptionCompanyId
        }, () => {
          this.getRoleFunction(item, (res) => {
            const data = res.roleFunctionList
            var arr = []
            function secheckArr(checkData) {
              checkData.forEach((element) => {
                arr.push(element.functionId)
                if (element.twoLevelFunctionList && element.twoLevelFunctionList.length) {
                  secheckArr(element.twoLevelFunctionList)
                }
              })
            }
            secheckArr(data)
            this.$nextTick(() => {
              this.$refs.vuetree.setCheckedKeys(arr)
            })
          })
        })
      }
      this.dialogVisible = true
    },
    dialogDdelete(item, index) { // 删除角色
      this.$confirm('删除后角色将不可用，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({
          roleId: item.roleId
        }).then(() => {
          this.tableData.splice(index, 1)
          this.$message.success('删除成功！')
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    addEditSubmit() { // 编辑角色
      let actionFuc = addRole
      if (this.dialogType === 2) {
        actionFuc = modifyRoleInformation
      }
      if (!this.formInline.roleName) {
        this.$message.warning('请填写角色名称')
        return
      }
      if (!this.formInline.ascriptionCompanyName) {
        this.$message.warning('请填写公司名称')
        return
      }
      const checkNode = this.$refs.vuetree.getCheckedNodes().concat(this.$refs.vuetree.getHalfCheckedNodes())
      if (!checkNode.length) {
        this.$message.warning('请选择权限功能')
        return
      }
      const arr1 = []
      const arr2 = []
      checkNode.forEach(ele => {
        if (ele.twoLevelFunctionList) {
          arr1.push(ele.functionId)
        } else {
          arr2.push(ele.functionId)
        }
      })
      this.formInline.oneLevelFunctionString = arr1.join('|') + '|'
      this.formInline.twoLevelFunctionString = arr2.join('|') + '|'
      actionFuc(this.formInline).then(() => {
        this.$message.success('保存成功！')
        this.dialogVisible = false
        this.searchSubmit()
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
  .tree-ct{
    border:1px solid #ddd;
    padding: 10px;
    height: 300px;
    border-radius: 2px;
    overflow-y: auto;
  }
</style>
