import { defineStore } from 'pinia'
import {selectProperties} from "~/helper"
import type {Survey1, SurveyState} from "~/stores/survey.types"

export const useCESurveyStore = defineStore('ce_survey', {
    state: () => {
        return {
            survey1: {
                lastCompleted: 0,
                birthday: new Date(),
                weight: 0,
                height: 0,
                soles_status: "normal",
                exercise_place: ["gym"]
            },
        } as SurveyState
    },
    getters: {

    },
    actions: {
        set(survey: keyof SurveyState, key: keyof Survey1, data: any) {
            this[survey][key] = data
        },

        submitSurvey: async (survey: keyof SurveyState, ...items: (keyof Survey1)[]) => {
            items.push("lastCompleted")

            const store = selectProperties(useCESurveyStore()[survey], items)

            const {data, error} = await apiSSRFetch(`/ce/survey/update/${survey}`, {
                method: "PATCH",
                auth: true,
                body: store
            })

            if (error.value) return false

            return data.value
        },

        getData: async (survey: "survey1") => {

            const {data, error, refresh} = await apiSSRFetch<{
                status: number,
                info?: Survey1,
                message?: string
            }>(`/ce/survey/get/${survey}`, {
                auth: true
            })

            watchEffect(() => refresh())

            if (error.value) return false

            if(data.value?.status === 200) {
                let infoKey: keyof Survey1
                for (infoKey in data.value.info) {
                    useCESurveyStore().set("survey1", infoKey as keyof Survey1, data.value.info![infoKey])
                }
            }

            else useCESurveyStore().$reset()

            return true
        }
    },
    persist: true
})

export const surveyComputed = (survey: keyof SurveyState, item: keyof Survey1) => computed({
    get() {
        return useCESurveyStore()[survey][item] as number | string[] | string | boolean
    },
    set(value) {
        useCESurveyStore().set(survey, item, value)
    }
})

export const selectItem = (survey: keyof SurveyState, state: keyof Survey1, value: string) => {
    const ref = surveyComputed(survey, state) as Ref<string[]>

    const index = ref.value!.indexOf(value)
    const none_index = ref.value!.indexOf("none")

    if (value === "none") {
        ref.value = []
        ref.value!.push(value)

        return
    }
    else if (none_index > -1) ref.value!.splice(none_index, 1)


    if (index > -1) ref.value!.splice(index, 1)
    else ref.value!.push(value)
}