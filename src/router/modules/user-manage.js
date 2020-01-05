/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const userRouter = {
  path: '/personal',
  component: Layout,
  redirect: '/personal/day-statistics',
  name: 'userManage',
  meta: {
    title: '系统管理',
    icon: 'icon_systerm_manage'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/user-manage/user.vue'), // Parent router-view
      name: 'User',
      meta: { title: '用户管理' }
    },
    {
      path: 'character',
      component: () => import('@/views/user-manage/character.vue'), // Parent router-view
      name: 'Character',
      meta: { title: '角色管理' }
    },
    {
      path: 'company',
      component: () => import('@/views/user-manage/company.vue'), // Parent router-view
      name: 'Company',
      meta: { title: '公司管理' }
    }
  ]
}

export default userRouter
