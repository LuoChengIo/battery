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
      default: '280px'
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
    setOptions(rData) {
      const legendArr = []
      let allCount = 0
      const data = []
      rData.forEach(element => {
        data.push(Object.assign({}, element))
        allCount += element.value
      })
      let nums = 0
      data.forEach((element, index) => {
        let num = 0
        if (allCount) {
          num = Math.round(element.value / allCount * 10000) / 100.00
          if (index === data.length - 1) {
            num = 100 - nums
          }
          nums += num
        }
        element.name = `${element.name} ${num}%`
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
          text: '数量',
          x: '31%',
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
          itemGap: 10,
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
            center: ['35%', '50%'],
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
            name: '数量',
            type: 'pie',
            clockWise: true,
            radius: ['50%', '60%'],
            center: ['35%', '50%'],
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
