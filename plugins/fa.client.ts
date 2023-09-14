import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"
import {config, library} from "@fortawesome/fontawesome-svg-core"
import {
    faArrowRight,
    faCheckDouble,
    faCircleCheck, faCircleInfo, faLocationCrosshairs,
    faStar, faStethoscope, faTriangleExclamation,
    faXmarkCircle
} from "@fortawesome/free-solid-svg-icons"
import {faCircleQuestion, faCircleUser} from "@fortawesome/free-regular-svg-icons"

config.autoAddCss = false

library.add(
    faCheckDouble, faStar, faCircleCheck, faXmarkCircle,
    faCircleQuestion, faTriangleExclamation, faCircleInfo,
    faArrowRight, faLocationCrosshairs, faCircleUser,
    faStethoscope
)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("FontAwesomeIcon", FontAwesomeIcon)
})
