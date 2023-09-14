export default defineNuxtRouteMiddleware( (toRoute, from) => {
    if (process.server) {
        const token = useCookie("token")

        const loginPath = ["/", "/login", "/register", "/otp/login", "/otp/register"]

        if (from.path === "/" && !token.value) return

        if (loginPath.includes(toRoute.path) && token.value)
            return navigateTo("/report")

        if (!token.value && toRoute.path === "/report")
            return navigateTo("/")

        else return
    }
})