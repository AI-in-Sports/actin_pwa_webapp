/** localStorage flag: the visitor has seen the welcome screen (pages/welcome.vue). */
export const WELCOME_SEEN_KEY = "actin_welcome_seen"

export const hasSeenWelcome = () => {
    try { return localStorage.getItem(WELCOME_SEEN_KEY) === "1" } catch { return true }
}

/** Persian short date, for example «۴ آذر ۱۴۰۵». */
export const faDate = (value: string | Date | null | undefined) =>
    value ? new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) : ""
