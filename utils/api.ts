import {type NitroFetchOptions} from "nitropack"
import {useAuthStore} from "~/stores/auth"

export const apiCall = <T>(endpoint: string, options?: {auth?: boolean} & NitroFetchOptions<any, any>) => $fetch<T>(endpoint, {
    baseURL: useRuntimeConfig().public.APP_BACKEND,
    headers: {
        "Authorization": options?.auth ? useAuthStore().getToken : ''
    },
    ...options
})

export const apiSSRFetch = <T>(endpoint: string, options?: {lazy?: boolean, auth?: boolean} & NitroFetchOptions<any, any>) => {
    console.log(useAuthStore().token)

    return useFetch<T>(endpoint, {
        baseURL: useRuntimeConfig().public.APP_BACKEND,
        headers: {
            "Authorization": options?.auth ? useAuthStore().getToken : ''
        },
        ...options
    })
}

export const apiLazySSRFetch = <T>(endpoint: string, options?: {lazy?: boolean, auth?: boolean} & NitroFetchOptions<any, any>) => useLazyFetch<T>(endpoint, {
    baseURL: useRuntimeConfig().public.APP_BACKEND,
    headers: {
        "Authorization": options?.auth ? useAuthStore().getToken : ''
    },
    ...options
})

