export default defineNuxtRouteMiddleware(async () => {
    if(process.server)
    {
        const store = useAuthStore()

        console.log(store.token)

        if (store.token === null) {
            store.logout()

            return navigateTo('/')
        }

        store.$persist()

        const isLoggedIn =  await store.isLoggedIn()

        console.log(isLoggedIn)

        if (!isLoggedIn) {
            store.logout()
            return navigateTo('/', { redirectCode: 301 })
        }

        return
    }
})