import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"
import {config, library} from "@fortawesome/fontawesome-svg-core"
import {faCheckDouble, faCircleCheck, faStar, faXmarkCircle} from "@fortawesome/free-solid-svg-icons"

config.autoAddCss = false
library.add(faCheckDouble, faStar, faCircleCheck, faXmarkCircle)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("FontAwesomeIcon", FontAwesomeIcon)
})
