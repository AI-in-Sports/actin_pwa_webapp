import axios from "axios"

export default defineNuxtRouteMiddleware(async () => {
    if(process.server)
    {
        const token = useCookie("token")

        let error = null

        await axios
            .get(`${process.env.EXPRESS_BACKEND}/auth/info`, {
                headers: {
                    "Authorization": `Bearer ${token.value}`
                }
            })
            .then(() => {})
            .catch(() => {
                error = true
            })

        if (error) {
            token.value = null
            useCookie("phone").value = null

            return navigateTo("/")
        }
    }
})