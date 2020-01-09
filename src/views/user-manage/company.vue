<template>
  <div>
    <div class="w-card search-card">
      <el-form :inline="true" :model="searchFrom" size="small" label-width="72px" class="form-inline">
        <el-form-item label="公司ID">
          <el-input v-model="searchFrom.companyId" placeholder="请输入公司ID" />
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="searchFrom.companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w120" @click="resetFrom">重置</el-button>
          <el-button type="success" class="w120" @click="searchSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-heightAuto class="mt24 p20 w-card">
      <div class="mb20">
        <el-button size="large" class="w140" type="warning" @click="dialogCompany(1)">新增</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          prop="companyId"
          label="公司ID"
        />
        <el-table-column
          align="center"
          prop="companyName"
          label="公司名称"
        />
        <el-table-column align="center" label="logo">
          <template slot-scope="scope">
            <div class="el-image-ct">
              <el-image
                style="max-width: 100%; max-height: 100%"
                :src="scope.row.companyLogoUrl"
                :preview-src-list="scope.row.previewSrcList"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="equipmentNum"
          label="设备数量"
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          :formatter="dateFormat"
        />
        <el-table-column
          align="center"
          label="操作"
          width="450"
        >
          <template slot-scope="scope">
            <img class="img-btn" src="@/assets/chakan.png" title="查看" @click="dialogCompany(2,scope.row)">
            <img class="img-btn" src="@/assets/bianji.png" title="编辑" @click="dialogCompany(3,scope.row)">
            <img class="img-btn" src="@/assets/delete.png" title="删除" @click="deleteCompany(scope.row,scope.$index)">
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
      :visible.sync="dialogVisible"
      :show-close="false"
      width="600px"
    >
      <el-form :inline="true" :model="formInline" :disabled="formInline.disabled" label-position="left" label-width="104px" class="custom-from rel">
        <el-form-item v-if="dialogType!==1" label="公司ID">
          <el-input v-model="formInline.companyId" disabled placeholder="" />
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="formInline.companyName" maxlength="30" placeholder="" />
        </el-form-item>
        <el-form-item label="公司logo" class="custom-logo">
          <el-upload
            class="avatar-uploader"
            action=""
            :http-request="uploadFile"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="formInline.companyLogoUrl" :src="formInline.companyLogoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item :class="{'no-margin':dialogType!==1}" label="超管名称">
          <el-input v-model="formInline.loginId" maxlength="12" placeholder="" />
        </el-form-item>
        <el-form-item v-if="dialogType===1" :class="{'no-margin':dialogType===1}" label="超管登录密码">
          <el-input v-model="formInline.wpassword" type="password" maxlength="18" placeholder="" />
        </el-form-item>
        <div v-if="false" class="mb5">
          <el-checkbox v-model="formInline.checkAll" @change="checkedAll">超管可配置权限</el-checkbox>
        </div>
        <div v-if="false" class="tree-ct">
          <el-tree
            ref="vuetree"
            :data="treeData"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            :props="defaultProps"
            @check="checkCallback"
          />
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer tc">
        <el-button v-if="dialogType!==2" type="danger" class="dialog-btn" @click="addEditSubmit">确定</el-button>
        <el-button type="success" class="dialog-btn" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// addCompany, deleteCompany, modifyCompanyInformation, getCompanyInformation,
