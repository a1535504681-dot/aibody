import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useNProgress } from '@vueuse/integrations/useNProgress';
import { createRouter, createWebHistory } from 'vue-router';
import { ROUTER_WHITE_LIST } from '@/config';
import { errorRouter, layoutRouter, staticRouter } from '@/routers/modules/staticRouter';
import { useUserStore } from '@/stores';
import {initPermission} from '@/utils/initPermission';

const { start, done } = useNProgress(0, {
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
});
const LOGIN_URL = '/chat/nut_login';
const router = createRouter({
  history: createWebHistory(),
  routes: [...layoutRouter, ...staticRouter, ...errorRouter],
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 路由前置守卫
let isInit = false

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  start()


  // ⭐ 1. 已在登录页，直接放行（防死循环关键）
  if (to.path === '/chat/nut_login') {
    return next()
  }

  // ❌ 2. 没登录才跳登录页
  if (!userStore.token) {
    return next('/chat/nut_login')
  }

  // ⭐ 3. 动态路由只初始化一次
  if (!isInit) {
    isInit = true

    try {
      await initPermission()
      userStore.setRouteLoaded(true)

      console.log('✅ init finished')

      return next({
        ...to,
        replace: true
      })

    } catch (e) {
      console.error(e)
      userStore.logout()
      return next('/chat/nut_login')
    }
  }

  // ⭐ 4. 正常放行
  next()
})
// 路由跳转错误
router.onError((error) => {
  // 结束全屏动画
  done();
  console.warn('路由错误', error.message);
});

// 后置路由
router.afterEach(() => {
  // 结束全屏动画
  done();
});

export default router;
