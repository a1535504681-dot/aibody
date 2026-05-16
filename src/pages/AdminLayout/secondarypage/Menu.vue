<template>
  <div class="page">

    <!-- 顶部操作 -->
    <el-card class="mb10">
      <el-button type="primary" @click="openAdd">
        新增菜单
      </el-button>
    </el-card>

    <!-- 表格 -->
    <el-card>
      <el-table :data="tableData" border style="width: 100%">

        <el-table-column prop="id" label="ID" width="80" />

        <el-table-column prop="menuName" label="菜单名称" />

        <el-table-column prop="path" label="路径" />

        <el-table-column prop="component" label="组件" />

        <el-table-column prop="permission" label="权限标识" />

        <el-table-column prop="menuType" label="类型" width="100" />

        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="openEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">

      <el-form :model="form" label-width="100px">

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

        <el-form-item label="类型">
          <el-input-number v-model="form.menuType" :min="0" :max="2" />
        </el-form-item>

        <el-form-item label="父ID">
          <el-input-number v-model="form.parentId" :min="0" />
        </el-form-item>

      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>

    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  getMenuList,
  addMenu,
  updateMenu,
  deleteMenu,
  type SysMenu
} from '@/api/menu/menu'

/** 表格数据 */
const tableData = ref<SysMenu[]>([])

/** 弹窗 */
const dialogVisible = ref(false)
const dialogTitle = ref('新增菜单')

/** 表单 */
const form = reactive<SysMenu>({
  id: undefined,
  parentId: 0,
  menuName: '',
  path: '',
  component: '',
  permission: '',
  menuType: 0
})

/** 加载数据 */
const loadData = async () => {
  const res = await getMenuList()
  tableData.value = res.data || []
}

/** 打开新增 */
const openAdd = () => {
  dialogTitle.value = '新增菜单'
  Object.assign(form, {
    id: undefined,
    parentId: 0,
    menuName: '',
    path: '',
    component: '',
    permission: '',
    menuType: 0
  })
  dialogVisible.value = true
}

/** 打开编辑 */
const openEdit = (row: SysMenu) => {
  dialogTitle.value = '编辑菜单'
  Object.assign(form, row)
  dialogVisible.value = true
}

/** 提交 */
const handleSubmit = async () => {
  if (form.id) {
    await updateMenu(form)
  } else {
    await addMenu(form)
  }

  dialogVisible.value = false
  loadData()
}

/** 删除 */
const handleDelete = async (id?: number) => {
  if (!id) return
  await deleteMenu(id)
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page {
  padding: 10px;
}
.mb10 {
  margin-bottom: 10px;
}
</style>