import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * 注意: 子菜单只在路由子菜单时出现。长度> = 1
 *
 * hidden: true                   如果设置为true，项目将不会显示在侧栏中(默认为false)
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果不设置alwaysShow, 当项目有多个子路由时，它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置noRedirect，则不会在面包屑中重定向
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    控制页面角色(可以设置多个角色)
    title: 'title'               名称显示在侧边栏和面包屑(推荐集)
    icon: 'svg-name'             图标显示在侧栏中
    breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中(默认为true)
    activeMenu: '/example/list'  如果设置路径，侧栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基本页
 * 所有角色都可以访问
 * 不需要动态判断权限的路由
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/dept',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Dept',
        component: () => import('@/views/dept/index'),
        meta: { title: '部门管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/menu',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Menu',
        component: () => import('@/views/menu/index'),
        meta: { title: '菜单管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Role',
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'form' }
      },
      {
        path: 'authUser/:roleId',
        hidden: true,
        component: () => import('@/views/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', icon: 'form' }
      }
    ]
  },

  {
    path: '/dict',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Dipt',
        component: () => import('@/views/dict/index'),
        meta: { title: '字典管理', icon: 'form' }
      },
      {
        path: 'type/data/:dictTypeId',
        hidden: true,
        component: (resolve) => require(['@/views/dict/data'], resolve),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
