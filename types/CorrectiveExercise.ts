export type Exercise = {
    id: number,
    uuid: string
    name: string
    type: string,
    sets: number
    repetition: number,
    rest: number,
    description: string,
    day: number,
    week: number
    duration: number
    intensity: "Low" | "Medium" | "High"
    done: boolean
}