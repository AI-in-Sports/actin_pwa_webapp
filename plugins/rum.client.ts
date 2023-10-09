//import {ApmVuePlugin} from "@elastic/apm-rum-vue/dist/es"
import { AgentConfigOptions } from "@elastic/apm-rum"

export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter()
    const config = useRuntimeConfig()

    /*nuxtApp.vueApp.use(ApmVuePlugin, {
        router,
        config: {
            serviceName: 'pwa',
            serverUrl: config.public.ELASTIC_APM,
            serviceVersion: '1.0.0',
            logLevel: 'debug',
            environment: 'pwa_env',
            sendCredentials: true
        } as AgentConfigOptions
    })*/
})
