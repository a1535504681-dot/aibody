<!-- 默认消息列表页 -->
<script setup lang="ts">
import { Sender } from 'vue-element-plus-x';
import { useRouter } from 'vue-router';
import WelecomeText from '@/components/WelecomeText/index.vue';
import { useUserStore } from '@/stores';

const senderValue = ref('');
const userStore = useUserStore();
const router = useRouter();
const senderRef = ref<InstanceType<typeof Sender> | null>(null);

async function handleSend() {
  const messageContent = senderValue.value;
  localStorage.setItem('chatContent', messageContent);
  senderValue.value = '';
  if (!userStore.token) {
    router.replace({
      name: 'chatWithId',
      params: {
        id: 'not_login',
      },
    });
  }
  else {
    // 跳转聊天页 根据用户id来即可，聊天消息存储在pinia中，进入聊天页根据用户id来获取对应的聊天消息，如果没有就新建一个聊天记录
    router.replace({
      name: 'chatWithId',
      params: { id: `${userStore.userInfo?.userId}` },
    });
  }
}
</script>

<template>
  <div class="chat-defaul-wrap">
    <WelecomeText />
    <Sender
      ref="senderRef"
      v-model="senderValue"
      class="chat-defaul-sender"
      clearable
      :auto-size="{
        maxRows: 8,
        minRows: 4,
      }"
      @submit="handleSend"
    />
  </div>
</template>

<style scoped lang="scss">
.chat-defaul-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  min-height: 450px;
  .chat-defaul-sender {
    width: 100%;
  }
}
</style>
