/** Formats a number with Persian digits, dropping trailing zeros. */
export const faNumber = (value: number | null | undefined, digits: number = 1) =>
    value === null || value === undefined || Number.isNaN(value)
        ? "—"
        : new Intl.NumberFormat("fa-IR", { maximumFractionDigits: digits }).format(value)

/** WHO adult BMI bands. */
export const bmiBand = (bmi: number): { text: string, tone: "good" | "warn" | "bad" } =>
    bmi < 18.5 ? { text: "کمبود وزن", tone: "warn" }
    : bmi < 25 ? { text: "وزن طبیعی", tone: "good" }
    : bmi < 30 ? { text: "اضافه وزن", tone: "warn" }
    : { text: "چاقی", tone: "bad" }

/** Adult resting heart rate band (60–100 bpm is the usual resting range). */
export const restingHeartRateBand = (bpm: number): { text: string, tone: "good" | "warn" } =>
    bpm < 60 ? { text: "کمتر از محدوده معمول استراحت", tone: "warn" }
    : bpm <= 100 ? { text: "در محدوده معمول استراحت", tone: "good" }
    : { text: "بیشتر از محدوده معمول استراحت", tone: "warn" }

export const toneClass = (tone: "good" | "warn" | "bad") => ({
    good: "bg-mainGreen/10 text-mainGreen",
    warn: "bg-mainYellow/20 text-mainDarkYellow",
    bad: "bg-mainRed/10 text-mainRed"
})[tone]
