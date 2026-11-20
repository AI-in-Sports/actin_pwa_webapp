import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker'
import { Cropper } from 'vue-advanced-cropper'
import Vue3Lottie from 'vue3-lottie'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('DatePicker', Vue3PersianDatetimePicker)
    nuxtApp.vueApp.component('Cropper', Cropper)
    nuxtApp.vueApp.use(Vue3Lottie)
})