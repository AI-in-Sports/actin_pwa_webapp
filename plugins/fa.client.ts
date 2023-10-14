import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"
import {config, library} from "@fortawesome/fontawesome-svg-core"
import {
    faAngleDown, faArrowLeft, faLocationCrosshairs,
    faCheckDouble, faSpinner, faMobileScreenButton,
    faCircleCheck, faCircleInfo, faLocationDot,
    faStar, faStethoscope, faTriangleExclamation,
    faXmarkCircle, faStarHalfStroke, faPhoneFlip,
} from "@fortawesome/free-solid-svg-icons"
import {faCircleQuestion, faCircleUser} from "@fortawesome/free-regular-svg-icons"

config.autoAddCss = false

library.add(
    faCheckDouble, faStar, faCircleCheck, faXmarkCircle,
    faCircleQuestion, faTriangleExclamation, faCircleInfo,
    faArrowLeft, faLocationCrosshairs, faCircleUser, faLocationDot,
    faStethoscope, faAngleDown, faSpinner, faStarHalfStroke,
    faMobileScreenButton, faPhoneFlip
)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("FontAwesomeIcon", FontAwesomeIcon)
})
