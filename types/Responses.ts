import type {JalaaliDateObject} from "jalaali-js"

export type Reservation = {
    name: string,
    date: Date,
    time: string,
    status: "OK" | "PENDING"
}

export type Report = {
    testId: string,
    date: string | Date | JalaaliDateObject
}

export type NormalResponse = {
    status: number,
    message: string
}

export type SurveyStatusResponse = NormalResponse & {
    mode: number
}

export type ExerciseResponse = {
    startDate: Date,
    currentDay: number,
    exercises: {
        uuid: string
        name: string
        sets: number
        duration: number
        intensity: "Low" | "Medium" | "High"
        exercise_number: number
        day_number: number,
        week_number: number,
        done: boolean
    }[][]
}