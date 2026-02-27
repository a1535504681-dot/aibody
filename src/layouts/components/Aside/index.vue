<!-- Aside 侧边栏 -->
<script setup lang="ts">
import {
  Document,
  Menu as IconMenu,
  Location,
} from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';
import logo from '@/assets/images/logo.svg';
import SvgIcon from '@/components/SvgIcon/index.vue';
import Collapse from '@/layouts/components/Header/components/Collapse.vue';
import { useDesignStore } from '@/stores';
import { useSessionStore } from '@/stores/modules/session';

const route = useRoute();
const designStore = useDesignStore();
const sessionStore = useSessionStore();

const sessionId = computed(() => route.params?.id);
const conversationsList = computed(() => sessionStore.sessionList);
const active = ref<string | undefined>();

onMounted(async () => {
  // 获取会话列表
  await sessionStore.requestSessionList();
  // 高亮最新会话
  if (conversationsList.value.length > 0 && sessionId.value) {
    // 通过 ID 查询详情，设置当前会话 (因为有分页)
  }
});

function handleOpen(key: string, keyPath: string[]) {
  console.log(key, keyPath);
}
function handleClose(key: string, keyPath: string[]) {
  console.log(key, keyPath);
}

watch(
  () => sessionStore.currentSession,
  (newValue) => {
    active.value = newValue ? `${newValue.id}` : undefined;
  },
);

// 创建会话
function handleCreatChat() {
  // 创建会话, 跳转到默认聊天
  sessionStore.createSessionBtn();
}
</script>

<template>
  <div
    class="aside-container" :class="{
      'aside-container-suspended': designStore.isSafeAreaHover,
      'aside-container-collapse': designStore.isCollapse,
      // 折叠且未激活悬停时添加 no-delay 类
      'no-delay': designStore.isCollapse && !designStore.hasActivatedHover,
    }"
  >
    <div class="aside-wrapper">
      <div v-if="!designStore.isCollapse" class="aside-header">
        <div class="flex items-center gap-8px hover:cursor-pointer" @click="handleCreatChat">
          <el-image :src="logo" alt="logo" fit="cover" class="logo-img" />
          <!-- <span class="logo-text max-w-150px text-overflow">Element Plus X</span> -->
        </div>
        <Collapse class="ml-auto" />
      </div>

      <div class="aside-body">
        <div class="creat-chat-btn-wrapper">
          <div class="creat-chat-btn" @click="handleCreatChat">
            <el-icon class="add-icon">
              <Plus />
            </el-icon>
            <span class="creat-chat-text">新对话</span>
            <SvgIcon name="ctrl+k" size="37" />
          </div>
        </div>
        <div class="aside-menu">
          <el-menu
            background-color="transparent" class="el-menu-vertical-demo" router @open="handleOpen"
            @close="handleClose"
          >
            <el-menu-item-group>
              <template #title>
                <el-icon><IconMenu /></el-icon>
                <span>业务菜单</span>
              </template>
              <el-menu-item index="1">
                <el-icon>
                  <Location />
                </el-icon>
                <span>AI-RAG</span>
              </el-menu-item>
              <el-menu-item index="2">
                <el-icon><IconMenu /></el-icon>
                <span>AI-PPT</span>
              </el-menu-item>
              <el-menu-item index="3">
                <el-icon>
                  <Document />
                </el-icon>
                <span>AI-绘画</span>
              </el-menu-item>
              <el-popover
                :width="300" placement="right-start"
                popper-style="box-shadow: 0 2px 12px rgba(0,0,0,0.1);width:170px; padding: 8px;border-radius: 18px;"
              >
                <template #reference>
                  <el-menu-item>
                    <template #title>
                      <el-icon><IconMenu /></el-icon>
                      <span>更多</span>
                    </template>
                  </el-menu-item>
                </template>
                <template #default>
                  <el-menu-item-group>
                    <el-menu-item index="4">
                      <el-icon>
                        <IconMenu />
                      </el-icon>
                      <span>AI-翻译</span>
                    </el-menu-item>
                    <el-menu-item index="5">
                      <el-icon>
                        <IconMenu />
                      </el-icon>
                      <span>AI-代码</span>
                    </el-menu-item>
                  </el-menu-item-group>
                </template>
              </el-popover>
            </el-menu-item-group>
          </el-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 基础样式
