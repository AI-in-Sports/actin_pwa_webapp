import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker'
import Vue3Lottie from 'vue3-lottie'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('DatePicker', Vue3PersianDatetimePicker)
    nuxtApp.vueApp.use(Vue3Lottie)
})