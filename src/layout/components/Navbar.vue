<template>
  <div class="navbar">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <error-log class="errLog-container right-menu-item hover-effect" />
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img src="~@/assets/head_portrait.png" class="user-avatar vm">
          <span class="vm text-white ">{{ userInfo.username }}</span>
          <i class="el-icon-caret-bottom text-white vm" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span style="display:block;" @click="dialogVisible = true">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="500px"
      append-to-body
    >
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="ruleForm.oldPassword" type="password" auto-complete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="ruleForm.password" type="password" auto-complete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" auto-complete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyPassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { modifyPassword } from '@/api/user.js'
import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
// import { userInfo } from 'os'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'
import { encryptedData } from '@/utils/index'
export default {
  components: {
    Breadcrumb,
    // Hamburger,
    ErrorLog
    // Screenfull,
    // SizeSelect,
    // Search
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      ruleForm: {
        oldPassword: '',
        password: '',
        checkPass: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device', 'userInfo'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    modifyPassword() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          modifyPassword({
            oldPassword: encryptedData(this.ruleForm.oldPassword),
            password: encryptedData(this.ruleForm.password)
          }).then(res => {
            this.dialogVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 100px;
  overflow: hidden;
  position: relative;
  background: $theme;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .logo{
    margin-top: 17px;
    margin-left: 10px;
    display: inline-block;
    height: 28px;
    width: auto;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 100px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      // padding: 0 8px;
      height: 100%;
      font-size: 14px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 24px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 20px;
          height: 20px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          // position: absolute;
          // right: -20px;
          // top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
