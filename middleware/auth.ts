export default defineNuxtRouteMiddleware(async (to) => {
    if(process.server)
    {
        const token = useAuthStore().token

        const checkPath = () => ["/", "/otp/login", "/otp/register"].includes(to.path)
        const checkToken = () => token !== null && typeof token !== 'undefined'

        if (checkPath() && checkToken())
            return navigateTo('/home')

        else if (checkPath() && !checkToken()) {
            return
        }

        return
    }
})