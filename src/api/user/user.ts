import { get, post, put, del } from '@/utils/request'
import type { BaseResponse } from '@/types/api'

export interface User {
  id?: number
  username: string
  password?: string
  email?: string
  status?: number
}

/**
 * ✅ 用户列表（用 rows）
 */
export const getUserList = () => {
  return get<BaseResponse<User[]>>('/user/list').json()
}

/**
 * ✅ 新增
 */
export const addUser = (data: User) => {
  return post<BaseResponse<number>>('/user/add', data).json()
}

/**
 * ✅ 更新
 */
export const updateUser = (data: User) => {
  return put<BaseResponse<boolean>>('/user/update', data).json()
}

/**
 * ✅ 删除
 */
export const deleteUser = (id: number) => {
  return del<BaseResponse<boolean>>(`/user/${id}`).json()
}