export default defineNuxtPlugin(() => {
    return {
        provide: {
            getHealthy: (deg: number) => {
                deg = Math.abs(deg)
                if (deg >= 0 && deg < 5) return "healthy"
                else if (deg >= 5 && deg < 10) return "need_to_fix"
                else return "dangerous"
            }
        }
    }
})