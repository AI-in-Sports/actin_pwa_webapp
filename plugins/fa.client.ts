import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"
import {config, library} from "@fortawesome/fontawesome-svg-core"
import {faCheckDouble, faStar} from "@fortawesome/free-solid-svg-icons"

config.autoAddCss = false
library.add(faCheckDouble, faStar)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("FontAwesomeIcon", FontAwesomeIcon)
})
