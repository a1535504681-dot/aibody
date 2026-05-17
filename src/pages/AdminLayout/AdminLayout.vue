<script setup>
import {
  ArrowDown,
  Avatar,
  Menu,
  User,
} from '@element-plus/icons-vue';

import { useRouter } from 'vue-router';

const router = useRouter();

function logout() {
  localStorage.removeItem('token');

  router.push('/login');
}

function go() {
  router.push('/chat');
}
</script>

<template>
  <div class="admin-container">
    <!-- 左侧菜单 -->
    <div class="left-menu">
      <div class="logo">
        后台管理
      </div>

      <el-menu
        router
        :default-active="$route.path"
        class="menu"
      >
        <el-menu-item index="/admin/user">
          <el-icon>
            <User />
          </el-icon>

          <span>用户管理</span>
        </el-menu-item>

        <el-menu-item index="/admin/Avatar">
          <el-icon>
            <Avatar />
          </el-icon>

          <span>角色管理</span>
        </el-menu-item>

        <el-menu-item index="/admin/menu">
          <el-icon>
            <Menu />
          </el-icon>

          <span>菜单管理</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧 -->
    <div class="right-content">
      <!-- 顶部 -->
      <div class="header">
        <div class="title">
          AI 身体管理后台
        </div>

        <div class="user-info">
          <el-dropdown>
            <span class="dropdown-link">

              admin

              <el-icon>
                <ArrowDown />
              </el-icon>

            </span>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  个人中心
                </el-dropdown-item>

                <el-dropdown-item @click="logout">
                  退出登录
                </el-dropdown-item>
                <el-dropdown-item @click="go">
                  用户中心
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 页面内容 -->
      <div class="main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-container{
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 左侧菜单 */

.left-menu{
  width: 220px;
  background: #304156;
  color: white;
}

.logo{
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  color: white;
  border-bottom: 1px solid #3d4b5f;
}

.menu{
  border-right: none;
  background: #304156;
}

/* 右侧 */

.right-content{
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

/* 顶部 */

.header{
  height: 60px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
  border-bottom: 1px solid #ebeef5;
}

.title{
  font-size: 20px;
  font-weight: bold;
}

.dropdown-link{
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
}

/* 主体 */

.main{
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
