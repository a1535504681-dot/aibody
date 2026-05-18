import type { HookFetchPlugin } from 'hook-fetch'
import { ElMessage } from 'element-plus'
import hookFetch from 'hook-fetch'
import { sseTextDecoderPlugin } from 'hook-fetch/plugins'
import router from '@/routers'
import { useUserStore } from '@/stores'

interface BaseResponse {
  code: number
  data: never
  msg: string
  rows: never
}

export const request = hookFetch.create<BaseResponse, 'data' | 'rows'>({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  plugins: [
    sseTextDecoderPlugin({ json: true, prefix: 'data:' }),
  ],
})

function jwtPlugin(): HookFetchPlugin<BaseResponse> {
  return {
    name: 'jwt',

    // ✅ 请求前动态获取 store（关键修复点）
    beforeRequest: async (config) => {
      const userStore = useUserStore()

      config.headers = new Headers(config.headers)
      if (userStore.token) {
        config.headers.set('authorization', `Bearer ${userStore.token}`)
      }

      return config
    },

    // ✅ 响应处理
    afterResponse: async (response) => {
      const userStore = useUserStore()

      const code = response.result?.code

      if (code === 200) {
        return response
      }

      // 403
      if (code === 403) {
        ElMessage.error(response.result?.msg || '无权限访问')

        router.replace({ name: '403' })

        return Promise.reject(response)
      }

      // 401
      if (code === 401) {
        ElMessage.error('登录已过期，请重新登录')

        userStore.logout()
        userStore.openLoginDialog()

        return Promise.reject(response)
      }

      // 其他错误
      ElMessage.error(response.result?.msg || '请求失败')

      return Promise.reject(response)
    },
  }
}

request.use(jwtPlugin())

export const post = request.post
export const get = request.get
export const put = request.put
export const del = request.delete

export default request