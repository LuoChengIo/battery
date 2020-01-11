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
              color: '#fff',
              fontSize: 12,
              width: '50px'
            }
          },
          boundaryGap: false,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
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
          backgroundColor: 'rgba(255,255,255,0.05)',
          padding: [20, 20, 20, 20]
        },
        legend: [{ //
          icon: 'circle',
          itemWidth: 14,
          itemHeight: 10,
          itemGap: 12,
          left: 'center',
          bottom: 10,
          textStyle: {
            fontSize: 12,
            color: '#fff'
          }
        }],
        grid: { // 布局
          left: 10,
          right: 50,
          bottom: 50,
          top: 30,
          containLabel: true
        },
        yAxis: {
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: { // 刻度样式
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 12
            }
          },
          splitLine: { // 虚线
            show: false
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