import { getCompanyList, uploadImage, deleteCompany, modifyCompanyInformation, addCompany, getFunctionList, getCompanyInformation } from '@/api/user.js'
import { encryptedData } from '@/utils/index'
import moment from 'moment'
export default {
  components: {},
  props: {},
  data() {
    return {
      defaultSearchFrom: {},
      searchFrom: {
        companyId: '',
        companyName: '',
        pageNo: 1, // 当前页
        pageRows: 10, // 每页显示数
        currentSize: 0, // 当前条数
        total: 0 // 总页数
      },
      previewSrcList: [],
      listLoading: false,
      tableData: [{
        data1: ''
      }],
      dialogType: 1,
      dialogVisible: false,
      dialogTitle: '',
      formInline: {
        companyName: '',
        companyLogoUrl: '',
        loginId: '',
        wpassword: '',
        password: '',
        oneLevelFunctionString: '',
        twoLevelFunctionString: '',
        disabled: false,
        checkAll: false
      },
      treeData: [],
      defaultProps: {
        children: 'twoLevelFunctionList',
        label: 'functionName'
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {
    this.searchFrom.pageRows = this.page.pageSize
    this.defaultSearchFrom = Object.assign({}, this.searchFrom)
    this.searchSubmit()
    this.getFunctionList()
    this.$root.enterDown = this.searchSubmit
  },
  methods: {
    dateFormat(row, column) {
      var date = row[column.property]
      if (!date) { return '' }
      return moment(date, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
    },
    checkedAll(val) {
      if (val) {
        // 全选
        this.$refs.vuetree.setCheckedNodes(this.treeData)
      } else {
        // 取消选中
        this.$refs.vuetree.setCheckedKeys([])
      }
    },
    checkCallback(checkobj) {
      // console.log(this.$refs.vuetree.getCheckedKeys(false))
      // if (this.$refs.vuetree.getCheckedKeys(false).length) {
      //   this.formInline.checkAll = false
      // } else {
      //   this.formInline.checkAll = true  提交121321
      // }
    },
    uploadFile(content) { // 上传文件
      console.log(content)
      const fd = new FormData()
      fd.append('file', content.file)
      uploadImage(fd).then(res => {
        content.onSuccess(res.data.path)
      }).catch((res) => {
        // content.onSuccess(err)
        content.onError(res)
        this.$message.error('上传失败！')
      })
    },
    getFunctionList() {
      // 获取菜单
      getFunctionList().then(res => {
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
        this.treeData = data
      }).catch(err => {
        console.log(err)
      })
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file)
      // this.formInline.companyLogoUrl = URL.createObjectURL(file.raw)
      this.formInline.companyLogoUrl = res
      // this.formInline.companyLogoUrl = process.env.VUE_APP_BASE_IMAGE + res.data.path
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 和png格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    searchSubmit() { // 搜索查询
      if (this.listLoading) {
        return
      }
      this.listLoading = true
      getCompanyList(this.searchFrom)
        .then(res => {
          res.companyList.list.forEach((ele) => {
            // ele.companyLogoUrl = process.env.VUE_APP_BASE_IMAGE + ele.companyLogoUrl
            ele.previewSrcList = [ele.companyLogoUrl]
          })
          this.tableData = res.companyList.list
          this.searchFrom.currentSize = res.companyList.size
          this.searchFrom.total = res.companyList.total
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    dialogCompany(type, item) {
      this.dialogType = type
      this.formInline.disabled = false
      if (type === 1) {
        // 添加公司
        this.formInline = Object.assign(this.formInline, {
          companyName: '',
          companyLogoUrl: '',
          loginId: '',
          wpassword: '',
          password: '',
          checkAll: false
        })
        this.dialogTitle = '新建公司'
        this.$nextTick(() => {
          // this.$refs.vuetree.setCheckedKeys([])
        })
      } else if (type === 3 || type === 2) {
        getCompanyInformation({
          companyId: item.companyId
        }).then((res) => {
          const data = res.companyInformation
          data.loginId = data.adminId
          this.formInline = Object.assign(this.formInline, data)
          var arr = []
          function secheckArr(checkData) {
            checkData.forEach((element) => {
              arr.push(element.functionId)
              if (element.twoLevelFunctionList && element.twoLevelFunctionList.length) {
                secheckArr(element.twoLevelFunctionList)
              }
            })
          }
          secheckArr(this.formInline.superUserFunctionList)
          console.log(arr)
          this.$nextTick(() => {
            // this.$refs.vuetree.setCheckedKeys(arr)
          })
        }).catch(() => {
        })
        this.dialogTitle = '编辑公司'
        if (type === 2) {
          this.formInline.disabled = true
          this.dialogTitle = '查看公司'
        }
      }
      this.dialogVisible = true
    },
    deleteCompany(item, index) { // 删除公司
      this.$confirm('公司删除后其下所有用户将不可用，删除操作不可逆，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCompany({
          companyId: item.companyId
        }).then(() => {
          this.tableData.splice(index, 1)
          this.$message.success('删除成功！')
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    addEditSubmit() { // 编辑公司c
      let actionFuc = addCompany
      if (this.dialogType === 3) {
        actionFuc = modifyCompanyInformation
      }
      if (!this.formInline.companyName) {
        this.$message.warning('请填写公司名称')
        return
      }
      if (!this.formInline.companyLogoUrl) {
        this.$message.warning('请上传公司logo')
        return
      }
      if (!this.formInline.loginId) {
        this.$message.warning('请填写超管名称')
        return
      }
      if (this.dialogType === 2 && this.formInline.wpassword && !this.formInline.password) {
        this.$message.warning('请填写超管登录密码')
        return
      }
      // const checkNode = this.$refs.vuetree.getCheckedNodes().concat(this.$refs.vuetree.getHalfCheckedNodes())
      // if (!checkNode.length) {
      //   this.$message.warning('请选择权限功能')
      //   return
      // }
      // const arr1 = []
      // const arr2 = []
      // checkNode.forEach(ele => {
      //   if (ele.twoLevelFunctionList) {
      //     arr1.push(ele.functionId)
      //   } else {
      //     arr2.push(ele.functionId)
      //   }
      // })
      // this.formInline.oneLevelFunctionString = arr1.join('|') + '|'
      // this.formInline.twoLevelFunctionString = arr2.join('|') + '|'
      if (this.formInline.wpassword) {
        this.formInline.password = encryptedData(this.formInline.wpassword)
      }
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
  .avatar-uploader {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100%;
    width: 173px;
    height: 106px;
    line-height: 100px;
    text-align: center;
    background: rgba(246,246,246,1);
    .avatar-uploader-icon{
      width: 173px;
      height: 106px;
    }
    .avatar{
      max-width: 173px;
      max-height: 106px;
    }
  }
  .el-image-ct{
    max-width: 150px;
    max-height: 150px;
  }
  .tree-ct{
    border:1px solid #ddd;
    padding: 10px;
    height: 300px;
    border-radius: 2px;
    overflow-y: auto;
  }
  .custom-from /deep/{
    .custom-logo{
      position: absolute;
      border: 1px solid #626262;
      top: 0px;
      right: 0px;
      width: 194px;
      height: 152px;
      padding: 10px;
      margin: 0;
      .el-form-item__label{
        line-height: 15px;
        margin-bottom: 10px;
      }
    }
  }
</style>
