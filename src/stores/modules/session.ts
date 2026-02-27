import type { ChatSessionVo } from '@/api/session/types';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useUserStore } from './user';

export const useSessionStore = defineStore('session', () => {
  const router = useRouter();
  const userStore = useUserStore();

  // 当前选中的会话信息
  const currentSession = ref<ChatSessionVo | null>(null);
  // 设置当前会话
  const setCurrentSession = (session: ChatSessionVo | null) => {
    currentSession.value = session;
  };

  // 会话列表核心状态
  const sessionList = ref<ChatSessionVo[]>([]); // 会话数据列表
  const currentPage = ref(1); // 当前页码（从1开始）
  const pageSize = ref(25); // 每页显示数量
  const hasMore = ref(true); // 是否还有更多数据
  const isLoading = ref(false); // 全局加载状态（初始加载/刷新）
  const isLoadingMore = ref(false); // 加载更多状态（区分初始加载）

  // 创建新对话（按钮点击）
  const createSessionBtn = async () => {
    try {
      // 清空当前选中会话信息
      setCurrentSession(null);
      router.replace({ name: 'chat' });
    }
    catch (error) {
      console.error('createSessionBtn错误:', error);
    }
  };

  // 获取会话列表（核心分页方法）
  const requestSessionList = async (page: number = currentPage.value, force: boolean = false) => {
    // 如果没有token就直接清空
    if (!userStore.token) {
      sessionList.value = [];
      return;
    }

    if (!force && ((page > 1 && !hasMore.value) || isLoading.value || isLoadingMore.value))
      return;

    isLoading.value = page === 1; // 第一页时标记为全局加载
    isLoadingMore.value = page > 1; // 非第一页时标记为加载更多
    console.log('获取前端的userInfo', userStore.userInfo);

    try {
      if (!force)
        currentPage.value = page; // 仅非强制刷新时更新页码
    }
    catch (error) {
      console.error('requestSessionList错误:', error);
    }
    finally {
      isLoading.value = false;
      isLoadingMore.value = false;
    }
  };

  // // 发送消息后创建新会话
  // const createSessionList = async (data: Omit<CreateSessionDTO, 'id'>) => {
  //   if (!userStore.token) {
  //     router.replace({
  //       name: 'chatWithId',
  //       params: {
  //         id: 'not_login',
  //       },
  //     });
  //     return;
  //   }

  //   try {
  //     const res = await create_session(data);
  //     // 创建会话后立刻查询列表会话
  //     // 1. 先找到被修改会话在 sessionList 中的索引（假设 sessionList 是按服务端排序的完整列表）
  //     const targetIndex = sessionList.value.findIndex(session => session.id === `${res.data}`);
  //     // 2. 计算该会话所在的页码（页大小固定为 pageSize.value）
  //     const targetPage
  //       = targetIndex >= 0
  //         ? Math.floor(targetIndex / pageSize.value) + 1 // 索引从0开始，页码从1开始
  //         : 1; // 未找到时默认刷新第一页（可能因排序变化导致位置改变）
  //     // 3. 刷新目标页数据
  //     await requestSessionList(targetPage, true);
  //     // 并将当前勾选信息设置为新增的会话信息
  //     const newSessionRes = await get_session(`${res.data}`);
  //     setCurrentSession(newSessionRes.data);

  //     // 跳转聊天页
  //     router.replace({
  //       name: 'chatWithId',
  //       params: { id: `${res.data.id}` },
  //     });
  //   }
  //   catch (error) {
  //     console.error('createSessionList错误:', error);
  //   }
  // };

  // 加载更多会话（供组件调用）
  const loadMoreSessions = async () => {
    if (hasMore.value)
      await requestSessionList(currentPage.value + 1);
  };

  // 更新会话（供组件调用）
  const updateSession = async (item: ChatSessionVo) => {
    try {
      await update_session(item);
      // 1. 先找到被修改会话在 sessionList 中的索引（假设 sessionList 是按服务端排序的完整列表）
      const targetIndex = sessionList.value.findIndex(session => session.id === item.id);
      // 2. 计算该会话所在的页码（页大小固定为 pageSize.value）
      const targetPage
        = targetIndex >= 0
          ? Math.floor(targetIndex / pageSize.value) + 1 // 索引从0开始，页码从1开始
          : 1; // 未找到时默认刷新第一页（可能因排序变化导致位置改变）
      // 3. 刷新目标页数据
      await requestSessionList(targetPage, true);
    }
    catch (error) {
      console.error('updateSession错误:', error);
    }
  };

  // 删除会话（供组件调用）
  const deleteSessions = async (ids: string[]) => {
    try {
      await delete_session(ids);
      // 1. 先找到被修改会话在 sessionList 中的索引（假设 sessionList 是按服务端排序的完整列表）
      const targetIndex = sessionList.value.findIndex(session => session.id === ids[0]);
      // 2. 计算该会话所在的页码（页大小固定为 pageSize.value）
      const targetPage
        = targetIndex >= 0
          ? Math.floor(targetIndex / pageSize.value) + 1 // 索引从0开始，页码从1开始
          : 1; // 未找到时默认刷新第一页（可能因排序变化导致位置改变）
      // 3. 刷新目标页数据
      await requestSessionList(targetPage, true);
    }
    catch (error) {
      console.error('deleteSessions错误:', error);
    }
  };

  return {
    // 当前选中的会话
    currentSession,
    // 设置当前会话
    setCurrentSession,
    // 列表状态
    sessionList,
    currentPage,
    pageSize,
    hasMore,
    isLoading,
    isLoadingMore,
    // 列表方法
    createSessionBtn,
    // createSessionList,
    requestSessionList,
    loadMoreSessions,
    updateSession,
    deleteSessions,
  };
});
