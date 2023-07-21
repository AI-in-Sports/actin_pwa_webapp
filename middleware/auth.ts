export default defineNuxtRouteMiddleware(async (to, from) => {
    if(process.server)
    {
        const token = useCookie("token")

        const loginPath = ["/", "/login", "/register", "/otp/login", "/otp/register"]

        if (loginPath.includes(to.path) && token.value)
            return navigateTo("/report")
        else if (!token.value && to.path === "/report")
            return navigateTo("/")
    }
})