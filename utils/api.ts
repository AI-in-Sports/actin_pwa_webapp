import {type NitroFetchOptions} from "nitropack"
import {useAuthStore} from "~/stores/auth"
import type {AsyncDataOptions} from "#app/composables/asyncData"
import axios from "axios"

export const useAxios = (auth: boolean = false) => {
    axios.defaults.baseURL = useRuntimeConfig().public.APP_BACKEND

    if (auth) axios.defaults.headers.Authorization = useAuthStore().getToken

    return axios
}

export const apiCall = <T>(endpoint: string, options?: {auth?: boolean} & NitroFetchOptions<any, any> & AsyncDataOptions<any>) => $fetch<T>(endpoint, {
    baseURL: useRuntimeConfig().public.APP_BACKEND,
    headers: {
        "Authorization": options?.auth ? useAuthStore().getToken : ''
    },
    ...options
})

export const apiSSRFetch = <T>(endpoint: string, options?: {lazy?: boolean, auth?: boolean} & NitroFetchOptions<any, any> & AsyncDataOptions<any>) => useFetch<T>(endpoint, {
    baseURL: useRuntimeConfig().public.APP_BACKEND,
    headers: {
        "Authorization": options?.auth ? useAuthStore().getToken : ''
    },
    ...options,
})

export const apiLazySSRFetch = <T>(endpoint: string, options?: {lazy?: boolean, auth?: boolean} & NitroFetchOptions<any, any> & AsyncDataOptions<any>) => useLazyFetch<T>(endpoint, {
    baseURL: useRuntimeConfig().public.APP_BACKEND,
    headers: {
        "Authorization": options?.auth ? useAuthStore().getToken : ''
    },
    ...options
})

