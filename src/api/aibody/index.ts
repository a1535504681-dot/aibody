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


/** 获取体重历史记录 */
export const getWeightHistory = (userId: number) => {
  return get<BaseResponse<any>>(`/history/${userId}`).json()
}



/** AI生成计划 */
export const generateAiPlan = (data: any) => {
  return post<BaseResponse<any>>('/api/ai/generate', data).json()
}

/** 保存计划 */
export const savePlan = (data: any) => {
  return post<BaseResponse<any>>('/api/plan/save', data).json()
}

/** 获取历史列表 */
export const getPlanList = (userId: number) => {
  return get<BaseResponse<any>>('/api/plan/list', {
    params: { userId }
  }).json()
}

/** 获取计划详情 */
export const getPlanDetail = (id: number) => {
  return get<BaseResponse<any>>(`/api/plan/detail/${id}`).json()
}