export default defineNuxtRouteMiddleware(async () => {
    if(process.server)
    {
        const token = useCookie("token")

        console.log(process.env.EXPRESS_BACKEND)

        const { error } = await useFetch(`${process.env.EXPRESS_BACKEND}/auth/info`, {
            headers: {
                "Authorization": `Bearer ${token.value}`
            }
        })

        if (error.value) {
            token.value = null
            useCookie("phone").value = null

            navigateTo("/")
        }
    }
})