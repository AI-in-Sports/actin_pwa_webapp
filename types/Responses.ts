import type {JalaaliDateObject} from "jalaali-js"
import type {ExerciseDays} from "~/stores/survey.types"
import type {Exercise} from "@actin/pwa-layer/types/ce.types"

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
    exerciseDays: ExerciseDays[]
    currentDay: number,
    exercises: Exercise[]
}