import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"
import {config, library} from "@fortawesome/fontawesome-svg-core"
import {
    faAngleDown, faArrowLeft, faLocationCrosshairs, faHouse,
    faCheckDouble, faSpinner, faPhoneFlip, faAngleLeft,
    faCircleCheck, faCircleInfo, faLocationDot, faXmark,
    faStar, faStethoscope, faTriangleExclamation, faDumbbell,
    faXmarkCircle, faStarHalfStroke, faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons"
import {faCircleQuestion, faCircleUser} from "@fortawesome/free-regular-svg-icons"

config.autoAddCss = false

library.add(
    faCheckDouble, faStar, faCircleCheck, faXmarkCircle, faDumbbell,
    faCircleQuestion, faTriangleExclamation, faCircleInfo, faHouse,
    faArrowLeft, faLocationCrosshairs, faCircleUser, faPhoneFlip,
    faStethoscope, faAngleDown, faSpinner, faStarHalfStroke,
    faArrowRightFromBracket, faAngleLeft, faXmark, faLocationDot,
)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("FontAwesomeIcon", FontAwesomeIcon)
})
