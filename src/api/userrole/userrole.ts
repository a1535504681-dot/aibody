import { get, post } from '@/utils/request'
import type { BaseResponse } from '@/types/api'

export interface UserRoleDTO {
  userId: number
  roleId: number
}

/** 绑定用户角色 */
export const bindUserRole = (data: UserRoleDTO) => {
  return post<BaseResponse<any>>('/user/role/bind', data).json()
}

/** 查询用户角色 */
export const getUserRole = (userId: number) => {
  return get<BaseResponse<number | null>>(`/user/role/${userId}`).json()
}