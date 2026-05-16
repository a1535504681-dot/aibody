import { get, post, put, del } from '@/utils/request'
import type { BaseResponse } from '@/types/api'

/**
 * 菜单实体
 */
export interface SysMenu {
  id?: number
  parentId?: number
  menuName: string
  path?: string
  component?: string
  permission?: string
  menuType?: number
}

/**
 * 查询菜单列表
 */
export const getMenuList = () => {
  return get<BaseResponse<SysMenu[]>>('/sys/menu/list').json()
}

/**
 * 根据ID查询
 */
export const getMenuById = (id: number) => {
  return get<BaseResponse<SysMenu>>(`/sys/menu/${id}`).json()
}

/**
 * 新增菜单
 */
export const addMenu = (data: SysMenu) => {
  return post<BaseResponse<void>>('/sys/menu/add', data).json()
}

/**
 * 更新菜单
 */
export const updateMenu = (data: SysMenu) => {
  return put<BaseResponse<void>>('/sys/menu/update', data).json()
}

/**
 * 删除菜单
 */
export const deleteMenu = (id: number) => {
  return del<BaseResponse<void>>(`/sys/menu/delete/${id}`).json()
}