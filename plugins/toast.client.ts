import Vue3Toasity, {type ToastContainerOptions, type Id} from 'vue3-toastify'
import { toast } from 'vue3-toastify'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Vue3Toasity, {
        autoClose: 3000,
        position: "top-right",
        rtl: true,
        theme: 'dark'
    } as ToastContainerOptions)

    return {
        provide: {
            showToast: toast,
            closeLoading: (loading: Id, msg: string) => toast.update(loading, {
                render: msg,
                type: "error",
                autoClose: true,
                closeOnClick: true,
                isLoading: false
            })
        }
    }
})
