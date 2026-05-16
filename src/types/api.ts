export interface BaseResponse<T = any> {
  code: number
  data: T
  rows: T
  msg: string
}


