<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import moment from 'moment'
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
      type: Array,
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
    setOptions(data) {
      const xAxisData = []
      const seriesData = {
        data1: [],
        data2: [],
        data3: [],
        data4: []
      }
      data.forEach(element => {
        if (element.staticsDate) {
          xAxisData.push(moment(element.staticsDate, 'YYYYMMDDHH').format('MM/DD'))
          seriesData.data1.push(element.alarmLevel1 || 0)
          seriesData.data2.push(element.alarmLevel2 || 0)
          seriesData.data3.push(element.alarmLevel3 || 0)
          seriesData.data4.push(element.normalNum || 0)
        }
      })
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
          // formatter: '{b}<br />{a0}: {c0}A<br />{a1}: {c1}C',
          // formatter: function(params) {
          //   var html = '';
          //   for (var i = 0; i < params.length; i++){
          //       html += ""+params[i].axisValue+"<br />"+params[i].marker+params[i].seriesName+": "+params[i].value+unit(params[i].seriesIndex)+"<br/>";
          //   }
          //   console.log(params)
          //   return html
          //   },
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          },
          backgroundColor: 'rgba(0,28,55,0.75)',
          padding: 10
        },
        legend: {
          left: 'center',
          bottom: 10,
          itemGap: 10,
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            fontSize: 10,
            color: '#848E98'
          }
        },
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
        series: [{
          name: '一级警告', itemStyle: {
            normal: {
              color: '#FA2121',
              lineStyle: {
                color: '#FA2121',
                width: 1
              }
            }
          },
          symbol: 'none',
          smooth: false,
          type: 'line',
          data: seriesData.data1,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '二级警告', itemStyle: {
            normal: {
              color: '#FF832F',
              lineStyle: {
                color: '#FF832F',
                width: 1
              }
            }
          },
          symbol: 'none',
          smooth: false,
          type: 'line',
          data: seriesData.data2,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }, {
          name: '三级警告', itemStyle: {
            normal: {
              color: '#FFC12F',
              lineStyle: {
                color: '#FFC12F',
                width: 1
              }
            }
          },
          symbol: 'none',
          smooth: false,
          type: 'line',
          data: seriesData.data3,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '正常', itemStyle: {
            normal: {
              color: '#3FAFFF',
              lineStyle: {
                color: '#3FAFFF',
                width: 1
              }
            }
          },
          symbol: 'none',
          smooth: false,
          type: 'line',
          data: seriesData.data4,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    }
  }
}
</script>
