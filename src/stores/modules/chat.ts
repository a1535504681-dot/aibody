import type { ChatMessageVo } from '@/api/chat/types';
import { defineStore } from 'pinia';
import { useUserStore } from './user';

export const useChatStore = defineStore('chat', () => {
  const userStore = useUserStore();

  // 用户头像
  const avatar = computed(() => {
    const userInfo = userStore.userInfo;
    return userInfo?.avatar || 'https://avatars.githubusercontent.com/u/76239030?v=4';
  });

  // 是否开启深度思考
  const isDeepThinking = ref<boolean>(false);

  const setDeepThinking = (value: boolean) => {
    isDeepThinking.value = value;
  };

  // 会议ID对应-聊天记录 map对象
  const chatMap = ref<Record<string, ChatMessageVo[]>>({});

  const setChatMap = (id: string, data: any[]) => {
    chatMap.value[id] = data?.map((item: any) => {
      const isUser = item.messageType === 'USER';
      // const thinkContent = extractThkContent(item.content as string);
      return {
        ...item,
        key: new Date().getTime(),
        role: isUser ? 'user' : 'system',
        placement: isUser ? 'end' : 'start',
        isMarkdown: true,
        loading: false,
        avatar: isUser
          ? avatar
          : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        avatarSize: '42px',
        maxWidth: '100%',
        typing: false,
        // reasoning_content: thinkContent,
        // thinkingStatus: 'end',
        content: extractThkContentAfter(`${item.textContent}` as string),
        thinlCollapse: false,
      };
    });
  };

  // // 对思考中的内容回显做处理
  // function extractThkContent(content: string) {
  //   const regex = /<think>(.*?)<\/think>/s;
  //   const matchResult = content.match(regex);
  //   // 把这些内容从 content 中移除
  //   content = content.replace(regex, '');
  //   return matchResult?.[1] ?? '';
  // }

  // 如果有 </think> 标签，则把 </think> 之后的 内容从 content 中返回
  function extractThkContentAfter(content: string) {
    console.log('传入的正文:', content);

    if (!content.includes('</think>')) {
      if (content.includes('message')) {
        return JSON.parse(content).message;
      }
      return content;
    }

    const regex = /<\/think>(.*)/s;
    const matchResult = content.match(regex);
    // 把这些内容从 content 中移除
    content = content.replace(regex, '');
    return matchResult?.[1] ?? '';
  }

  return {
    chatMap,
    isDeepThinking,
    setChatMap,
    setDeepThinking,
  };
});
