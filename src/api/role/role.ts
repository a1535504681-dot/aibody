import {
  get,
  post,
  put,
  del
} from '@/utils/request'

import type {
  BaseResponse
} from '@/types/api'

/**
 * 角色
 */
export interface Role {

  id?: number

  roleName: string

  roleCode: string

  description?: string

  createTime?: string
}

/**
 * 角色菜单绑定
 */
export interface RoleMenuDTO {

  roleId: number

  menuIds: number[]
}

/**
 * 菜单
 */
export interface Menu {

  id: number

  menuName: string

  children?: Menu[]
}

/**
 * 查询角色列表
 */
export const getRoleList = () => {

  return get<BaseResponse<Role[]>>(
      '/role/list'
  ).json()
}

/**
 * 新增角色
 */
export const addRole = (
    data: Role
) => {

  return post<BaseResponse<number>>(
      '/role',
      data
  ).json()
}

/**
 * 修改角色
 */
export const updateRole = (
    data: Role
) => {

  return put<BaseResponse<boolean>>(
      '/role',
      data
  ).json()
}

/**
 * 删除角色
 */
export const deleteRole = (
    id: number
) => {

  return del<BaseResponse<boolean>>(
      `/role/${id}`
  ).json()
}

/**
 * 查询菜单树
 */
export const getMenuTree = () => {

  return get<BaseResponse<Menu[]>>(
      '/sys/menu/tree'
  ).json()
}

/**
 * 查询角色已有菜单
 */
export const getRoleMenus = (
    roleId: number
) => {

  return get<BaseResponse<number[]>>(
      `/role/menu/${roleId}`
  ).json()
}

/**
 * 绑定角色菜单
 */
export const bindRoleMenu = (
    data: RoleMenuDTO
) => {

  return post<BaseResponse<boolean>>(
      '/role/menu/bind',
      data
  ).json()
}