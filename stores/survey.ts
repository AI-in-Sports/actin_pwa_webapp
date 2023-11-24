import { defineStore } from 'pinia'
import {selectProperties} from "~/helper"

/*
* Pain point types
*
* knee: زانو
* neck: گردن
* elbow: آرنج
* shoulder: شونه
* wrist: مچ دست
* waist: کمر
* ankle: مچ پا
* pelvis: لگن
* sciatic_nerve: عصب سیاتیک
* */
export type PainPoints =
    "knee" | "neck" | "elbow" | "shoulder" | "wrist" |
    "waist" | "ankle" | "pelvis" | "sciatic_nerve" | "none"

/*
* Soles status types
*
* normal: کف پای عادی
* flat: کف پای صاف
* hollow: کف پای گود
* */
export type SolesStatus = "normal" | "flat" | "hollow"

/*
* Pain types
*
* tingling_and_tingling: گزگز و سوزن سوزن شدن
* paresthesia: خواب رفتن
* numbness: مور مور و بی حسی
* hot_flash: گُر گرفتگی
* */
export type PainType = "tingling_and_tingling" | "paresthesia" | "numbness" | "hot_flash"

/*
* Pain time types
*
* less_than_1m: زیر ۱ ماه
* 1m_to_3m: ۱ ماه تا سه ماه
* 3m_to_6m: ۳ ماه نا ۶ ماه
* more_than_1y: بیش از یکسال
* */
export type PainTimeType = "less_than_1m" | "1m_to_3m" | "3m_to_6m" | "more_than_1y"

/*
* Treatment duration types
*
* less_than_1m: زیر ۱ ماه
* 1m_to_3m: ۱ ماه تا سه ماه
* 3m_to_6m: ۳ ماه نا ۶ ماه
* more_than_1y: بیش از یکسال
* */
export type TreatmentDurationType = "1m_to_3m" | "3m_to_6m" | "more_than_6m"

/*
* Treatment way types
*
* physiotherapy: فیزیوتراپی
* hydrotherapy: آب درمانی
* water_walking: راه رفتن در استخر
* exercise_therapy: ورزش درمانی (حرکت اصلاحی و توانبخشی)
* */
export type TreatmentWayType = "physiotherapy" | "hydrotherapy" | "water_walking" | "exercise_therapy" | "none"

/*
* Body posture at work types
*
* sitting_more: بیشتر نشسته ام
* standing_more: بیشتر ایستاده ام
* walking_more: بیشتر راه میروم
* */
export type BodyPostureAtWorkType = "sitting_more" | "standing_more" | "walking_more"

/*
* Exercise place types
*
* gym: باشگاه
* home_gym: باشگاه خانگی
* home: منزل
* work: منزل
* */
export type ExercisePlaceType = "gym" | "home_gym" | "home" | "work"

export type SurveyState = {
    lastCompleted: number | null

    birthday: Date | null,
    gender: "male" | "female" | null
    weight: number | null,
    height: number | null,
    soles_status: SolesStatus | null,
    pain_points: PainPoints[] | null,
    pain_intensity: number | null,
    pain_type: PainType | null,
    pain_time: PainTimeType | null,
    pain_rate: number | null,
    surgery_history: PainPoints[] | null,
    treatment_duration: TreatmentDurationType | null,
    treatment_duration_done: boolean | null,
    treatment_ways: TreatmentWayType | null,
    body_posture_at_work: BodyPostureAtWorkType | null,
    daily_routine: string | null,
    exercise_place: ExercisePlaceType | null
}

export const useCESurveyStore = defineStore('ce_survey', {
    state: () => {
        return {
            lastCompleted: 1,

            birthday: new Date(),
            gender: "male",
            weight: 0,
            height: 0,
            soles_status: "normal",
            pain_points: null,
            pain_intensity: null,
            pain_type: null,
            pain_time: null,
            pain_rate: null,
            surgery_history: null,
            treatment_duration: null,
            treatment_duration_done: null,
            treatment_ways: null,
            body_posture_at_work: null,
            daily_routine: null,
            exercise_place: null,
        } as SurveyState
    },
    getters: {

    },
    actions: {
        set(key: keyof SurveyState, data: any) {
            this[key] = data
        },

        submitSurvey: async (...items: (keyof SurveyState)[]) => {
            const backend = useRuntimeConfig().public['APP_BACKEND']

            items.push("lastCompleted")

            const store = selectProperties(useCESurveyStore(), items)

            const {data, error, refresh} = await useFetch(`${backend}/survey/ce/update`, {
                headers: { "Authorization": useAuthStore().getToken },
                method: "PATCH",
                body: store
            })

            if (error.value) return false

            return data.value
        },

        getData: async () => {
            const backend = useRuntimeConfig().public['APP_BACKEND']

            const {data, error, refresh} = await useFetch(`${backend}/survey/ce/get`, {
                headers: { "Authorization": useAuthStore().getToken }
            })

            watchEffect(() => refresh())

            if (error.value) return false

            const response = data.value as {
                status: number,
                info?: any,
                message?: string
            }

            if(response.status === 200) {
                for (const infoKey in response.info) {
                    useCESurveyStore().set(infoKey as keyof SurveyState, response.info[infoKey])
                }
            }

            return true
        }
    },
    persist: true
})

export const surveyComputed = (item: keyof SurveyState) =>  computed({
    get() {
        return useCESurveyStore()[item]
    },
    set(value) {
        useCESurveyStore().set(item, value)
    }
})