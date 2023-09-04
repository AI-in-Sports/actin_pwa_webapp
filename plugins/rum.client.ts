import {ApmVuePlugin} from "@elastic/apm-rum-vue/dist/es"

export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter()
    const config = useRuntimeConfig()

    nuxtApp.vueApp.use(ApmVuePlugin, {
        router,
        config: {
            serviceName: 'pwa',
            serverUrl: config.public.ELASTIC_HOST,
            serviceVersion: '1.0.0',
            logLevel: 'debug'
        }
    })
})
