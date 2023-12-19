export default defineNuxtRouteMiddleware(async () => {
    if (process.server) {
        const survey = useCESurveyStore()

        const data = await survey.getData()

        if (!data || survey.lastCompleted === 14)
            return navigateTo("/ce/survey/1", {redirectCode: 301})

        return navigateTo(`/ce/survey/${survey.lastCompleted! > 1 ? survey.lastCompleted! + 1 : 1}`, {redirectCode: 301})
    }
})