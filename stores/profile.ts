import {defineStore} from "pinia"
import type {ExerciseDaysType, ExercisePlaceType, SolesStatusType} from "~/stores/survey.types"

export type ProfileStore = {
    user_info: UserInfo,
    profile_status: number,
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
            profile_status: -1,
            showCompleteProfileModal: false,
            user_info: {
                birthday: new Date(),
                weight: 0,
                height: 0,
                exercise_days: ["SATURDAY"],
                soles_status: "NORMAL",
                exercise_place: ["GYM"]
            }
        } as ProfileStore
    },
    getters: {

    },
    actions: {
        setProfileStatus(status: number) {
            this.profile_status = status
        },

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