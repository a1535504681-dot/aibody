<script setup lang="ts">
import type { Role } from '@/api/role/role';
import { ElMessage, ElMessageBox } from 'element-plus';

import { nextTick, onMounted, ref } from 'vue';

import {
  addRole,
  bindRoleMenu,
  deleteRole,
  getMenuTree,
  getRoleList,
  getRoleMenus,
  updateRole,
} from '@/api/role/role';

/** 数据 */
const tableData = ref<Role[]>([]);
const menuTree = ref<any[]>([]);

/** 弹窗 */
const dialogVisible = ref(false);
const menuDialog = ref(false);

/** 状态 */
const isEdit = ref(false);
const currentRoleId = ref<number>();

/** tree */
const treeRef = ref();

const defaultProps = {
  children: 'children',
  label: 'menuName',
};

/** 表单 */
const form = ref<Role>({
  roleName: '',
  roleCode: '',
  description: '',
});

/** 初始化 */
onMounted(() => {
  loadRoles();
  loadMenus();
});

/** 角色列表 */
async function loadRoles() {
  const res = await getRoleList();

  tableData.value
    = res?.data?.rows
      || res?.data?.data
      || res?.rows
      || res?.data
      || [];
}

/** 菜单树 */
async function loadMenus() {
  const res = await getMenuTree();

  menuTree.value
    = res?.data?.rows
      || res?.data?.data
      || res?.rows
      || res?.data
      || [];
}

/** 新增 */
function openAdd() {
  isEdit.value = false;
  form.value = { roleName: '', roleCode: '', description: '' };
  dialogVisible.value = true;
}

/** 编辑 */
function openEdit(row: Role) {
  isEdit.value = true;
  form.value = { ...row };
  dialogVisible.value = true;
}

/** 保存角色 */
async function save() {
  if (isEdit.value) {
    await updateRole(form.value);
    ElMessage.success('修改成功');
  }
  else {
    await addRole(form.value);
    ElMessage.success('新增成功');
  }

  dialogVisible.value = false;
  loadRoles();
}

/** 删除 */
function remove(id: number) {
  ElMessageBox.confirm('确定删除该角色吗？', '提示', {
    type: 'warning',
  }).then(async () => {
    await deleteRole(id);
    ElMessage.success('删除成功');
    loadRoles();
  });
}

async function openBindMenu(row: Role) {
  currentRoleId.value = row.id;
  menuDialog.value = true;

  // 1. 获取全部菜单（确保最新）
  const treeRes = await getMenuTree();

  menuTree.value
    = treeRes?.data?.rows
      || treeRes?.data?.data
      || treeRes?.rows
      || treeRes?.data
      || [];

  // 2. 获取已绑定菜单
  const res = await getRoleMenus(row.id!);

  const menuIds: number[] = res?.data ?? [];

  // 3. 等 DOM + tree 更新完成
  await nextTick();

  // 4. 回显已绑定
  treeRef.value?.setCheckedKeys(menuIds);
}

/** 保存角色菜单 */
async function saveRoleMenu() {
  const checkedKeys = treeRef.value.getCheckedKeys();
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys();

  const menuIds = [...checkedKeys, ...halfCheckedKeys];

  await bindRoleMenu({
    roleId: currentRoleId.value!,
    menuIds,
  });

  ElMessage.success('权限绑定成功');
  menuDialog.value = false;
}
</script>

<template>
  <div class="page">
    <!-- 顶部 -->
    <el-card class="mb10">
      <el-button type="primary" @click="openAdd">
        新增角色
      </el-button>
    </el-card>

    <!-- 表格 -->
    <el-card>
      <el-table :data="tableData" border style="width:100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleCode" label="角色编码" />
        <el-table-column prop="description" label="角色描述" />
        <el-table-column prop="createTime" label="创建时间" width="180" />

        <el-table-column label="操作" width="320">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="openEdit(row)">
              编辑
            </el-button>

            <el-button type="warning" size="small" @click="openBindMenu(row)">
              分配菜单
            </el-button>

            <el-button type="danger" size="small" @click="remove(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑角色' : '新增角色'"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" />
        </el-form-item>

        <el-form-item label="角色编码">
          <el-input v-model="form.roleCode" />
        </el-form-item>

        <el-form-item label="角色描述">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="save">
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 分配菜单 -->
    <el-dialog v-model="menuDialog" title="分配菜单" width="500px">
      <el-tree
        ref="treeRef"
        :data="menuTree"
        node-key="id"
        show-checkbox
        default-expand-all
        :props="defaultProps"
      />

      <template #footer>
        <el-button @click="menuDialog = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveRoleMenu">
          保存权限
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page {
  padding: 10px;
}
.mb10 {
  margin-bottom: 10px;
}
</style>
