import type {Survey1, SurveyState} from "~/stores/survey.types"
import type {Ref} from "vue"

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