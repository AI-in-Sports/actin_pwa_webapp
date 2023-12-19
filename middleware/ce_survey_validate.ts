import {isDigit} from "json5/lib/util"

export default defineNuxtRouteMiddleware(async (to) => {
    const pages = 14
    const ceSurvey = useCESurveyStore()

    if (!isDigit(to.params.page.toString())) return navigateTo("/")

    const urlPage = ref(parseInt(to.params.page.toString()))

    if (urlPage.value < 1 || urlPage.value > pages)
        return navigateTo("/ce/survey/1")

    if (urlPage.value != 1 && !ceSurvey.lastCompleted)
        return navigateTo("/ce/survey/1")

    if(ceSurvey.lastCompleted && urlPage.value > ceSurvey.lastCompleted + 1)
        return navigateTo(`/ce/survey/${ceSurvey.lastCompleted + 1}`)

    return
})