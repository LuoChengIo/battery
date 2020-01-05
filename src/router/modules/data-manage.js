/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const dataRouter = {
  path: '/data',
  component: Layout,
  redirect: '/data/day-statistics',
  name: 'dataManage',
  meta: {
    title: '数据管理',
    icon: 'icon_data_manage'
  },
  children: [
    {
      path: 'day-statistics',
      component: () => import('@/views/data-manage/Statistics.vue'), // Parent router-view
      name: 'Statistics',
      meta: { title: '数据统计' }
    },
    {
      path: 'inquire',
      name: 'Inquire',
      component: () => import('@/views/data-manage/Inquire.vue'),
      meta: { title: '数据查询' }
    }
  ]
}

export default dataRouter
