export default defineNuxtRouteMiddleware(async () => {
    if(process.server)
    {
        const store = useAuthStore()

        if (store.token === null) {
            store.logout()

            return navigateTo('/')
        }

        const isLoggedIn =  await store.isLoggedIn()

        if (!isLoggedIn) return navigateTo('/', { redirectCode: 301 })

        return
    }
})