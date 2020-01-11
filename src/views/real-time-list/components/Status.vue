<template>
  <div class="details-card">
    <div class="title-h tr bd1">
      <img class="vm" src="~@/assets/detailed-data/00-01.png" alt="" srcset="">
      <span>状态数据</span>
    </div>
    <!-- 状态信息 -->
    <div class="bd1">
      <h5 class="f18 n text-white mt5">
        <img class="vm" src="~@/assets/detailed-data/01.png" alt="" srcset="">
        <span class="vm">状态信息</span>
      </h5>
      <div class="status-info-ct pb15">
        <div v-for="(item,index) in statusData" :key="index" class="status-info-item " :class="{'active':item.active}">{{ item.text }}</div>
      </div>
    </div>
    <!-- 故障信息 -->
    <div class="bd1">
      <h5 class="f18 n text-white mt5">
        <img class="vm" src="~@/assets/detailed-data/02.png" alt="" srcset="">
        <span class="vm">故障信息</span>
      </h5>
      <div class="malfunction">
        <div class="malfunction-item item1">
          <p class="f14 text-white tl">设备故障等级</p>
          <div class="f18 mt10">{{ equipmenstatusPo.failureName }}</div>
        </div>
        <div class="malfunction-item item2">
          <p class="f14 text-white tl">设备状态</p>
          <div class="f18 mt10">{{ equipmenstatusPo.statusName }}</div>
        </div>
        <div class="malfunction-item item3">
          <p class="f14 text-white tl">状态功能码</p>
          <div class="f18 mt10">{{ equipmenstatusPo.statusCode }}</div>
        </div>
      </div>
    </div>
    <!-- 数据信息 -->
    <div>
      <h5 class="f18 n text-white mt5">
        <img class="vm" src="~@/assets/detailed-data/03.png" alt="" srcset="">
        <span class="vm">数据信息</span>
        <div class="r text-white">
          <div class="dib f12 mr20">电池簇编号:<span class="ml5">{{ equipmenstatusPo.batchNo }}</span></div>
          <div class="dib f12 mr20">电池箱数量:<span class="ml5">{{ equipmenstatusPo.batteryNumber }}</span></div>
          <div class="dib f12 mr20">信息采集时间:<span class="ml5">{{ equipmenstatusPo.collectionTime }}</span></div>
        </div>
      </h5>
      <div class="pl24 pr24 pt15 text-white">
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="gray-card g1">
              <p class="f14  mb10">系统电压</p>
              <div class="f24 ">{{ equipmenstatusPo.sysVoltage }} V</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="gray-card g2">
              <p class="f14  mb10">系统电流</p>
              <div class="f24 ">{{ equipmenstatusPo.sysProbe }}  A</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="gray-card g3">
              <p class="f14  mb10">系统绝缘电阻</p>
              <div class="f24 ">{{ equipmenstatusPo.sysResistance }}  κΩ</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="gray-card g3">
              <p class="f14  mb10 ell">电池包正极对地绝缘电阻</p>
              <div class="f24 ">{{ equipmenstatusPo.batteryPositiveResistance }}  κΩ</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="mt24" :gutter="24">
          <el-col :span="6">
            <div class="gray-card g3">
              <p class="f14  mb10 ell">电池包负极对地绝缘电阻</p>
              <div class="f24 ">{{ equipmenstatusPo.batteryNegativeResistance }}  κΩ</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="gray-card g4">
              <p class="f14  mb10">SOC</p>
              <div class="f24 ">{{ equipmenstatusPo.soc }} %</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="gray-card g5">
              <p class="f14  mb10">总充电次数</p>
              <div class="f24 ">{{ equipmenstatusPo.chargeNumber }} </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="gray-card g6">
              <p class="f14  mb10">总充电功率</p>
              <div class="f24 ">{{ equipmenstatusPo.charge }}  κΩ</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="mt24" :gutter="24">
          <el-col :span="6">
            <div class="gray-card g7">
              <p class="f14  mb10">总放电功率</p>
              <div class="f24 ">{{ equipmenstatusPo.discharge }}  KW</div>
            </div>
          </el-col>
        </el-row>
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
  margin: 20px 0 26px 0;
  text-align: center;
  .malfunction-item{
    display:inline-block;
    padding-left: 27px;
    position: relative;
    margin: 0 50px;
    &::before{
      content: '';
      position: absolute;
      top: 5px;
      left: 0;
      width: 10px;
      height: 10px;
      border-radius: 100%;
    }
    &.item1{
      color: #E75050;
      &::before{
        background-color: #E75050;
      }
    }
    &.item2{
      color: #FB9A4C;
      &::before{
        background-color: #FB9A4C;
      }
    }
    &.item3{
      color: #4C44F1;
      &::before{
        background-color: #4C44F1;
      }
    }
  }
}
.ml60{
  margin-left: 60px;
}
.gray-card{
  padding: 15px 0 15px 75px;
  background:rgba(48,52,61,1);
  border-radius:4px;
  background-position: 20px center;
  background-repeat: no-repeat;
  &.g1{
    background-image:url('~@/assets/detailed-data/sj-01.png')
  }
  &.g2{
    background-image:url('~@/assets/detailed-data/sj-02.png')
  }
  &.g3{
    background-image:url('~@/assets/detailed-data/sj-03.png')
  }
  &.g4{
    background-image:url('~@/assets/detailed-data/sj-04.png')
  }
  &.g5{
    background-image:url('~@/assets/detailed-data/sj-05.png')
  }
  &.g6{
    background-image:url('~@/assets/detailed-data/sj-06.png')
  }
  &.g7{
    background-image:url('~@/assets/detailed-data/sj-07.png')
  }
}
.status-info-ct{
  max-width: 822px;
  margin: 0 auto;
}
.status-info-item{
  position: relative;
  display: inline-block;
  min-width: 175px;
  margin: 15px;
  line-height: 18px;
  padding-right: 55px;
  color: #fff;
  background: url('~@/assets/detailed-data/close.png') no-repeat center right;
  &::after{
    content: '关';
    position: absolute;
    top: 0px;
    line-height: 18px;
    right: 8px;
    font-size: 12px;
    color: #fff;
  }
  &.active{
    background-image: url('~@/assets/detailed-data/open.png');
    &::after{
      content: '开';
      right: 23px;
    }
  }
}
</style>
