import {Skeletor} from "vue-skeletor"

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component(Skeletor.name, Skeletor)
})
