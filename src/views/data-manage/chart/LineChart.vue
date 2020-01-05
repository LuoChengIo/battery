<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
// require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })

    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions({ xAxisData, seriesData, formatter } = {}) {
      this.chart.setOption({
        xAxis: {
          data: xAxisData,
          axisLabel: { // 刻度样式
            show: true,
            textStyle: {
              color: '#848E98',
              fontSize: 8
            }
          },
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        tooltip: { // 提示框
          trigger: 'axis',
          formatter: formatter,
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          },
          backgroundColor: 'rgba(0,28,55,0.75)',
          padding: [20, 60, 20, 20]
        },
        legend: [{ //
          icon: 'circle',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          left: 'center',
          bottom: 10,
          textStyle: {
            fontSize: 10,
            color: '#848E98'
          }
        }],
        grid: { // 布局
          left: 10,
          right: 10,
          bottom: 50,
          top: 30,
          containLabel: true
        },
        yAxis: {
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: { // 虚线
            lineStyle: {
              type: 'dashed',
              color: '#DCDCDC'
            }
          }
        },
        series: seriesData
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    }
  }
}
</script>
