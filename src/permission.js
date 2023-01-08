import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 路由白名单

router.beforeEach(async(to, from, next) => {
  // 路由跳转前置钩子函数
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
        NProgress.done()
      } else {
        if (store.getters.roles.length === 0) {
          store.dispatch('GetInfo').then(() => {
          })
        }
        // await store.dispatch('user/getInfo')
        next()
        NProgress.done()
        // try {
        //   await store.dispatch('user/getInfo')
        //   next()
        // } catch (error) {
        //   store.dispatch('user/logout').then(() => {
        //     // Message.error({
        //     //   message: error || 'Has Error'
        //     // })
        //     next({ path: '/' })
        //   })
        //   NProgress.done()
        // }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
