export default defineNuxtPlugin(() => {
    const colors = {
        healthy: '#00FF38',
        normal: '#00FF38',

        need_to_fix: '#F0A300',
        low_kyphosis: '#F0A300',
        low_flatback: '#F0A300',
        low_lordosis: '#F0A300',
        low_swayback: '#F0A300',

        dangerous: '#EC1515',
        high_swayback: '#EC1515',
        high_lordosis: '#EC1515',
        high_flatback: '#EC1515',
        high_kyphosis: '#EC1515',
    }

    return {
        provide: {
            getHealthyColor(healthy: keyof typeof colors): string {
                return colors[healthy]
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