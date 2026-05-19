import { getInfoApi } from '@/api/auth'
import router from '@/routers'
import { useUserStore } from '@/stores'
import { generateRoutes } from '@/utils/generateRoutes'

export async function initPermission() {
  const userStore = useUserStore()

  const res = await getInfoApi().json()


  // 1. 存 store
  userStore.setMenus(res.data.menus)
  // userStore.setRoles(res.data.roles)  // 存角色id

userStore.setUserId(res.data.user.id)



  

  // 2. 生成路由
  const routes = generateRoutes(res.data.menus)

  // 3. 注册路由
  routes.forEach(route => {
    if (!router.hasRoute(route.name as string)) {
      router.addRoute('layout', route)
    }
  })

  // 4. ⚠️ 必须等待 router ready
  await router.replace(router.currentRoute.value.fullPath)
}