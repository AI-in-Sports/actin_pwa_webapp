export default defineNuxtRouteMiddleware(async (to, from) => {
    if(process.server)
    {
        const sessionId = to.params.session_id

        const token = useAuthStore().token

        if(!sessionId) return navigateTo("/?act=sid_inv")

        useAuthStore().set("reportSessionId", sessionId)

        if (!token) return navigateTo("/")
    }
})