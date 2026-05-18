import type { LoginUser } from '@/api/auth/types';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string>();

    const router = useRouter();
          const isRouteLoaded = ref(false)

    const setRouteLoaded = (value: boolean) => {
        isRouteLoaded.value = value
                  }
                  //存角色id
// const roles = ref<string[]>([])

// const setRoles = (list: string[]) => {
//   roles.value = list
// }

    // token
    const setToken = (value: string) => {
      token.value = value;
    };

    const clearToken = () => {
      token.value = void 0;
    };

    // 用户信息
    const userInfo = ref<LoginUser>();

    const setUserInfo = (value: LoginUser) => {
      userInfo.value = value;
    };

    const clearUserInfo = () => {
      userInfo.value = void 0;
    };

    // ⭐ 动态菜单
    const menus = ref<any[]>([]);

    const setMenus = (value: any[]) => {
      menus.value = value;
    };

    const clearMenus = () => {
      menus.value = [];
    };

    // 退出登录
    const logout = async () => {
      clearToken();
      clearUserInfo();
      clearMenus();
      router.replace({
        name: 'chat',
      });
    };

    // 登录弹框
    const isLoginDialogVisible = ref(false);

    const openLoginDialog = () => {
      isLoginDialogVisible.value = true;
    };

    const closeLoginDialog = () => {
      isLoginDialogVisible.value = false;
    };

    return {
      // token
      token,
      setToken,
      clearToken,

      // user
      userInfo,
      setUserInfo,
      clearUserInfo,

      // ⭐ menus
      menus,
      setMenus,
      clearMenus,

      // logout
      logout,

      // login dialog
      isLoginDialogVisible,
      openLoginDialog,
      closeLoginDialog,

        //路由
      isRouteLoaded,
      setRouteLoaded,
    };
  },
  {
    persist: true,
  },
);
