import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"
import {config, library} from "@fortawesome/fontawesome-svg-core"
import {
    faAngleDown, faArrowLeft, faLocationCrosshairs,
    faCheckDouble, faSpinner, faPhoneFlip,
    faCircleCheck, faCircleInfo, faLocationDot,
    faStar, faStethoscope, faTriangleExclamation,
    faXmarkCircle, faStarHalfStroke, faArrowRightFromBracket, faAngleLeft,
} from "@fortawesome/free-solid-svg-icons"
import {faCircleQuestion, faCircleUser} from "@fortawesome/free-regular-svg-icons"

config.autoAddCss = false

library.add(
    faCheckDouble, faStar, faCircleCheck, faXmarkCircle, faPhoneFlip,
    faCircleQuestion, faTriangleExclamation, faCircleInfo,
    faArrowLeft, faLocationCrosshairs, faCircleUser, faLocationDot,
    faStethoscope, faAngleDown, faSpinner, faStarHalfStroke,
    faArrowRightFromBracket, faAngleLeft
)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("FontAwesomeIcon", FontAwesomeIcon)
})
