export default defineNuxtRouteMiddleware(async () => {
    if(process.server)
    {
        const token = useAuthStore().token

        if (token !== null && typeof token !== 'undefined')
            return navigateTo('/home')

        return
    }
})