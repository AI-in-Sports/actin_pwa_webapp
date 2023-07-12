export default defineNuxtRouteMiddleware(async (to, from) => {
    if(process.server)
    {
        const { data } =
            await useFetch('/api/isLoggedIn')

        console.log(data.value)
        const loginPath = ["/", "/login", "/register", "/otp/login", "/otp/register"]
        console.log(loginPath.includes(to.path))

        if (loginPath.includes(to.path) && data.value)
            return navigateTo("/report")
        else if (!data.value && to.path === "/report")
            return navigateTo("/")
    }
})