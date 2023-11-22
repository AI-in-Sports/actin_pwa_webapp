export default defineNuxtRouteMiddleware(async (to) => {
    await useCESurveyStore().getData()

    return
})