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
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00'],
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
          formatter: '{b}<br />{a0}: {c0}A<br />{a1}: {c1}C',
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
          padding: [20, 60, 20, 20]
        },
        legend: [{ //
          icon: 'circle',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['电流', '电压'],
          left: 'center',
          bottom: 10,
          textStyle: {
            fontSize: 10,
            color: '#848E98'
          }
        }, {
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['充电', '放电', '关机'],
          left: 10,
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

        series: [{
          name: '电流', itemStyle: {
            normal: {
              color: '#29C03E',
              lineStyle: {
                color: '#29C03E',
                width: 1
              }
            }
          },
          symbol: 'none',
          smooth: false,
          type: 'line',
          data: expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '电压',
          symbol: 'none',
          smooth: false,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#FFC12F',
              lineStyle: {
                color: '#FFC12F',
                width: 1
              }
            }
          },
          data: actualData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '充电',
          symbol: 'none',
          smooth: false,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#F37272',
              lineStyle: {
                color: '#F37272',
                width: 6
              }
            }
          },
          data: [['9:00', '0'],
            ['9:30', '0'],
            ['10:00', '0']
          ],
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '放电',
          symbol: 'none',
          smooth: false,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3FAFFF',
              lineStyle: {
                color: '#3FAFFF',
                width: 6
              }
            }
          },
          data: [['10:00', '0'],
            ['10:30', '0'],
            ['11:00', '0']
          ],
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '关机',
          symbol: 'none',
          smooth: false,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3C4F63',
              lineStyle: {
                color: '#3C4F63',
                width: 6
              }
            }
          },
          data: [['11:00', '0'],
            ['11:30', '0'],
            ['12:00', '0']
          ],
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    }
  }
}
</script>
