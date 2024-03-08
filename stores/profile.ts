import {defineStore} from "pinia"
import type {ExerciseDaysType, ExercisePlaceType, SolesStatusType} from "~/stores/survey.types"

export type ProfileStore = {
    user_info: UserInfo,
    showCompleteProfileModal: boolean
}

export type UserInfo = {
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
            showCompleteProfileModal: false,
            user_info: {
                birthday: new Date(),
                weight: 0,
                height: 0,
                exercise_days: ["Saturday"],
                soles_status: "normal",
                exercise_place: ["gym"]
            }
        } as ProfileStore
    },
    getters: {

    },
    actions: {
        toggleCompleteProfileModal ()  {
            this.showCompleteProfileModal = !this.showCompleteProfileModal
        },

        set(item: keyof ProfileStore, key: keyof UserInfo, data: any) {
            this[item as "user_info"][key] = data
        },

        submitSurvey: async (level: "identity" | "extra", ...items: (keyof UserInfo)[]) => {
            const store = selectProperties(useProfileStore().user_info, items)

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