/** An API failure with the HTTP status (0 when the server could not be reached) and the server's message. */
export class ApiError extends Error {
  constructor(public status: number, public serverMessage?: string) {
    super(
      status === 0 ? 'اتصال به اینترنت برقرار نیست.'
        : status >= 500 ? 'خطا از سمت سرور! لطفا دوباره امتحان کنید.'
          : serverMessage || 'درخواست انجام نشد.',
    )
  }
}

type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
  query?: Record<string, string | undefined>
  /** Send the token when there is one, but do not sign out on 401 (the claim preview works signed out). */
  optionalAuth?: boolean
}

/**
 * Calls to actin_pwa_backend with the member's token. A 401 signs out and goes
 * back to the login screen; every other failure becomes an ApiError.
 */
export const useApi = () => {
  const baseURL = useRuntimeConfig().public.APP_BACKEND as string
  const auth = useAuthStore()

  return async <T>(path: string, options: Options = {}): Promise<T> => {
    try {
      return await $fetch<T>(path, {
        baseURL,
        method: options.method ?? 'GET',
        body: options.body,
        query: options.query,
        headers: auth.token ? { Authorization: auth.getToken } : {},
      })
    } catch (e: any) {
      const status: number = e?.response?.status ?? e?.statusCode ?? 0
      if (status === 401 && !options.optionalAuth) {
        auth.logout()
        await navigateTo('/?expired=1', { replace: true })
      }
      throw new ApiError(status, e?.data?.message)
    }
  }
}
