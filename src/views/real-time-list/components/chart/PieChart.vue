<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
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
      default: '300px'
    },
    chartData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
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
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions(data) {
      const legendArr = []
      data.forEach(element => {
        legendArr.push(element.name)
      })
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: function(parms) {
            var str = parms.seriesName + '</br>' + parms.marker + '' + parms.data.legendname + '：' + parms.data.value + '(' + parms.percent + '%)'
            return str
          }
        },
        title: {
          text: '时间',
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 17,
            fontWeight: 'normal',
            color: '#848E98'
          }
        },
        legend: {
          right: '6%',
          orient: 'vertical',
          bottom: 'center',
          itemGap: 20,
          itemWidth: 13,
          itemHeight: 13,
          textStyle: {
            fontSize: 13,
            color: '#848E98'
          },
          data: legendArr
        },
        series: [
          {
            name: 'center',
            type: 'pie',
            hoverAnimation: false,
            radius: [0, '30%'],
            tooltip: {
              show: false
            },
            itemStyle: {
              normal: {
                color: '#FFF',
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            data: [
              { value: 100, name: 'center' }
            ]
          },
          {
            name: '时间',
            type: 'pie',
            clockWise: true,
            radius: ['50%', '60%'],
            hoverAnimation: false,
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            data: data,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
