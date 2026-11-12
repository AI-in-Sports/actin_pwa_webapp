/**
 * Client for the mirror linking API in actin_pwa_backend (/mirror/v1/link/...).
 *
 * A mirror test session is addressed by a `ref`: either the session id carried in the
 * QR link (app.actinhealth.ir/scan/<sessionId>) or the 6-digit code shown on the mirror.
 * Claiming by session id also needs the code; claiming by code needs nothing else.
 */

export type MirrorTest = "posture" | "heart_rate" | "body_composition"

export type LinkStatus = "pending" | "ready" | "claimed" | "needs_review" | "rejected" | "expired" | "cancelled"

export type CenterType = "club" | "organization" | "pharmacy"

export type LinkPreview = {
    session_id: string
    status: LinkStatus
    /** False when the ref already is the code; true for the QR link while the center requires the code. */
    requires_code: boolean
    center: { name: string, type: CenterType }
    tests: MirrorTest[]
    expires_at: string | null
    claimed_by_you: boolean
}

export type HeartRateResult = {
    bpm: number
    measured_at?: string
    hrv_ms?: number | null
    duration_s?: number | null
    samples_bpm?: number[] | null
}

export type BodyCompositionResult = {
    weight_kg: number
    measured_at?: string
    bmi?: number | null
    body_fat_pct?: number | null
    muscle_mass_kg?: number | null
    body_water_pct?: number | null
    bone_mass_kg?: number | null
    visceral_fat?: number | null
    bmr_kcal?: number | null
    impedance_ohm?: number | null
}

export type LinkResults = {
    session_id: string
    measured_at: string
    center: { name: string, type: CenterType }
    /** Same graded shape as report.analyze.zones in the posture report. */
    posture?: any
    heart_rate?: HeartRateResult | null
    body_composition?: BodyCompositionResult | null
}

export type ClaimOutcome =
    | { kind: "claimed", sessionId: string }
    | { kind: "needs_review", sessionId: string }
    | { kind: "error", reason: ClaimError, message?: string, attemptsLeft?: number }

export type ClaimError =
    | "wrong_code"      // 400 / 422: code does not match the session
    | "not_member"      // 403: center only accepts its own members
    | "not_found"       // 404
    | "conflict"        // 409: claimed by another account, or the mirror is still measuring
    | "taken"           // claimed by another account (from the preview)
    | "rejected"        // the center declined the claim
    | "expired"         // 410: expired or cancelled
    | "locked"          // 429: too many wrong codes
    | "unauthorized"    // token missing or expired
    | "server"

/** True when the ref is the short numeric code rather than a QR session id (length is configurable, 4 to 9). */
export const isLinkCode = (ref: string) => /^\d{4,9}$/.test(ref)

/** Accepts Persian/Arabic digits and stray spaces, returns ASCII digits only. */
export const normalizeCode = (value: string) =>
    value
        .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
        .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
        .replace(/\D/g, "")

const statusOf = (error: unknown): number | undefined =>
    (error as { status?: number, statusCode?: number, response?: { status?: number } })?.status ??
    (error as { statusCode?: number })?.statusCode ??
    (error as { response?: { status?: number } })?.response?.status

const messageOf = (error: unknown): string | undefined =>
    (error as { data?: { message?: string } })?.data?.message

const attemptsLeftOf = (error: unknown): number | undefined =>
    (error as { data?: { attempts_left?: number } })?.data?.attempts_left

const base = (ref: string) => `/mirror/v1/link/sessions/${encodeURIComponent(ref)}`

export const useMirrorLink = () => {
    const call = <T>(path: string, options: { method?: "GET" | "POST", body?: any, auth?: boolean } = {}) => {
        const store = useAuthStore()
        const headers: Record<string, string> = {}

        if (options.auth || store.token) headers.Authorization = store.getToken

        return $fetch<T>(path, {
            baseURL: useRuntimeConfig().public.APP_BACKEND as string,
            method: options.method ?? "GET",
            body: options.body,
            headers
        })
    }

    /** Returns null when the backend does not know this ref (legacy posture QR or a typo). */
    const preview = async (ref: string): Promise<LinkPreview | null> => {
        try {
            return await call<LinkPreview>(base(ref))
        } catch (error) {
            if (statusOf(error) === 404) return null
            throw error
        }
    }

    const claim = async (ref: string, linkCode?: string): Promise<ClaimOutcome> => {
        try {
            const response = await call<{ session_id: string, status?: LinkStatus }>(`${base(ref)}/claim`, {
                method: "POST",
                auth: true,
                body: linkCode ? { link_code: linkCode } : undefined
            })

            return response.status === "needs_review"
                ? { kind: "needs_review", sessionId: response.session_id }
                : { kind: "claimed", sessionId: response.session_id }
        } catch (error) {
            const status = statusOf(error)
            const message = messageOf(error)

            const reason: ClaimError =
                status === 400 || status === 422 ? "wrong_code"
                : status === 401 ? "unauthorized"
                : status === 403 ? "not_member"
                : status === 404 ? "not_found"
                : status === 409 ? "conflict"
                : status === 410 ? "expired"
                : status === 429 ? "locked"
                : "server"

            return { kind: "error", reason, message, attemptsLeft: attemptsLeftOf(error) }
        }
    }

    const results = (ref: string) => call<LinkResults>(`${base(ref)}/results`, { auth: true })

    return { preview, claim, results }
}

export const TEST_LABELS: Record<MirrorTest, string> = {
    posture: "ارزیابی وضعیت بدنی",
    heart_rate: "ضربان قلب",
    body_composition: "ترکیب بدن"
}

export const CENTER_LABELS: Record<CenterType, string> = {
    club: "باشگاه",
    organization: "سازمان",
    pharmacy: "داروخانه"
}

export const CLAIM_ERROR_TEXT: Record<ClaimError, string> = {
    wrong_code: "کد وارد شده با این تست مطابقت ندارد.",
    not_member: "این مرکز فقط نتایج اعضای خود را ثبت می‌کند. لطفا با پذیرش مرکز تماس بگیرید.",
    not_found: "تستی با این کد پیدا نشد.",
    conflict: "این تست قبلا برای حساب دیگری ثبت شده است.",
    taken: "این تست قبلا برای حساب دیگری ثبت شده است.",
    rejected: "مرکز ثبت این نتیجه در حساب شما را تایید نکرد. لطفا با پذیرش مرکز تماس بگیرید.",
    expired: "مهلت ثبت این تست تمام شده یا تست لغو شده است. لطفا تست را دوباره انجام دهید.",
    locked: "تعداد تلاش‌های ناموفق زیاد بود. چند دقیقه دیگر دوباره امتحان کنید.",
    unauthorized: "نشست شما منقضی شده است. لطفا دوباره وارد شوید.",
    server: "خطا از سمت سرور! لطفا دوباره امتحان کنید."
}
