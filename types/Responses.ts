import type {ExerciseDaysType} from "~/stores/survey.types"
import type {Exercise} from "@actin/pwa-layer/types/ce.types"

export type Reservation = {
    name: string,
    date: Date,
    time: string,
    status: "OK" | "PENDING"
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
    exerciseDays: ExerciseDaysType[]
    currentDay: number,
    exercises: Exercise[]
}