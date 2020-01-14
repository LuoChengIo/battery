<template>
  <div class="p24 cos">
    <el-row :gutter="20" class="panel-group">
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel bg-item bg-item1" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-description">
            <count-to :start-val="0" :end-val="numobj.equipmentCounts" :duration="2600" class="card-panel-num" />
            <div class="card-panel-text">
              总设备总数（个）
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel bg-item bg-item2" @click="handleSetLineChartData('messages')">
          <div class="card-panel-description">
            <count-to :start-val="0" :end-val="numobj.disChargeSum" :duration="3000" class="card-panel-num" />
            <div class="card-panel-text">
              总放电功率(W)
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel bg-item bg-item3" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-description">
            <count-to :start-val="0" :end-val="numobj.chargeSum" :duration="3200" class="card-panel-num" />
            <div class="card-panel-text">
              总充电功率(W)
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel bg-item bg-item4" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-description">
            <count-to :start-val="0" :end-val="numobj.carbonReduction" :duration="3600" class="card-panel-num" />
            <div class="card-panel-text">
              减少二氧化碳排放量(L)
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    numobj: {
      type: Object,
      default: function() {
        return {
          equipmentCounts: 0,
          disChargeSum: 0,
          chargeSum: 0,
          carbonReduction: 0
        }
      }
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.cos{
  background-color: #282c35;
}
.panel-group {
  .bg-item{
    background-color: #353841;
    background-position: right 20px center;
    background-repeat: no-repeat;
  }
  .bg-item1{
    background-image: url('~@/assets/1-01.png');
  }
  .bg-item2{
    background-image: url('~@/assets/1-02.png');
  }
  .bg-item3{
    background-image: url('~@/assets/1-03.png');
  }
  .bg-item4{
    background-image: url('~@/assets/1-04.png');
  }
  .card-panel {
    height: 140px;;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #fff;
    border-radius:4px;
    border:2px solid rgba(255,255,255,.2);
    // background: #fff;
    // box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    // border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: right;
      margin: 28px 18px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: right;
      font-size: 48px;
    }

    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 10px 0 0 25px;
      .card-panel-text {
        line-height: 20px;
        font-size: 20px;
        margin-top: 30px ;
        color: #89D0FC;
        font-weight: normal;
      }

      .card-panel-num {
        font-size: 36px;
        color: rgb(158,204,253);
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
