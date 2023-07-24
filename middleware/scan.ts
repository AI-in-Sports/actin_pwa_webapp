export default defineNuxtRouteMiddleware(async (to, from) => {
    if(process.server)
    {
        const sessionId = to.params.session_id

        const token = useCookie("token")

        if(!sessionId)
            return navigateTo("/?act=sid_inv")

        if (!token.value)
        {
            useCookie("signInSession").value = sessionId.toString()
            return navigateTo("/")
        }

        useCookie("signInSession").value = sessionId.toString()
    }
})