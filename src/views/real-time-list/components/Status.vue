<template>
  <div>
    <!-- 状态信息 -->
    <div class="left-ct l">
      <div class="w-card p10">
        <h5 class="f14 n title">状态信息</h5>
        <ul class="status-list clearfix">
          <li v-for="(item,index) in statusData" :key="index" :class="{'active':item.active}" class="float-two">{{ item.text }}</li>
        </ul>
      </div>
      <!-- 故障信息 -->
      <div class="w-card p10 mt10">
        <h5 class="f14 n title">故障信息</h5>
        <el-row class="malfunction">
          <el-col :span="8">
            <p class="f13 mb12 text-secondary">设备故障等级</p>
            <div class="f14 mt10 text-primary">{{ equipmenstatusPo.failureName }}</div>
          </el-col>
          <el-col :span="8">
            <p class="f13 mb12 text-secondary">设备状态</p>
            <div class="f14 mt10 text-primary">{{ equipmenstatusPo.statusName }}</div>
          </el-col>
          <el-col :span="8">
            <p class="f13 mb12 text-secondary">状态功能码</p>
            <div class="f14 mt10 text-primary">{{ equipmenstatusPo.statusCode }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="right-ct">
      <div class="w-card p10 pb20">
        <h5 class="f14 n title">数据信息</h5>
        <div class="mt20 mb10">
          <div class="dib f13 text-secondary ml10">电池簇编号:<span class="ml10 text-primary">{{ equipmenstatusPo.batchNo }}</span></div>
          <div class="dib f13 text-secondary ml60">电池箱数量:<span class="ml10 text-primary">{{ equipmenstatusPo.batteryNumber }}</span></div>
          <div class="dib f13 text-secondary ml60">信息采集时间:<span class="ml10 text-primary">{{ equipmenstatusPo.collectionTime }}</span></div>
        </div>
        <div class="pl10 pr10">
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="gray-card">
                <p class="f13 text-secondary mb10">系统电压</p>
                <div class="f18 text-primary">{{ equipmenstatusPo.sysVoltage }} V</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="gray-card">
                <p class="f13 text-secondary mb10">系统电流</p>
                <div class="f18 text-primary">{{ equipmenstatusPo.sysProbe }}  A</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="gray-card">
                <p class="f13 text-secondary mb10">系统绝缘电阻</p>
                <div class="f18 text-primary">{{ equipmenstatusPo.sysResistance }}  κΩ</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="mt10" :gutter="10">
            <el-col :span="8">
              <div class="gray-card">
                <p class="f13 text-secondary mb10">电池包正极对地绝缘电阻</p>
                <div class="f18 text-primary">{{ equipmenstatusPo.batteryPositiveResistance }}  κΩ</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="gray-card">
                <p class="f13 text-secondary mb10">电池包负极对地绝缘电阻</p>
                <div class="f18 text-primary">{{ equipmenstatusPo.batteryNegativeResistance }}  κΩ</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="gray-card">
                <p class="f13 text-secondary mb10">SOC</p>
                <div class="f18 text-primary">{{ equipmenstatusPo.soc }} %</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="mt10" :gutter="10">
            <el-col :span="8">
              <div class="gray-card">
                <p class="f13 text-secondary mb10">总充电次数</p>
                <div class="f18 text-primary">{{ equipmenstatusPo.chargeNumber }} </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="gray-card">
                <p class="f13 text-secondary mb10">总充电功率</p>
                <div class="f18 text-primary">{{ equipmenstatusPo.charge }}  κΩ</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="gray-card">
                <p class="f13 text-secondary mb10">总放电功率</p>
                <div class="f18 text-primary">{{ equipmenstatusPo.discharge }}  KW</div>
              </div>
            </el-col>
          </el-row>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  components: {},
  props: {
    pageData: {
      type: Object,
      default: function() {
        return { }
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    statusData() {
      const statusData = [
        { id: 'relayStatus1', text: '总负继电器状态', active: false },
        { id: 'relayStatus0', text: '总正继电器状态', active: false },
        { id: 'relayStatus7', text: '预充继电器状态', active: false },
        { id: 'relayStatus6', text: '加热正继电器状态', active: false },
        { id: 'relayStatus5', text: '放电负继电器状态', active: false },
        { id: 'relayStatus4', text: '放电正继电器状态', active: false },
        { id: 'relayStatus3', text: '充电负继电器状态', active: false },
        { id: 'relayStatus2', text: '充电正继电器状态', active: false }
      ]
      statusData.forEach(item => {
        if (this.equipmenstatusPo[item.id] !== '0') {
          item.active = true
        }
      })
      return statusData
    },
    equipmenstatusPo() {
      const equipmenstatusPo = Object.assign({}, this.pageData.equipmenstatusPo)
      equipmenstatusPo.collectionTime = moment(equipmenstatusPo.collectionTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
      return equipmenstatusPo
    }
  },
  watch: {},
  mounted() {},
  created() {
    console.log(this.pageData)
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.left-ct{
  width: 443px;
}
.right-ct{
  margin-left: 453px;
}
.title{
  position: relative;
  color:#001C37;
  padding-left: 8px;
  &::after{
    content: '';
    position:absolute;
    left: 0;
    top: 4px;
    width:2px;
    height: 12px;
    background:rgba(39,141,236,1);
    border-radius:2px;
  }
}
.status-list{
  margin-top: 30px;
  margin-bottom: 35px;
  li{
    position: relative;
    line-height: 18px;
    padding: 0 35px 0 33px;
    margin-bottom: 15px;
    font-size: 13px;
    color: #848E98;
    &::after{
        content: '';
        position: absolute;
        top: 0;
        right: 17px;
        width:16px;
        height:16px;
        background:url('~@/assets/icon_relay_state_disabled@2x.png') no-repeat center;
        background-size: cover;
      }
    &::before{
      content: '';
      position: absolute;
      top: 50%;
      left: 17px;
      transform: translateY(-50%);
      width:6px;
      height:6px;
      border-radius: 6px;
      background:rgba(39,141,236,1);
    }
    &.active{
      color: #001C37;

      &::after{
        background-image: url('~@/assets/icon_relay_state_regular@2x.png')
      }
    }
  }
}
.malfunction{
  margin: 60px 0 92px 20px;
}
.ml60{
  margin-left: 60px;
}
.gray-card{
  padding: 32px 15px 33px 15px;
  background:rgba(243,243,243,1);
  border-radius:8px;
}
</style>
