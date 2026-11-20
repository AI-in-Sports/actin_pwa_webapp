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
export enum SolesStatusType {
    NORMAL = 'NORMAL',
    FLAT = 'FLAT',
    HOLLOW = 'HOLLOW'
}

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
export enum ExercisePlaceType {
    HOME = 'HOME',
    WORK = 'WORK',
    HOME_GYM = 'HOME_GYM',
    GYM = 'GYM',
}

export enum ExerciseDaysType {
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY',
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
}
