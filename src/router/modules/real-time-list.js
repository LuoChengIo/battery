/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const realTimeRouter = {
  path: '/real',
  component: Layout,
  redirect: '/real/time-list',
  name: 'realTime',
  alwaysShow: true,
  meta: {
    title: '实时列表',
    icon: 'icon_time_list'
  },
  children: [
    {
      path: 'time-list',
      component: () => import('@/views/real-time-list/TimeList.vue'), // Parent router-view
      name: 'TimeList',
      meta: { title: '列表信息' }
    },
    {
      path: 'detailed-data',
      component: () => import('@/views/real-time-list/DetailedData.vue'), // Parent router-view
      name: 'DetailedData',
      meta: { title: '详情数据' }
    }
  ]
}

export default realTimeRouter
