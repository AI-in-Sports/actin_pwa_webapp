import {defineStore} from "pinia"
import type {ExerciseDaysType, ExercisePlaceType, SolesStatusType} from "~/stores/survey.types"

export type Profile = {
    last_completed: number
    birthday: Date | null
    height: number | null
    weight: number | null
    soles_status: SolesStatusType | null
    exercise_place: ExercisePlaceType[] | null
    exercise_days: ExerciseDaysType[] | null
}

export const useProfileStore = defineStore('profile', {
    state: () => {
        return {
            last_completed: 0,
            birthday: new Date(),
            weight: 0,
            height: 0,
            exercise_days: [],
            soles_status: "normal",
            exercise_place: ["gym"]
        } as Profile
    },
    getters: {

    },
    actions: {
        set(key: keyof Profile, data: any) {
            this[key] = data
        },

        submitSurvey: async (level: "identity" | "extra", ...items: (keyof Profile)[]) => {
            const store = selectProperties(useProfileStore(), items)

            const {data, error} = await useSSRFetch(`/profile/update/${level}`, {
                method: "PATCH",
                auth: true,
                body: store
            })

            if (error.value) return false

            return data.value
        },
    }
})