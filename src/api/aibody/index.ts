import { post,get } from '@/utils/request'
import type { BaseResponse } from '@/types/api'

/** 用户健康档案新增DTO */
export interface UserHealthRequestDTO {
  userId: number

  age?: number

  gender?: string

  height?: number

  weight?: number

  targetWeight?: number

  goal?: string

  activityLevel?: string

  bmi?: number

  bodyFat?: number

  muscleMass?: number
}

/** 新增用户健康数据 */
export const addUserHealth = (data: UserHealthRequestDTO) => {
  return post<BaseResponse<any>>('/health/add', data).json()
}



/** 获取用户健康档案 */
export const getUserHealth = (userId: number) => {
  return get<BaseResponse<any>>(`/health/${userId}`).json()
}