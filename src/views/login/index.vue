<!-- 登录页面 -->
<template>
  <div class="rel hp100 bg-color">
    <div class="header">
      <div class="hd-ct">
        <img class="logo dib vm" src="~@/assets/logo.png" alt="" srcset="">
        <span class="dib vm csd">电池监控系统</span>
      </div>
    </div>
    <div class="login-bg" />
    <div class="login-box clearfix">
      <div class="l hp100 bg-white right-ct">
        <h2 class="f30 n text-dark login-tie">欢迎登录</h2>
        <el-form ref="loginForm" label-position="top" label-suffix=":" :model="loginForm" class="ruleForm">
          <el-form-item class="mb30">
            <el-input ref="loginId" v-model="loginForm.loginId" type="text" placeholder="请输入登录账户" maxlength="12">
              <img slot="prefix" class="vm" src="~@/assets/login/person.png" alt="" srcset="">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input ref="password" v-model="loginForm.password" type="password" placeholder="请输入密码" maxlength="18">
              <img slot="prefix" class="vm" src="~@/assets/login/lock.png" alt="" srcset="">
            </el-input>
          </el-form-item>
          <div class="text-danger f12" style="height:20px">{{ errorTip }}</div>
          <el-form-item>
            <el-button type="primary" class="pct100" round :loading="loading" @click="submitForm">登录</el-button>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="checked">记住我</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { baseImgURL, encryptedData } from '@/utils/index'
import { validUsername } from '@/utils/validate'
import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'
export default {
  data() {
    return {
      checked: false,
      loginForm: {
        loginId: '', // 用户名
        password: ''// 密码
        // captcha: '', // 验证码
        // uid: 0 // 验证码id
      },
      errorTip: '',
      loading: false,
      codeRandom: new Date().getTime(),
      redirect: undefined,
      otherQuery: {}
    }
  },
  computed: {
    getCode() {
      return baseImgURL + '/captcha.jpg?uid=' + this.codeRandom
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // 在页面加载时从cookie获取登录信息
    const loginId = Cookies.get('loginId')
    const password = Base64.decode(Cookies.get('password') || '')
    // 如果存在赋值给表单，并且将记住密码勾选
    if (loginId) {
      this.loginForm.loginId = loginId
      this.loginForm.password = password
      this.checked = true
    }
  },
  mounted() {
    if (this.loginForm.loginId === '') {
      this.$refs.loginId.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    // 储存表单信息
    setUserInfo() {
      // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
      // 如果没有勾选，储存的信息为空
      if (this.checked) {
        // 忘记密码保存30天
        Cookies.set('loginId', this.loginForm.loginId, { expires: 30 })
        // base64加密密码
        const password = Base64.encode(this.loginForm.password)
        Cookies.set('password', password, { expires: 30 })
      } else {
        Cookies.remove('loginId')
        Cookies.remove('password')
      }
    },
    refreshCode() { // 刷新验证码
      this.codeRandom = new Date().getTime()
    },
    submitForm(formName) { // 提交验证
      this.errorTip = ''
      if (!this.loginForm.loginId) {
        this.errorTip = '请填写您的用户名~'
        return
      }
      if (!validUsername(this.loginForm.loginId)) {
        this.errorTip = '请填写正确的用户名~'
        return
      }
      if (!this.loginForm.password) {
        this.errorTip = '请填写您的密码~'
        return
      }
      // if (!this.loginForm.captcha) {
      //   this.errorTip = '请填写验证码~'
      //   return
      // }
      if (this.loading) {
        return
      }
      // this.loginForm.uid = this.codeRandom
      this.loading = true

      this.$store.dispatch('user/login', {
        loginId: this.loginForm.loginId, // 用户名
        password: encryptedData(this.loginForm.password) // 密码
      }).then(() => {
        // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        this.$router.push({ path: '/', query: this.otherQuery })
        this.loading = false
        this.setUserInfo()
      }).catch((err) => {
        console.log('err', err)
        // this.$message.error(err.message)
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .header{
    height: 100px;
    background-color: #fff;
    line-height: 100px;
    .hd-ct{
      margin-left: 14%;
    }
    .logo{
        margin-right: 20px;
        display: inline-block;
        height: 60px;
        width: auto;
        line-height: 60px;
    }
    .csd{
      font-size:24px;
      line-height: 60px;
      color: #333;
    }
  }
  .bg-color{
    background:linear-gradient(90deg,rgba(25,38,166,1) 0%,rgba(6,17,123,1) 100%);
  }
  .login-bg{
    position:absolute;
    top: 100px;
    left: 0;
    right: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-size: auto;
    background-attachment:fixed;
    background-image: url('~@/assets/login/illustrater.png');
    background-position: 83% 55.5%;
  }
 .login-box{
   position: absolute;
   top: 50%;
   left: 14%;
  width:340px;
  height:360px;
  background:rgba(255,255,255,1);
    border-radius:4px;
   margin-top: -180px;
   overflow: hidden;
   z-index: 10;
   box-shadow: 0px 0px 30px 4px rgba(0, 0, 0, 0.1);
 }
 .right-ct{
   width: 100%;
   padding: 40px 42px 0 42px;
  }
 .login-tie{
   font-size: 18px;
   text-align: center;
   margin-bottom: 40px;
 }
  .ruleForm /deep/{
    .el-form-item{
      margin-bottom: 10px;
    }
    .mb30{
      margin-bottom: 30px;
    }
    label{
      font-size: 12px;
      font-weight: normal;
      line-height: 16px;
    }
    .el-input--medium .el-input__inner{
      border-color: #a0a0a0;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
    }
    .el-input__prefix{
      line-height: 40px;
    }
    .el-checkbox__inner{
      border-color: #a0a0a0;
    }
    .el-checkbox__input.is-checked+.el-checkbox__label{
      color: #1827a4;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner{
      background-color: #1827a4;
    }
  }
  .captcha{
    float: right;
    display: inline-block;
    background-color: #fff;
    width: 83px;
    margin-top: 4px;
    margin-left: 15px;
    height: 32px;
    border-radius: 3px;
    img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
 .bg-white{
   background-color: #fff;
 }
 .el-button--primary{
   background:#1827a4;
   border-color:#1827a4;
   font-size: 16px;
   padding: 11px 20px;
 }
</style>
