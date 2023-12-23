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
export type PainPointsType =
    "knee" | "neck" | "elbow" | "shoulder" | "wrist" |
    "waist" | "ankle" | "pelvis" | "sciatic_nerve" | "none"

/*
* Soles status types
*
* normal: کف پای عادی
* flat: کف پای صاف
* hollow: کف پای گود
* */
export type SolesStatusType = "normal" | "flat" | "hollow"

/*
* Pain types
*
* tingling_and_tingling: گزگز و سوزن سوزن شدن
* paresthesia: خواب رفتن
* numbness: مور مور و بی حسی
* hot_flash: گُر گرفتگی
* */
export type PainTypesType = "tingling_and_tingling" | "paresthesia" | "numbness" | "hot_flash" | "none"

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

export type Survey1 = {
    lastCompleted: number | null
    birthday: Date | null,
    weight: number | null,
    height: number | null,
    soles_status: SolesStatusType | null,
    exercise_place: ExercisePlaceType[] | null
}

export type SurveyState = {
    survey1: Survey1
    /* pain_points: PainPoints[] | null,
     pain_intensity: number | null,
     pain_type: PainType[] | null,
     pain_time: PainTimeType | null,
     pain_rate: number | null,
     surgery_history: PainPoints[] | null,
     treatment_duration: TreatmentDurationType | null,
     treatment_duration_done: boolean | null,
     treatment_ways: TreatmentWayType[] | null,
     body_posture_at_work: BodyPostureAtWorkType | null,
     daily_routine: string | null,*/
}