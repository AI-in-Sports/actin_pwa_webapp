export default defineNuxtRouteMiddleware(async (to) => {
    if (process.server) {
        const survey = useCESurveyStore()

        const data = await survey.getData()

        if (!data || survey.lastCompleted === 14)
            return navigateTo("/survey/ce/1", {redirectCode: 301})

        return navigateTo(`/survey/ce/${survey.lastCompleted! > 1 ? survey.lastCompleted! + 1 : 1}`, {redirectCode: 301})
    }
})