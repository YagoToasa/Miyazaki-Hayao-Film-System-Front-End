/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/movie-table',
  name: 'Table',
  meta: {
    title: '电影管理',
    icon: 'table'
  },
  children: [
    {
      path: 'movie-table',
      component: () => import('@/views/table/movie-table'),
      name: 'MovieTable',
      meta: { title: '电影信息管理' }
    },
    {
      path: 'role-table',
      component: () => import('@/views/table/role-table'),
      name: 'RoleTable',
      meta: { title: '角色信息管理' }
    },
    {
      path: 'phrase-table',
      component: () => import('@/views/table/phrase-table'),
      name: 'PhraseTable',
      meta: { title: '台词信息管理' }
    },
    {
      path: 'media-table',
      component: () => import('@/views/table/media-table'),
      name: 'MediaTable',
      meta: { title: '媒体信息管理' }
    },
    {
      path: 'remark-table',
      component: () => import('@/views/table/remark-table'),
      name: 'RemarkTable',
      meta: { title: '评论信息管理' }
    }
  ]
}
export default tableRouter
