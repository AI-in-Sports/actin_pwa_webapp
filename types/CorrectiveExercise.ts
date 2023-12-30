export type Exercise = {
    uuid: string
    name: string
    sets: number
    duration: number
    intensity: "Low" | "Medium" | "High"
    exercise_number: number
    day_number: number,
    week_number: number,
    done: boolean
}