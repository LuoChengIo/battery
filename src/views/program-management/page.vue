
<template>
  <div>
    <div class="text-red">上传成功，为Bata版，只推送标记为测试设备；如需推广全部设备，需要手工操作，设置为正式版。</div>
    <div v-heightAuto class="mt24 pb20 w-card">
      <el-table v-loading="listLoading" :data="tableData" border style="width: 100%">
        <el-table-column label="序号" align="center" type="index" width="40" prop="id" />
        <el-table-column align="center" prop="equipmentProgramName" label="程序名称" />
        <el-table-column align="center" prop="equipmentSoftVersion" label="软件版本" />
        <el-table-column align="center" prop="equipmentHardwareVersion" label="硬件版本" />
        <el-table-column align="center" prop="state" label="程序状态" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1">内测版</span>
            <span v-if="scope.row.state == 2">正式版</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="addtime" sortable label="操作时间" :formatter="dateFormat" />
        <el-table-column align="center" prop="data1" label="操作" width="200">
          <template slot-scope="scope">
            <el-upload
              class="upload-demo"
              action=""
              :http-request="(content)=>uploadFile(scope.row,content)"
              :show-file-list="false"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
            >
              <el-button type="primary" size="small">上传</el-button>
            </el-upload>
            <el-button type="success" size="small" :disabled="scope.row.state == 2" @click="releaseVersion(scope.row)">发布正式版</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pt20 pr30 pl30 tr">
        <span
          class="l f13 text-primary"
        >当前显示 {{ searchFrom.currentSize }} 条，共 {{ searchFrom.total }} 条记录</span>
        <el-pagination
          background
          class="dib"
          prev-text="上一页"
          next-text="下一页"
          :current-page="searchFrom.pageNo"
          :page-sizes="page.pageSizes"
          :page-size="searchFrom.pageRows"
          :total="searchFrom.totalPages"
          layout="sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  programList,
  programPublish,
  programUpload
} from '@/api/program-management.js'
import moment from 'moment'
export default {
  components: {},
  props: {},
  data() {
    return {
      defaultSearchFrom: {},
      searchFrom: {
        pageRows: 10, // 每页显示数
        currentSize: 0, // 当前条数
        totalPages: 0, // 总页数
        pageNo: 0 // 页码
      },
      version: ' beta ', // beta-内测版 online-生产版
      listLoading: false,
      tableData: [],
      fileSaveUrl: process.env.VUE_APP_BASE_API + ' /equipment/program/upload ',
      uploadData: {}
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
    searchSubmit() {
      // 搜索查询
      if (this.listLoading) {
        return
      }
      this.listLoading = true
      programList(this.searchFrom)
        .then(res => {
          this.tableData = res.data.list
          this.searchFrom.currentSize = res.data.totalPages
          this.searchFrom.total = res.data.total
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    handleSizeChange(val) {
      // 切换每页显示数
      this.searchFrom.pageNo = 1
      this.searchFrom.pageRows = val
      this.searchSubmit()
    },
    handleCurrentChange(val) {
      // 切换页码
      this.searchFrom.pageNo = val
      this.searchSubmit()
    },
    // 发布版本
    releaseVersion(item) {
      var version = item.state
      if (version === 1) {
        version = 'beta'
      } else {
        version = 'online'
      }
      var data = {
        id: item.id,
        version: version
      }
      programPublish(data)
        .then(res => {
          item.state = 2
          this.$message({
            message: '发布成功',
            type: 'success'
          })
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {})
    },
    // 上传文件之前的钩子
    beforeUpload(file) {
      // 获取最后一个.的位置
      const index = file.name.lastIndexOf('.')
      // 获取后缀
      const ext = file.name.substr(index + 1)
      const ArrType = ['srec', 'xls', 'xlsx', 'doc', 'docx', 'txt']
      if (ArrType.indexOf(ext) > -1) {
        return true
      } else {
        this.$message.error('文件格式不支持')
        return false
      }
    },
    handleSuccess(res, file) {
      this.$message.success('上传成功')
      this.searchSubmit()
    },
    // 上传文件个数超过定义的数量
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`)
    },
    // 上传文件
    uploadFile(item, content) {
      const form = new FormData()
      form.append('multiRequest', content.file)
      form.append('id', item.id)
      programUpload(form).then(res => {
        const data = res.data
        // eslint-disable-next-line eqeqeq
        if (data.code == 1) {
          content.onSuccess(data)
        } else {
          content.onError(data)
          this.$message.error(data.msg)
        }
      }).catch((res) => {
        // content.onSuccess(err)
        console.log(res)
        content.onError(res)
        this.$message.error('上传失败！')
      })
    },
    dateFormat(row, column) {
      var date = row[column.property]

      if (!date) { return '' }

      return moment(date, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
    }
    // 上传参数
    // uploadFile(rowData) {
    //   this.uploadData = {
    //     id: rowData.id
    //   }
    // },
    // // 上传文档格式限制
    // fileLimit(file) {
    //   var fileName = file.name.substring(file.name.lastIndexOf('.') + 1)
    //   const extension = fileName === 'xls'
    //   const extension2 = fileName === 'xlsx'
    //   if (!extension && !extension2) {
    //     this.$message({
    //       message: '上传文件只能是 xls、xlsx格式!',
    //       type: 'warning'
    //     })
    //   }
    // },
    // // 上传成功提示
    // uploadSuccess(res) {
    //   if (res.code === 200) {
    //     this.$message.error('上传成功')
    //     this.searchSubmit()
    //   } else {
    //     this.$message.error(res.message)
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.cont-minheight {
  min-height: 740px;
}
.upload-demo {
  float:left;
  width:50px;
  text-align: center;
  margin-right: 25px;
  display: inline-block;
}
// .el-table .cell{
//   /deep/ .upload-demo{
//     float: left;
//   }
//}
</style>
