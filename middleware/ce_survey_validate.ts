import {isDigit} from "json5/lib/util"

export default defineNuxtRouteMiddleware(async (to) => {
    const pages = 14
    const ceSurvey = useCESurveyStore()

    await ceSurvey.getData("survey1")

    if (!isDigit(to.params.page.toString())) return navigateTo("/")

    const urlPage = ref(parseInt(to.params.page.toString()))

    if (
        (urlPage.value < 1 || urlPage.value > pages) ||
        (urlPage.value != 1 && !ceSurvey.survey1) ||
        (ceSurvey.survey1.lastCompleted === 0 && urlPage.value > 1)
    ) return navigateTo("/ce/survey/1")

    if(ceSurvey.survey1.lastCompleted && urlPage.value > ceSurvey.survey1.lastCompleted + 1)
        return navigateTo(`/ce/survey/${ceSurvey.survey1.lastCompleted! + 1}`)

    return
})