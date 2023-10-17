export default defineNuxtRouteMiddleware( (toRoute, from) => {
    if (process.server) {
        const token = useCookie("token")

        if (token.value !== null && typeof token.value !== 'undefined')
            return navigateTo('/home')
        else return
    }
})