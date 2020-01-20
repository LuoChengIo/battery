/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const userRouter = {
  path: '/personal',
  component: Layout,
  redirect: '/personal/day-statistics',
  name: 'userManage',
  meta: {
    title: '系统管理',
    icon: 'systern',
    functionId: '005'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/user-manage/user.vue'), // Parent router-view
      name: 'User',
      meta: { title: '用户管理', functionId: '005001' }
    },
    {
      path: 'character',
      component: () => import('@/views/user-manage/character.vue'), // Parent router-view
      name: 'Character',
      meta: { title: '角色管理', functionId: '005002' }
    },
    {
      path: 'company',
      component: () => import('@/views/user-manage/company.vue'), // Parent router-view
      name: 'Company',
      meta: { title: '公司管理', functionId: '005003' }
    },
    {
      path: '/program-management',
      component: () => import('@/views/program-management/page'), // Parent router-view
      name: 'PagePermission',
      meta: { title: '程序管理', functionId: '005004' }
    }
  ]
}

export default userRouter
