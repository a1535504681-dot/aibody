import { getInfoApi } from '@/api/auth';
import router from '@/routers';
import { useUserStore } from '@/stores';
import { generateRoutes } from '@/utils/generateRoutes';

export async function initPermission() {
  const userStore = useUserStore();

  // 获取用户信息
  const res = await getInfoApi().json();

  console.log('getInfo', res);

  // 存用户信息
  userStore.setUserInfo(res.data.user);

  // 存菜单
  userStore.setMenus(res.data.menus);

  // 生成动态路由
  const routes = generateRoutes(res.data.menus);

  // 动态添加routes
  routes.forEach((route) => {
    router.addRoute('layout', route);
  });
}
