<template>
  <el-row :gutter="0" class="panel-group">
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel bg-item" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="numobj.equipmentCounts" :duration="2600" class="card-panel-num" />
          <div class="card-panel-text">
            总设备总数（个）
          </div>
        </div>
        <div class="card-panel-icon-wrapper icon-people">
          <img src="../../../../assets/1-01.png">
        </div>
      </div>
    </el-col>
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel bg-item" @click="handleSetLineChartData('messages')">
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="numobj.disChargeSum" :duration="3000" class="card-panel-num" />
          <div class="card-panel-text">
            总放电功率(W)
          </div>
        </div>
        <div class="card-panel-icon-wrapper icon-people">
          <img src="../../../../assets/1-02.png">
        </div>
      </div>
    </el-col>
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel bg-item" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="numobj.chargeSum" :duration="3200" class="card-panel-num" />
          <div class="card-panel-text">
            总充电功率(W)
          </div>
        </div>
        <div class="card-panel-icon-wrapper icon-people">
          <img src="../../../../assets/1-03.png">
        </div>
      </div>
    </el-col>
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel bg-item" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="numobj.carbonReduction" :duration="3600" class="card-panel-num" />
          <div class="card-panel-text">
            减少二氧化碳排放量(L)
          </div>
        </div>
        <div class="card-panel-icon-wrapper icon-people">
          <img src="../../../../assets/1-04.png">
        </div>
      </div>
    </el-col>
  </el-row>
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
.panel-group {
  background-color: #282c35;
   height: 190px;
  .card-panel-col {
    width: 22.32%;
    height: 140px;
    margin: 22px;
    border-radius:4px;
  }
  .bg-item{
    background-color: #353841;
  }
  .bg-item1{
    background-image: url('../../../../assets/program-management/bg_home_sum01@2x.png');
    background-size: 100% 100%;
  }
  .bg-item2{
    background-image: url('../../../../assets/program-management/bg_home_sum02@2x.png');
    background-size: 100% 100%;
  }
  .bg-item3{
    background-image: url('../../../../assets/program-management/bg_home_sum03@2x.png');
    background-size: 100% 100%;
  }
  .bg-item4{
    background-image: url('../../../../assets/program-management/bg_home_sum04@2x.png');
    background-size: 100% 100%;
  }
  .card-panel {
    height: 140px;;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #fff;
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
      margin: 19px;
      margin-left: 25px;
      .card-panel-text {
        line-height: 20px;
        color: #fff;
        font-size: 18px;
        margin: 25px 0px;
        color: rgb(158,204,253);

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