.aside-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 11;
  width: var(--sidebar-default-width);
  height: 100%;
  pointer-events: auto;
  background-color: var(--sidebar-background-color);
  border-right: 0.5px solid var(--s-color-border-tertiary, rgb(0 0 0 / 8%));
  .aside-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;

    // 侧边栏头部样式
    .aside-header {
      display: flex;
      align-items: center;
      height: 36px;
      margin: 10px 12px 0;
      .logo-img {
        box-sizing: border-box;
        width: 100%;
        height: 44px;
        padding: 4px;
        overflow: hidden;

        // background-color: #ffffff;
        border-radius: 12%;
        img {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
      }
      .logo-text {
        font-size: 16px;
        font-weight: 700;
        color: rgb(0 0 0 / 85%);
        transform: skewX(-2deg);
      }
    }

    // 侧边栏内容样式
    .aside-body {
      .creat-chat-btn-wrapper {
        padding: 0 12px;
        .creat-chat-btn {
          display: flex;
          gap: 6px;
          align-items: center;
          padding: 8px 6px;
          margin-top: 16px;
          margin-bottom: 6px;
          color: #0057ff;
          cursor: pointer;
          user-select: none;
          background-color: rgb(0 87 255 / 6%);
          border: 1px solid rgb(0 102 255 / 15%);
          border-radius: 12px;
          &:hover {
            background-color: rgb(0 87 255 / 12%);
          }
          .creat-chat-text {
            font-size: 14px;
            font-weight: 700;
            line-height: 22px;
          }
          .add-icon {
            width: 24px;
            height: 24px;
            font-size: 16px;
          }
          .svg-icon {
            height: 24px;
            margin-left: auto;
            color: rgb(0 87 255 / 30%);
          }
        }
      }
      .aside-menu {
        // 侧边栏菜单样式,两个样式都选中
        .el-menu-item,
        .el-sub-menu {
          height: 40px;
          margin: 3px 12px;
          border-radius: 13px;
        }
      }
      .aside-content {
        display: flex;
        flex: 1;
        flex-direction: column;
        height: 100%;
        min-height: 0;

        // 会话列表高度-基础样式
        .conversations-wrap {
          height: calc(100vh - 110px);
          .label {
            display: flex;
            align-items: center;
            height: 100%;
          }
        }
      }
    }
  }
}

// 折叠样式
.aside-container-collapse {
  position: absolute;
  top: 54px;
  z-index: 22;
  height: auto;
  max-height: calc(100% - 110px);
  padding-bottom: 12px;
  overflow: hidden;

  /* 禁用悬停事件 */
  pointer-events: none;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 15px;
  box-shadow:
    0 10px 20px 0 rgb(0 0 0 / 10%),
    0 0 1px 0 rgb(0 0 0 / 15%);
  opacity: 0;

  // 指定样式过渡

  // 向左偏移一个宽度
  transform: translateX(-100%);
  transition: opacity 0.3s ease 0.3s, transform 0.3s ease 0.3s;

  /* 新增：未激活悬停时覆盖延迟 */
  &.no-delay {
    transition-delay: 0s, 0s;
  }
}

// 悬停样式
.aside-container-collapse:hover,
.aside-container-collapse.aside-container-suspended {
  height: auto;
  max-height: calc(100% - 110px);
  padding-bottom: 12px;
  overflow: hidden;
  pointer-events: auto;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 15px;
  box-shadow:
    0 10px 20px 0 rgb(0 0 0 / 10%),
    0 0 1px 0 rgb(0 0 0 / 15%);

  // 直接在这里写悬停时的样式（与 aside-container-suspended 一致）
  opacity: 1;

  // 过渡动画沿用原有设置
  transform: translateX(15px);
  transition: opacity 0.3s ease 0s, transform 0.3s ease 0s;

  // 会话列表高度-悬停样式
  .conversations-wrap {
    height: calc(100vh - 155px) !important;
  }
}

// 样式穿透
:deep() {
  // 会话列表背景色
  .conversations-list {
    background-color: transparent !important;
  }

  // 群组标题样式 和 侧边栏菜单背景色一致
  .conversation-group-title {
    padding-left: 12px !important;
    background-color: var(--sidebar-background-color) !important;
  }
}
</style>
