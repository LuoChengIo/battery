<template>
  <el-row :gutter="0" class="panel-group">
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel bg-item1" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            总设备数量（个）
          </div>
          <count-to :start-val="0" :end-val="numobj.equipmentCounts" :duration="2600" class="card-panel-num" />
        </div>
        <!-- <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div> -->
      </div>
    </el-col>
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel bg-item2" @click="handleSetLineChartData('messages')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            总放电功率(W)
          </div>
          <count-to :start-val="0" :end-val="numobj.disChargeSum" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel bg-item3" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            总充电功率(W)
          </div>
          <count-to :start-val="0" :end-val="numobj.chargeSum" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel bg-item4" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            减少二氧化碳排放量(L)
          </div>
          <count-to :start-val="0" :end-val="numobj.carbonReduction" :duration="3600" class="card-panel-num" />
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
  .card-panel-col {
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
    height: 108px;
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
      margin: 14px 0 0 14px;
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
      margin: 26px;
      margin-left: 25px;

      .card-panel-text {
        line-height: 18px;
        color: #fff;
        font-size: 13px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 26px;
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
