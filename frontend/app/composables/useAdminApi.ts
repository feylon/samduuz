import { FetchError } from 'ofetch'
import type { NitroFetchOptions } from 'nitropack'
import type { ApiResponse } from '~/types/api'

type RequestOptions = NitroFetchOptions<string> & { silent?: boolean }

export const extractErrorMessage = (error: unknown) => {
  if (error instanceof FetchError) {
    const payload = error.data as Partial<ApiResponse<null>> | undefined
    const details = payload?.errors?.map(item => item.message).filter(Boolean)
    if (details?.length) return details.join('\n')
    if (payload?.message) return payload.message
    if (!error.response) return 'Serverga ulanib bo‘lmadi. Internet aloqasini tekshiring.'
  }
  return 'Kutilmagan xatolik yuz berdi'
}

export const useAdminApi = () => {
  const auth = useAuth()
  const toast = useToast()
  const baseURL = useApiBase()

  const send = <T>(url: string, options: RequestOptions) =>
    $fetch<ApiResponse<T>>(url, {
      ...options,
      baseURL,
      headers: {
        ...(options.headers as Record<string, string> | undefined),
        ...(auth.accessToken.value ? { Authorization: `Bearer ${auth.accessToken.value}` } : {})
      }
    } as NitroFetchOptions<string>)

  const request = async <T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> => {
    try {
      return await send<T>(url, options)
    } catch (error) {
      if (error instanceof FetchError && error.statusCode === 401) {
        const refreshed = await auth.refresh()
        if (refreshed) return send<T>(url, options)
        await navigateTo({ path: '/auth/login', query: { redirect: useRoute().fullPath } })
      }
      if (!options.silent) {
        toast.add({ title: 'Xatolik', description: extractErrorMessage(error), color: 'error', icon: 'i-lucide-circle-alert' })
      }
      throw error
    }
  }

  const get = async <T>(url: string, query?: Record<string, unknown>) => (await request<T>(url, { query })).data

  const save = async <T>(url: string, body: unknown, method: 'POST' | 'PUT' = 'POST') => {
    const response = await request<T>(url, { method, body: body as Record<string, unknown> })
    toast.add({ title: response.message, color: 'success', icon: 'i-lucide-check' })
    return response.data
  }

  const remove = async (url: string, body?: unknown) => {
    const response = await request<null>(url, { method: 'DELETE', body: body as Record<string, unknown> })
    toast.add({ title: response.message, color: 'success', icon: 'i-lucide-trash-2' })
  }

  return { request, get, save, remove }
}
