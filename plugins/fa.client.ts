import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"
import {config, library} from "@fortawesome/fontawesome-svg-core"
import {
    faCheckDouble,
    faCircleCheck, faCircleInfo,
    faStar, faTriangleExclamation,
    faXmarkCircle
} from "@fortawesome/free-solid-svg-icons"
import {faCircleQuestion} from "@fortawesome/free-regular-svg-icons"

config.autoAddCss = false
library.add(faCheckDouble, faStar, faCircleCheck, faXmarkCircle, faCircleQuestion, faTriangleExclamation, faCircleInfo)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("FontAwesomeIcon", FontAwesomeIcon)
})
