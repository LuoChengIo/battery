/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const realTimeRouter = {
  path: '/real',
  component: Layout,
  redirect: '/real/time-list',
  name: 'realTime',
  alwaysShow: true,
  meta: {
    title: '实时数据监控',
    functionId: '002',
    icon: 'jk'
  },
  children: [
    {
      path: 'time-list',
      component: () => import('@/views/real-time-list/TimeList.vue'), // Parent router-view
      name: 'TimeList',
      meta: { title: '设备监控', functionId: '002001' }
    },
    {
      path: 'detailed-data',
      component: () => import('@/views/real-time-list/DetailedData.vue'), // Parent router-view
      name: 'DetailedData',
      meta: { title: '详情数据', functionId: '002002' }
    }
  ]
}

export default realTimeRouter
