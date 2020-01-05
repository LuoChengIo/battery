/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const equipmentManageRouter = {
  path: '/equipment',
  component: Layout,
  redirect: '/equipment/device-list',
  name: 'equipmentManage',
  alwaysShow: true,
  meta: {
    title: '设备管理',
    icon: 'icon_equipment_list'
  },
  children: [
    {
      path: 'device-list',
      component: () => import('@/views/equipment-manage/DeviceList.vue'), // Parent router-view
      name: 'DeviceList',
      meta: { title: '设备列表' }
    },
    {
      path: 'order-issuedt',
      component: () => import('@/views/equipment-manage/OrderIssued.vue'), // Parent router-view
      name: 'OrderIssued',
      meta: { title: '参数配置' }
    }
    // {
    //   path: 'alarm-data',
    //   component: () => import('@/views/equipment-manage/AlarmData.vue'), // Parent router-view
    //   name: 'AlarmData',
    //   meta: { title: '告警数据' }
    // }
  ]
}

export default equipmentManageRouter
