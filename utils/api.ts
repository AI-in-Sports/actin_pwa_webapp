import {type NitroFetchOptions} from "nitropack"

export const apiCall = <T>(endpoint: string, auth: boolean = true, options: NitroFetchOptions<any> = {}) => $fetch<T>(endpoint, {
    baseURL: useRuntimeConfig().public.APP_BACKEND,
    headers: {
        "Authorization": auth === null || auth ? useAuthStore().getToken : ''
    },
    ...options
})

export const apiSSRFetch = <T>(endpoint: string, options?: {lazy?: boolean, auth?: boolean} & NitroFetchOptions<any, any>) => useFetch<T>(endpoint, {
    baseURL: useRuntimeConfig().public.APP_BACKEND,
    headers: {
        "Authorization": options?.auth ? useAuthStore().getToken : ''
    },
    ...options
})