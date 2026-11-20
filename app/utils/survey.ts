
import type {Ref} from "vue"
import type {ProfileStore, UserInfo} from "~/stores/profile"

export const surveyComputed = (survey: keyof ProfileStore, item: keyof UserInfo) => computed({
    get() {
        return useProfileStore()[survey as "user_info"][item] as number | string[] | string | boolean | Date | undefined
    },
    set(value) {
        useProfileStore().set(survey, item, value)
    }
})

export const selectItem = (survey: keyof ProfileStore, state: keyof UserInfo, value: string, canEmpty: boolean = true) => {
    const ref = surveyComputed(survey, state) as Ref<string[]>

    const index = ref.value!.indexOf(value)
    const none_index = ref.value!.indexOf("none")

    if (value === "none") {
        ref.value = []
        ref.value!.push(value)

        return
    }
    else if (none_index > -1) ref.value!.splice(none_index, 1)

    if (
        (index > -1 && canEmpty && ref.value.length >= 1) ||
        (index > -1 && !canEmpty && ref.value.length > 1)
    ) ref.value!.splice(index, 1)
    else ref.value!.push(value)
}