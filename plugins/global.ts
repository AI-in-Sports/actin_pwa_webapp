export default defineNuxtPlugin(() => {
    return {
        provide: {
            getHealthy: (deg: number) => {
                deg = Math.abs(deg)
                if (deg >= 0 && deg < 5) return "healthy"
                else if (deg >= 5 && deg < 10) return "need_to_fix"
                else return "dangerous"
            },

            getStarDetail: (score: number):{ full: number, half: boolean } => {
                const stars = score.toString().split('.') as string[]

                return {
                    full: Number(stars[0]),
                    half: stars.length > 1
                }
            }
        }
    }
})