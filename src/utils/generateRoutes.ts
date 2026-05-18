import type { RouteRecordRaw } from 'vue-router';
import { getComponent } from '@/routers/getComponent';

export function generateRoutes(menus: any[]): RouteRecordRaw[] {
  return menus.map((menu) => {
    const route: RouteRecordRaw = {
      path: menu.path,
      name: menu.menuName,
    };


    // ⭐ 页面组件
    if (menu.component) {
      route.component = getComponent(menu.component);
    }

    // ⭐ 只有真正有子节点才递归
    if (Array.isArray(menu.children) && menu.children.length > 0) {
      route.children = generateRoutes(menu.children);
    }
    return route;
  });
}
