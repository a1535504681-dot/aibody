<template>
  <div class="page">

    <!-- 顶部 -->
    <el-card class="mb10">
      <el-button type="primary" @click="openAdd">
        新增用户
      </el-button>
    </el-card>

    <!-- 表格 -->
    <el-card>
      <el-table :data="tableData" border style="width: 100%">

        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />

        <!-- 🔥 新增：角色 -->
        <el-table-column label="角色">
          <template #default="{ row }">
            {{ row.roleName || '未分配' }}
          </template>
        </el-table-column>

        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="260">

          <template #default="{ row }">

            <el-button size="small" @click="edit(row)">
              编辑
            </el-button>

            <!-- 🔥 新增：绑定角色 -->
            <el-button size="small" type="warning" @click="openRole(row)">
              绑定角色
            </el-button>

            <el-button size="small" type="danger" @click="remove(row.id)">
              删除
            </el-button>

          </template>

        </el-table-column>

      </el-table>
    </el-card>

    <!-- ================= 用户弹窗 ================= -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑用户' : '新增用户'">

      <el-form :model="form">

        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" />
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>

      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>

    </el-dialog>

    <!-- ================= 绑定角色弹窗 ================= -->
    <el-dialog v-model="roleDialog" title="绑定角色">

      <el-select v-model="selectedRoleId" placeholder="请选择角色">
        <el-option
          v-for="r in roleList"
          :key="r.id"
          :label="r.roleName"
          :value="r.id"
        />
      </el-select>

      <template #footer>
        <el-button @click="roleDialog = false">取消</el-button>
        <el-button type="primary" @click="bindRole">
          确定
        </el-button>
      </template>

    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

import {
  getUserList,
  addUser,
  updateUser,
  deleteUser
} from '@/api/user/user'

import {
  getRoleList,
} from '@/api/role/role'

import {
  bindUserRole,
  getUserRole
} from '@/api/userrole/userrole'

import type { User } from '@/types/user'

/** 用户表 */
const tableData = ref<User[]>([])

/** 用户弹窗 */
const dialogVisible = ref(false)

/** 角色弹窗 */
const roleDialog = ref(false)

/** 当前用户 */
const selectedUserId = ref<number | null>(null)
const selectedRoleId = ref<number | null>(null)

/** 角色列表 */
const roleList = ref<any[]>([])

/** 表单 */
const form = ref<User>({
  id: undefined,
  username: '',
  password: '',
  email: '',
  status: 1
})

/** 加载用户 */
const loadData = async () => {
  const res = await getUserList()
  tableData.value = res.rows ?? res.data ?? []
}

/** 加载角色 */
const loadRoles = async () => {
  const res = await getRoleList()
  roleList.value = res.data || []
}

/** 打开绑定角色 */
const openRole = (row: User) => {
  selectedUserId.value = row.id!
  selectedRoleId.value = null
  roleDialog.value = true
}

/** 绑定角色 */
const bindRole = async () => {
  if (!selectedUserId.value || !selectedRoleId.value) return

  await bindUserRole({
    userId: selectedUserId.value,
    roleId: selectedRoleId.value
  })

  ElMessage.success('绑定成功')
  roleDialog.value = false
  loadData()
}

/** CRUD */
const openAdd = () => {
  form.value = { id: undefined, username: '', password: '', email: '', status: 1 }
  dialogVisible.value = true
}

const edit = (row: User) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const submit = async () => {
  if (form.value.id) {
    await updateUser(form.value)
  } else {
    await addUser(form.value)
  }

  dialogVisible.value = false
  loadData()
}

const remove = async (id: number) => {
  await deleteUser(id)
  loadData()
}

onMounted(() => {
  loadData()
  loadRoles()
})
</script>

<style scoped>
.page {
  padding: 20px;
}
.mb10 {
  margin-bottom: 10px;
}
</style>