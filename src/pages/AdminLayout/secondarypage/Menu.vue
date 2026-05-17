<script setup lang="ts">
import type { SysMenu } from '@/api/menu/menu';

import { onMounted, reactive, ref } from 'vue';
import {
  addMenu,
  deleteMenu,
  getMenuList,

  updateMenu,
} from '@/api/menu/menu';

/** 扩展 children */
interface MenuTree extends SysMenu {
  children?: MenuTree[];
}

/** 表格数据 */
const tableData = ref<MenuTree[]>([]);

/** tree-select 数据 */
const treeOptions = ref<MenuTree[]>([]);

/** 弹窗 */
const dialogVisible = ref(false);

const dialogTitle = ref('新增菜单');

/** 表单 */
const form = reactive<SysMenu>({
  id: undefined,
  parentId: 0,
  menuName: '',
  path: '',
  component: '',
  permission: '',
  menuType: 0,
});

/**
 * 扁平数组转树
 */
function buildTree(list: SysMenu[]) {
  const map = new Map<number, MenuTree>();

  const result: MenuTree[] = [];

  // 初始化
  list.forEach((item) => {
    map.set(item.id!, {
      ...item,
      children: [],
    });
  });

  // 组装树
  list.forEach((item) => {
    const node = map.get(item.id!)!;

    // 根节点
    if (!item.parentId || item.parentId === 0) {
      result.push(node);
    }
    else {
      const parent = map.get(item.parentId);

      if (parent) {
        parent.children?.push(node);
      }
    }
  });

  return result;
}

/** 加载数据 */
async function loadData() {
  const res = await getMenuList();

  const list = res.data || [];

  const tree = buildTree(list);

  tableData.value = tree;

  treeOptions.value = [
    {
      id: 0,
      menuName: '顶级菜单',
      children: tree,
    },
  ];
}

/** 打开新增 */
function openAdd(row?: SysMenu) {
  dialogTitle.value = '新增菜单';

  Object.assign(form, {
    id: undefined,
    parentId: row?.id || 0,
    menuName: '',
    path: '',
    component: '',
    permission: '',
    menuType: 0,
  });

  dialogVisible.value = true;
}

/** 打开编辑 */
function openEdit(row: SysMenu) {
  dialogTitle.value = '编辑菜单';

  Object.assign(form, {
    ...row,
  });

  dialogVisible.value = true;
}

/** 提交 */
async function handleSubmit() {
  if (form.id) {
    await updateMenu(form);
  }
  else {
    await addMenu(form);
  }

  dialogVisible.value = false;

  loadData();
}

/** 删除 */
async function handleDelete(id?: number) {
  if (!id)
    return;

  await deleteMenu(id);

  loadData();
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="page">
    <!-- 顶部操作 -->
    <el-card class="mb10">
      <el-button type="primary" @click="openAdd()">
        新增菜单
      </el-button>
    </el-card>

    <!-- 树表格 -->
    <el-card>
      <el-table
        :data="tableData"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children' }"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />

        <el-table-column prop="menuName" label="菜单名称" min-width="180" />

        <el-table-column prop="path" label="路径" min-width="180" />

        <el-table-column prop="component" label="组件" min-width="180" />

        <el-table-column prop="permission" label="权限标识" min-width="180" />

        <el-table-column label="菜单类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.menuType === 0" type="primary">
              目录
            </el-tag>

            <el-tag v-else-if="row.menuType === 1" type="success">
              菜单
            </el-tag>

            <el-tag v-else type="warning">
              按钮
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="320">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              @click="openAdd(row)"
            >
              新增子菜单
            </el-button>

            <el-button
              size="small"
              @click="openEdit(row)"
            >
              编辑
            </el-button>

            <el-button
              size="small"
              type="danger"
              @click="handleDelete(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form
        :model="form"
        label-width="100px"
      >
        <el-form-item label="父级菜单">
          <el-tree-select
            v-model="form.parentId"
            :data="treeOptions"
            node-key="id"
            check-strictly
            default-expand-all
            clearable
            :props="{
              label: 'menuName',
              children: 'children',
              value: 'id',
            }"
            placeholder="请选择父级菜单"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="菜单名称">
          <el-input v-model="form.menuName" />
        </el-form-item>

        <el-form-item label="路径">
          <el-input v-model="form.path" />
        </el-form-item>

        <el-form-item label="组件">
          <el-input v-model="form.component" />
        </el-form-item>

        <el-form-item label="权限">
          <el-input v-model="form.permission" />
        </el-form-item>

        <el-form-item label="菜单类型">
          <el-radio-group v-model="form.menuType">
            <el-radio :label="0">
              目录
            </el-radio>

            <el-radio :label="1">
              菜单
            </el-radio>

            <el-radio :label="2">
              按钮
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>

        <el-button
          type="primary"
          @click="handleSubmit"
        >
          确定
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
